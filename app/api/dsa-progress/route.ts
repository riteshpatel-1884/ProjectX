import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma'; // ← Uses your EXISTING prisma client

// GET - Fetch user's DSA progress and solved problems
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dsaProgress: true,
        problemsSolved: {
          orderBy: { solvedAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      progress: user.dsaProgress,
      problemsSolved: user.problemsSolved
    });
  } catch (error) {
    console.error('Error fetching DSA progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Toggle problem solved status
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, title, difficulty, category, solved } = body;

    if (!problemId || !title || !difficulty || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (solved) {
      // Mark as solved
      const problemSolved = await prisma.dSAProblemSolved.upsert({
        where: {
          userId_problemId: {
            userId: user.id,
            problemId: problemId
          }
        },
        update: {
          solvedAt: new Date()
        },
        create: {
          userId: user.id,
          problemId: problemId,
          title: title,
          difficulty: difficulty,
          category: category
        }
      });

      await updateUserProgress(user.id, difficulty, 'increment');

      return NextResponse.json({ 
        success: true, 
        message: 'Problem marked as solved',
        data: problemSolved 
      });
    } else {
      // Mark as unsolved
      await prisma.dSAProblemSolved.delete({
        where: {
          userId_problemId: {
            userId: user.id,
            problemId: problemId
          }
        }
      });

      await updateUserProgress(user.id, difficulty, 'decrement');

      return NextResponse.json({ 
        success: true, 
        message: 'Problem marked as unsolved' 
      });
    }
  } catch (error) {
    console.error('Error updating problem status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update user progress
async function updateUserProgress(
  userId: string, 
  difficulty: string, 
  operation: 'increment' | 'decrement'
) {
  const increment = operation === 'increment' ? 1 : -1;

  let progress = await prisma.dSAProgress.findUnique({
    where: { userId }
  });

  if (!progress) {
    progress = await prisma.dSAProgress.create({
      data: {
        userId,
        totalProblems: 100,
        easyTotal: 24,
        mediumTotal: 64,
        hardTotal: 12
      }
    });
  }

  const updateData: any = {
    totalSolved: { increment },
    lastSolvedAt: new Date()
  };

  if (difficulty === 'Easy') {
    updateData.easySolved = { increment };
  } else if (difficulty === 'Medium') {
    updateData.mediumSolved = { increment };
  } else if (difficulty === 'Hard') {
    updateData.hardSolved = { increment };
  }

  const updatedProgress = await prisma.dSAProgress.update({
    where: { userId },
    data: updateData
  });

  const completionPercentage = (updatedProgress.totalSolved / updatedProgress.totalProblems) * 100;
  
  await prisma.dSAProgress.update({
    where: { userId },
    data: {
      completionPercentage: parseFloat(completionPercentage.toFixed(1))
    }
  });

  return updatedProgress;
}

// PUT - Initialize progress
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { easyTotal, mediumTotal, hardTotal } = body;

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const progress = await prisma.dSAProgress.upsert({
      where: { userId: user.id },
      update: {
        easyTotal: easyTotal || 24,
        mediumTotal: mediumTotal || 64,
        hardTotal: hardTotal || 12,
        totalProblems: (easyTotal || 24) + (mediumTotal || 64) + (hardTotal || 12)
      },
      create: {
        userId: user.id,
        totalProblems: 100,
        easyTotal: easyTotal || 24,
        mediumTotal: mediumTotal || 64,
        hardTotal: hardTotal || 12
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Progress initialized',
      data: progress 
    });
  } catch (error) {
    console.error('Error initializing progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}