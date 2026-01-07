# Change: Add Position Candidates Endpoint

## Why
Recruiters need to view all candidates currently in the recruitment process for a specific position. This endpoint provides a consolidated view showing candidate information, their current interview step, and their average interview score, enabling recruiters to track progress and make informed decisions.

## What Changes
- **ADDED**: New GET endpoint `/positions/:id/candidates` to retrieve all candidates in process for a position
- **ADDED**: Service method to fetch applications for a position with candidate and interview data
- **ADDED**: Calculation of average interview score per application
- **ADDED**: Response format includes candidate full name, current interview step (with id and name), and average score

## Impact
- Affected specs: New capability `position-management`
- Affected code:
  - New route: `backend/src/routes/positionRoutes.ts`
  - New controller: `backend/src/presentation/controllers/positionController.ts`
  - New service: `backend/src/application/services/positionService.ts`
  - Updated: `backend/src/index.ts` (register new route)
  - Updated: `backend/api-spec.yaml` (add endpoint documentation)

