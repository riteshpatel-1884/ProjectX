import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';
// Use the fork which supports default exports properly in Next.js
// Delete the 'import pdf from...' line and use this:
const pdf = require('pdf-parse-fork');

const groq = new Groq({
  apiKey: process.env.GROQ_RESUME_API_KEY,
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  if (userLimit.count >= 50) return false;
  userLimit.count++;
  return true;
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse-fork works directly with the buffer
    const data = await pdf(buffer);
    if (!data.text || data.text.trim().length < 10) {
      throw new Error('PDF is empty or contains only images.');
    }
    return data.text;
  } catch (error: any) {
    console.error('PDF Error:', error);
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error: any) {
    throw new Error('Failed to read DOCX file.');
  }
}

async function analyzeResume(
  resumeText: string,
  jobType: string,
  jobDescription: string,
  experienceLevel: string,
  yearsOfExperience: string,
  requiredSkills: string,
  companyName: string
): Promise<any> {
  // llama-3.3-70b-versatile is the best model currently on Groq
  const MODEL = 'llama-3.3-70b-versatile'; 

  const systemPrompt = `You are an expert ATS specialist. Analyze resumes and return ONLY a valid JSON object. 
  Do not include markdown code blocks or explanations.
  {
    "overallScore": number,
    "atsScore": number,
    "strengths": string[],
    "weaknesses": string[],
    "additions": string[],
    "deletions": string[],
    "keywordAnalysis": { "matched": string[], "missing": string[] },
    "sectionFeedback": [{ "section": string, "score": number, "feedback": string }],
    "actionItems": string[],
    "redFlags": string[]
  }`;

  const userPrompt = `Position: ${jobType} at ${companyName || 'Target Company'}
  Level: ${experienceLevel} (${yearsOfExperience} years exp)
  Required Skills: ${requiredSkills}
  
  Job Description: ${jobDescription.substring(0, 2000)}
  
  Resume: ${resumeText.substring(0, 4000)}`;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Very low for strict JSON formatting
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI.');
    return JSON.parse(content);
  } catch (error: any) {
    throw new Error(`AI Analysis Error: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_RESUME_API_KEY) {
      return NextResponse.json({ error: 'Server Config Error: API Key missing' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Hourly limit reached. Try again later.' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: 'Resume file and job description are required.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = '';

    if (file.type === 'application/pdf') {
      resumeText = await extractTextFromPDF(buffer);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await extractTextFromDOCX(buffer);
    } else {
      return NextResponse.json({ error: 'Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    const analysis = await analyzeResume(
      resumeText,
      formData.get('jobType') as string,
      jobDescription,
      formData.get('experienceLevel') as string,
      formData.get('yearsOfExperience') as string,
      formData.get('requiredSkills') as string,
      formData.get('companyName') as string
    );

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('Final Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed. Please try a different file.' },
      { status: 500 }
    );
  }
}