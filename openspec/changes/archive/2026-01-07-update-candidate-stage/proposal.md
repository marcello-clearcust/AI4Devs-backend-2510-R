# Change: Update Candidate Stage Endpoint

## Why
Recruiters need to update the interview stage of candidates as they progress through the recruitment process. Currently, there is no direct endpoint to update a candidate's current interview step for a specific application. This endpoint enables recruiters to move candidates between interview stages efficiently, ensuring accurate tracking of candidate progress.

## What Changes
- **ADDED**: New PUT endpoint `/candidates/:id/stage` to update the current interview step for a candidate's application
- **ADDED**: Request body validation for `applicationId` and `stage` (interviewStepId) parameters
- **ADDED**: Validation logic to ensure:
  - The candidate exists
  - The application exists and belongs to the candidate
  - The interview step exists
  - The interview step belongs to the position's interview flow
  - The stage transition is valid (sequential validation)
- **ADDED**: Service method to update application's `currentInterviewStep`
- **ADDED**: Response returns the updated application object

## Impact
- Affected specs: New capability `candidate-management`
- Affected code:
  - New route: `backend/src/routes/candidateRoutes.ts` (add PUT endpoint)
  - New controller method: `backend/src/presentation/controllers/candidateController.ts`
  - New service method: `backend/src/application/services/candidateService.ts`
  - Updated: `backend/api-spec.yaml` (add endpoint documentation)

