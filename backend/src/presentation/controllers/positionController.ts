import { Request, Response } from 'express';
import { getPositionCandidates } from '../../application/services/positionService';

export const getPositionCandidatesController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Validate position ID format
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid position ID format' });
    }

    const candidates = await getPositionCandidates(id, req.prisma);
    res.status(200).json(candidates);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Position not found') {
        return res.status(404).json({ error: 'Position not found' });
      }
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

