import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData, req.prisma);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id, req.prisma);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        // Validate candidate ID parameter
        const candidateId = parseInt(req.params.id);
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        // Validate request body
        const { applicationId, stage } = req.body;

        if (applicationId === undefined || stage === undefined) {
            return res.status(400).json({ error: 'Missing required fields: applicationId and stage are required' });
        }

        const applicationIdNum = parseInt(applicationId);
        const stageId = parseInt(stage);

        if (isNaN(applicationIdNum) || isNaN(stageId)) {
            return res.status(400).json({ error: 'Invalid field types: applicationId and stage must be integers' });
        }

        // Call service method
        const updatedApplication = await updateCandidateStage(candidateId, applicationIdNum, stageId, req.prisma);

        res.status(200).json(updatedApplication);
    } catch (error) {
        if (error instanceof Error) {
            const errorMessage = error.message;

            // Handle specific error cases
            if (errorMessage === 'Candidate not found') {
                return res.status(404).json({ error: 'Candidate not found' });
            }
            if (errorMessage === 'Application not found') {
                return res.status(404).json({ error: 'Application not found' });
            }
            if (errorMessage === 'Application does not belong to the specified candidate') {
                return res.status(400).json({ error: 'Application does not belong to the specified candidate' });
            }
            if (errorMessage === 'Interview step not found') {
                return res.status(400).json({ error: 'Interview step not found' });
            }
            if (errorMessage.includes('Interview step is not valid')) {
                return res.status(400).json({ error: 'Interview step is not valid for the position\'s interview flow' });
            }

            // Generic error handling
            return res.status(500).json({ error: 'Internal Server Error', message: errorMessage });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addCandidate };