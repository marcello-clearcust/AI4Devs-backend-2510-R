// Mock PrismaClient before importing the service
const mockCandidateFindUnique = jest.fn();
const mockApplicationFindUnique = jest.fn();
const mockInterviewStepFindUnique = jest.fn();
const mockApplicationUpdate = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        findUnique: mockCandidateFindUnique,
      },
      application: {
        findUnique: mockApplicationFindUnique,
        update: mockApplicationUpdate,
      },
      interviewStep: {
        findUnique: mockInterviewStepFindUnique,
      },
    })),
  };
});

import { updateCandidateStage } from './candidateService';
import { PrismaClient } from '@prisma/client';

describe('candidateService', () => {
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = {
      candidate: {
        findUnique: mockCandidateFindUnique,
      },
      application: {
        findUnique: mockApplicationFindUnique,
        update: mockApplicationUpdate,
      },
      interviewStep: {
        findUnique: mockInterviewStepFindUnique,
      },
    } as any;
  });

  describe('updateCandidateStage', () => {
    const candidateId = 1;
    const applicationId = 10;
    const stageId = 5;

    const mockCandidate = {
      id: candidateId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const mockInterviewStep = {
      id: stageId,
      name: 'Technical Interview',
      interviewFlowId: 1,
      interviewTypeId: 1,
      orderIndex: 2,
    };

    const mockApplication = {
      id: applicationId,
      positionId: 2,
      candidateId: candidateId,
      applicationDate: new Date('2024-01-01'),
      currentInterviewStep: 3,
      notes: 'Test notes',
      position: {
        id: 2,
        title: 'Software Engineer',
        interviewFlowId: 1,
        interviewFlow: {
          id: 1,
          interviewSteps: [
            { id: 3, name: 'Initial Screening', interviewFlowId: 1 },
            { id: 5, name: 'Technical Interview', interviewFlowId: 1 },
            { id: 7, name: 'Final Interview', interviewFlowId: 1 },
          ],
        },
      },
    };

    const mockUpdatedApplication = {
      id: applicationId,
      positionId: 2,
      candidateId: candidateId,
      applicationDate: new Date('2024-01-01'),
      currentInterviewStep: stageId,
      notes: 'Test notes',
      position: {
        id: 2,
        title: 'Software Engineer',
      },
      interviewStep: {
        id: stageId,
        name: 'Technical Interview',
      },
    };

    it('should throw error when candidate does not exist', async () => {
      mockCandidateFindUnique.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, applicationId, stageId, mockPrisma),
      ).rejects.toThrow('Candidate not found');

      expect(mockCandidateFindUnique).toHaveBeenCalledWith({
        where: { id: candidateId },
      });
      expect(mockApplicationFindUnique).not.toHaveBeenCalled();
    });

    it('should throw error when application does not exist', async () => {
      mockCandidateFindUnique.mockResolvedValue(mockCandidate);
      mockApplicationFindUnique.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, applicationId, stageId, mockPrisma),
      ).rejects.toThrow('Application not found');

      expect(mockCandidateFindUnique).toHaveBeenCalledWith({
        where: { id: candidateId },
      });
      expect(mockApplicationFindUnique).toHaveBeenCalledWith({
        where: { id: applicationId },
        include: {
          position: {
            include: {
              interviewFlow: {
                include: {
                  interviewSteps: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw error when application does not belong to candidate', async () => {
      mockCandidateFindUnique.mockResolvedValue(mockCandidate);
      const applicationWithDifferentCandidate = {
        ...mockApplication,
        candidateId: 999, // Different candidate ID
      };
      mockApplicationFindUnique.mockResolvedValue(applicationWithDifferentCandidate);

      await expect(
        updateCandidateStage(candidateId, applicationId, stageId, mockPrisma),
      ).rejects.toThrow('Application does not belong to the specified candidate');
    });

    it('should throw error when interview step does not exist', async () => {
      mockCandidateFindUnique.mockResolvedValue(mockCandidate);
      mockApplicationFindUnique.mockResolvedValue(mockApplication);
      mockInterviewStepFindUnique.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, applicationId, stageId, mockPrisma),
      ).rejects.toThrow('Interview step not found');

      expect(mockInterviewStepFindUnique).toHaveBeenCalledWith({
        where: { id: stageId },
      });
    });

    it('should throw error when interview step does not belong to position\'s interview flow', async () => {
      mockCandidateFindUnique.mockResolvedValue(mockCandidate);
      const applicationWithDifferentFlow = {
        ...mockApplication,
        position: {
          ...mockApplication.position,
          interviewFlow: {
            id: 2, // Different flow
            interviewSteps: [
              { id: 10, name: 'Other Step', interviewFlowId: 2 },
            ],
          },
        },
      };
      mockApplicationFindUnique.mockResolvedValue(applicationWithDifferentFlow);
      mockInterviewStepFindUnique.mockResolvedValue(mockInterviewStep);

      await expect(
        updateCandidateStage(candidateId, applicationId, stageId, mockPrisma),
      ).rejects.toThrow('Interview step is not valid for the position\'s interview flow');
    });

    it('should successfully update candidate stage', async () => {
      mockCandidateFindUnique.mockResolvedValue(mockCandidate);
      mockApplicationFindUnique.mockResolvedValue(mockApplication);
      mockInterviewStepFindUnique.mockResolvedValue(mockInterviewStep);
      mockApplicationUpdate.mockResolvedValue(mockUpdatedApplication);

      const result = await updateCandidateStage(candidateId, applicationId, stageId, mockPrisma);

      expect(result).toEqual(mockUpdatedApplication);
      expect(mockApplicationUpdate).toHaveBeenCalledWith({
        where: { id: applicationId },
        data: {
          currentInterviewStep: stageId,
        },
        include: {
          position: {
            select: {
              id: true,
              title: true,
            },
          },
          interviewStep: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should call all validations before updating', async () => {
      mockCandidateFindUnique.mockResolvedValue(mockCandidate);
      mockApplicationFindUnique.mockResolvedValue(mockApplication);
      mockInterviewStepFindUnique.mockResolvedValue(mockInterviewStep);
      mockApplicationUpdate.mockResolvedValue(mockUpdatedApplication);

      await updateCandidateStage(candidateId, applicationId, stageId, mockPrisma);

      // Verify all validations were called
      expect(mockCandidateFindUnique).toHaveBeenCalled();
      expect(mockApplicationFindUnique).toHaveBeenCalled();
      expect(mockInterviewStepFindUnique).toHaveBeenCalled();
      expect(mockApplicationUpdate).toHaveBeenCalled();
    });
  });
});

