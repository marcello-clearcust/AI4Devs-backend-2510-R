import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PositionCandidate {
  candidateId: number;
  fullName: string;
  currentInterviewStep: {
    id: number;
    name: string;
  };
  averageScore: number | null;
}

export const getPositionCandidates = async (positionId: number): Promise<PositionCandidate[]> => {
  // First, verify that the position exists
  const position = await prisma.position.findUnique({
    where: { id: positionId },
  });

  if (!position) {
    throw new Error('Position not found');
  }

  // Fetch all applications for this position with related data
  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      interviewStep: {
        select: {
          id: true,
          name: true,
        },
      },
      interviews: {
        select: {
          score: true,
        },
      },
    },
  });

  // Transform the data to the required format
  return applications.map((application) => {
    // Calculate average score from interviews
    const scores = application.interviews
      .map((interview) => interview.score)
      .filter((score): score is number => score !== null);

    const averageScore =
      scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;

    return {
      candidateId: application.candidate.id,
      fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
      currentInterviewStep: {
        id: application.interviewStep.id,
        name: application.interviewStep.name,
      },
      averageScore,
    };
  });
};

