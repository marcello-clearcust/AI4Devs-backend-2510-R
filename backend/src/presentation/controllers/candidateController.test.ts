import { Request, Response } from 'express';
import { updateCandidateStageController } from './candidateController';
import * as candidateService from '../../application/services/candidateService';

// Mock the service
jest.mock('../../application/services/candidateService');

describe('candidateController', () => {
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

  describe('updateCandidateStageController', () => {
    const candidateId = 1;
    const applicationId = 10;
    const stageId = 5;

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

    it('should return 400 for invalid candidate ID format', async () => {
      mockRequest = {
        params: { id: 'invalid' },
        body: { applicationId, stage: stageId },
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid candidate ID format' });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when applicationId is missing', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { stage: stageId },
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Missing required fields: applicationId and stage are required',
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when stage is missing', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId },
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Missing required fields: applicationId and stage are required',
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when applicationId is not an integer', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId: 'not-a-number', stage: stageId },
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid field types: applicationId and stage must be integers',
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when stage is not an integer', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: 'not-a-number' },
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid field types: applicationId and stage must be integers',
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 404 when candidate is not found', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Candidate not found'),
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Candidate not found' });
    });

    it('should return 404 when application is not found', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Application not found'),
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Application not found' });
    });

    it('should return 400 when application does not belong to candidate', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Application does not belong to the specified candidate'),
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Application does not belong to the specified candidate',
      });
    });

    it('should return 400 when interview step is not found', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Interview step not found'),
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Interview step not found' });
    });

    it('should return 400 when interview step does not belong to position\'s interview flow', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Interview step is not valid for the position\'s interview flow'),
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Interview step is not valid for the position\'s interview flow',
      });
    });

    it('should return 200 with updated application when successful', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockResolvedValue(
        mockUpdatedApplication,
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(candidateService.updateCandidateStage).toHaveBeenCalledWith(
        candidateId,
        applicationId,
        stageId,
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedApplication);
    });

    it('should return 500 for unexpected errors', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId, stage: stageId },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Database connection error'),
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Database connection error',
      });
    });

    it('should handle string numbers in request body', async () => {
      mockRequest = {
        params: { id: candidateId.toString() },
        body: { applicationId: applicationId.toString(), stage: stageId.toString() },
      };
      (candidateService.updateCandidateStage as jest.Mock).mockResolvedValue(
        mockUpdatedApplication,
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(candidateService.updateCandidateStage).toHaveBeenCalledWith(
        candidateId,
        applicationId,
        stageId,
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });
});

