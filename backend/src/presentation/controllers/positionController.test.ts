import { Request, Response } from 'express';
import { getPositionCandidatesController } from './positionController';
import * as positionService from '../../application/services/positionService';

// Mock the service
jest.mock('../../application/services/positionService');

describe('positionController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('getPositionCandidatesController', () => {
    const mockPrisma = {} as any;

    beforeEach(() => {
      mockRequest = {
        params: { id: '1' },
        prisma: mockPrisma,
      };
    });

    it('should return 400 for invalid position ID format', async () => {
      mockRequest = {
        params: { id: 'invalid' },
        prisma: mockPrisma,
      };

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid position ID format' });
      expect(positionService.getPositionCandidates).not.toHaveBeenCalled();
    });

    it('should return 404 when position is not found', async () => {
      mockRequest = {
        params: { id: '999' },
        prisma: mockPrisma,
      };
      (positionService.getPositionCandidates as jest.Mock).mockRejectedValue(
        new Error('Position not found'),
      );

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Position not found' });
    });

    it('should return 200 with candidates array when successful', async () => {
      const mockCandidates = [
        {
          candidateId: 1,
          fullName: 'John Doe',
          currentInterviewStep: {
            id: 1,
            name: 'Initial Screening',
          },
          averageScore: 8.5,
        },
      ];
      (positionService.getPositionCandidates as jest.Mock).mockResolvedValue(
        mockCandidates,
      );

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(positionService.getPositionCandidates).toHaveBeenCalledWith(1, mockPrisma);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCandidates);
    });

    it('should return 200 with empty array when no candidates exist', async () => {
      (positionService.getPositionCandidates as jest.Mock).mockResolvedValue([]);

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([]);
    });

    it('should return 500 for unexpected errors', async () => {
      (positionService.getPositionCandidates as jest.Mock).mockRejectedValue(
        new Error('Database connection error'),
      );

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });
});

