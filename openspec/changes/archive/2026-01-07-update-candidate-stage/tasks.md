## 1. Implementation
- [x] 1.1 Create service method `updateCandidateStage(candidateId: number, applicationId: number, stageId: number)` in `candidateService.ts`
- [x] 1.2 Implement validation to check candidate exists
- [x] 1.3 Implement validation to check application exists and belongs to candidate
- [x] 1.4 Implement validation to check interview step exists
- [x] 1.5 Implement validation to check interview step belongs to position's interview flow
- [x] 1.6 Implement sequential stage transition validation (optional - can be basic validation first)
- [x] 1.7 Update application's `currentInterviewStep` field using Prisma
- [x] 1.8 Return updated application object with related data (position, interviewStep)
- [x] 1.9 Create controller method `updateCandidateStage` in `candidateController.ts`
- [x] 1.10 Add PUT route `/candidates/:id/stage` in `candidateRoutes.ts`
- [x] 1.11 Add endpoint documentation to `backend/api-spec.yaml`

## 2. Validation
- [x] 2.1 Add validation for candidate ID parameter (must be valid integer)
- [x] 2.2 Add validation for request body (applicationId and stage required, must be integers)
- [x] 2.3 Handle case when candidate doesn't exist (404 response)
- [x] 2.4 Handle case when application doesn't exist (404 response)
- [x] 2.5 Handle case when application doesn't belong to candidate (403 or 400 response)
- [x] 2.6 Handle case when interview step doesn't exist (400 response)
- [x] 2.7 Handle case when interview step doesn't belong to position's interview flow (400 response)
- [x] 2.8 Handle database errors (500 response with appropriate message)

## 3. Testing
- [x] 3.1 Write unit tests for candidate service method `updateCandidateStage`
- [x] 3.2 Write integration tests for PUT `/candidates/:id/stage` endpoint
- [x] 3.3 Test successful stage update
- [x] 3.4 Test with non-existent candidate ID
- [x] 3.5 Test with non-existent application ID
- [x] 3.6 Test with application that doesn't belong to candidate
- [x] 3.7 Test with non-existent interview step ID
- [x] 3.8 Test with interview step that doesn't belong to position's interview flow
- [x] 3.9 Test with invalid request body (missing fields, wrong types)
- [x] 3.10 Test response format (returns updated application)

