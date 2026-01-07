// Mock PrismaClient before importing the service
const mockFindUnique = jest.fn();
const mockFindMany = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      position: {
        findUnique: mockFindUnique,
      },
      application: {
        findMany: mockFindMany,
      },
    })),
  };
});

import { getPositionCandidates } from './positionService';
import { PrismaClient } from '@prisma/client';

describe('positionService', () => {
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = {
      position: {
        findUnique: mockFindUnique,
      },
      application: {
        findMany: mockFindMany,
      },
    } as any;
  });

  describe('getPositionCandidates', () => {
    it('should throw error when position does not exist', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(getPositionCandidates(999, mockPrisma)).rejects.toThrow('Position not found');
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should return empty array when position has no applications', async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });
      mockFindMany.mockResolvedValue([]);

      const result = await getPositionCandidates(1, mockPrisma);

      expect(result).toEqual([]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { positionId: 1 },
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
    });

    it('should return candidates with null averageScore when no interviews exist', async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });
      mockFindMany.mockResolvedValue([
        {
          candidate: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
          },
          interviewStep: {
            id: 1,
            name: 'Initial Screening',
          },
          interviews: [],
        },
      ]);

      const result = await getPositionCandidates(1, mockPrisma);

      expect(result).toEqual([
        {
          candidateId: 1,
          fullName: 'John Doe',
          currentInterviewStep: {
            id: 1,
            name: 'Initial Screening',
          },
          averageScore: null,
        },
      ]);
    });

    it('should calculate average score from multiple interviews', async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });
      mockFindMany.mockResolvedValue([
        {
          candidate: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
          },
          interviewStep: {
            id: 2,
            name: 'Technical Interview',
          },
          interviews: [
            { score: 8 },
            { score: 7 },
            { score: 9 },
          ],
        },
      ]);

      const result = await getPositionCandidates(1, mockPrisma);

      expect(result).toEqual([
        {
          candidateId: 1,
          fullName: 'John Doe',
          currentInterviewStep: {
            id: 2,
            name: 'Technical Interview',
          },
          averageScore: 8, // (8 + 7 + 9) / 3 = 8
        },
      ]);
    });

    it('should filter out null scores when calculating average', async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });
      mockFindMany.mockResolvedValue([
        {
          candidate: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Smith',
          },
          interviewStep: {
            id: 3,
            name: 'Final Interview',
          },
          interviews: [
            { score: 10 },
            { score: null },
            { score: 8 },
          ],
        },
      ]);

      const result = await getPositionCandidates(1, mockPrisma);

      expect(result).toEqual([
        {
          candidateId: 1,
          fullName: 'Jane Smith',
          currentInterviewStep: {
            id: 3,
            name: 'Final Interview',
          },
          averageScore: 9, // (10 + 8) / 2 = 9
        },
      ]);
    });

    it('should handle multiple candidates for a position', async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });
      mockFindMany.mockResolvedValue([
        {
          candidate: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
          },
          interviewStep: {
            id: 1,
            name: 'Initial Screening',
          },
          interviews: [{ score: 7 }],
        },
        {
          candidate: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
          },
          interviewStep: {
            id: 2,
            name: 'Technical Interview',
          },
          interviews: [{ score: 9 }, { score: 8 }],
        },
      ]);

      const result = await getPositionCandidates(1, mockPrisma);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        candidateId: 1,
        fullName: 'John Doe',
        currentInterviewStep: {
          id: 1,
          name: 'Initial Screening',
        },
        averageScore: 7,
      });
      expect(result[1]).toEqual({
        candidateId: 2,
        fullName: 'Jane Smith',
        currentInterviewStep: {
          id: 2,
          name: 'Technical Interview',
        },
        averageScore: 8.5, // (9 + 8) / 2 = 8.5
      });
    });
  });
});

