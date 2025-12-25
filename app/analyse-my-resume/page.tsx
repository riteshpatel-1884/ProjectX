'use client';

import { useState } from 'react';

interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  additions: string[];
  deletions: string[];
  keywordAnalysis: {
    matched: string[];
    missing: string[];
  };
  sectionFeedback: {
    section: string;
    score: number;
    feedback: string;
  }[];
  actionItems: string[];
  redFlags: string[];
}

export default function ResumeAnalyser() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    jobType: '',
    jobDescription: '',
    experienceLevel: '',
    yearsOfExperience: '',
    requiredSkills: '',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume');
      return;
    }

    if (!formData.jobType || !formData.jobDescription || !formData.experienceLevel) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('resume', file);
      formDataToSend.append('jobType', formData.jobType);
      formDataToSend.append('jobDescription', formData.jobDescription);
      formDataToSend.append('experienceLevel', formData.experienceLevel);
      formDataToSend.append('yearsOfExperience', formData.yearsOfExperience);
      formDataToSend.append('requiredSkills', formData.requiredSkills);
      formDataToSend.append('companyName', formData.companyName);

      const response = await fetch('/api/analyse-my-resume', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFormData({
      jobType: '',
      jobDescription: '',
      experienceLevel: '',
      yearsOfExperience: '',
      requiredSkills: '',
      companyName: '',
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Get instant AI-powered feedback on your resume tailored to your target role
          </p>
          <p className="text-sm text-gray-500 mt-2">
            🔒 Your resume is processed securely and never stored
          </p>
        </div>

        {!result ? (
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF or DOCX up to 5MB</p>
                    {file && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        ✓ {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job/Internship Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="full-time">Full-Time Job</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-Time</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select level</option>
                  <option value="fresher">Fresher (0 years)</option>
                  <option value="entry">Entry Level (1-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>

              {/* Years of Experience */}
              {formData.experienceLevel !== 'fresher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                    min="0"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Paste the job description here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Node.js, AWS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Google, Microsoft"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resume...
                  </span>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Scores */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="text-sm font-medium opacity-90 mb-2">Overall Resume Score</div>
                  <div className="text-5xl font-bold">{result.overallScore}/10</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
                  <div className="text-sm font-medium opacity-90 mb-2">ATS Compatibility</div>
                  <div className="text-5xl font-bold">{result.atsScore}/10</div>
                </div>
              </div>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {result.weaknesses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-orange-500 mr-2">⚠</span>
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Keyword Analysis */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Keyword Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-600 mb-3">Matched Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.matched.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-3">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.missing.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additions */}
            {result.additions.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-500 mr-2">+</span>
                  What to Add
                </h3>
                <ul className="space-y-3">
                  {result.additions.map((addition, index) => (
                    <li key={index} className="flex items-start bg-green-50 p-4 rounded-lg">
                      <span className="text-green-600 font-bold mr-3">{index + 1}.</span>
                      <span className="text-gray-700">{addition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deletions */}
            {result.deletions.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-red-500 mr-2">−</span>
                  What to Remove
                </h3>
                <ul className="space-y-3">
                  {result.deletions.map((deletion, index) => (
                    <li key={index} className="flex items-start bg-red-50 p-4 rounded-lg">
                      <span className="text-red-600 font-bold mr-3">{index + 1}.</span>
                      <span className="text-gray-700">{deletion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section Feedback */}
            {result.sectionFeedback.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Section-by-Section Feedback</h3>
                <div className="space-y-4">
                  {result.sectionFeedback.map((section, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{section.section}</h4>
                        <span className="text-sm font-semibold text-indigo-600">{section.score}/10</span>
                      </div>
                      <p className="text-gray-700">{section.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {result.actionItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority Action Items</h3>
                <ol className="space-y-3">
                  {result.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-l-4 border-red-500">
                <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                  <span className="mr-2">🚩</span>
                  Red Flags
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-colors"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}