## 1. Implementation
- [x] 1.1 Create position service method `getPositionCandidates(positionId: number)`
- [x] 1.2 Implement query to fetch applications with candidate and interview step data
- [x] 1.3 Calculate average score from interviews for each application
- [x] 1.4 Create position controller method `getPositionCandidates`
- [x] 1.5 Create position routes file with GET `/positions/:id/candidates` endpoint
- [x] 1.6 Register position routes in `backend/src/index.ts`
- [x] 1.7 Add endpoint documentation to `backend/api-spec.yaml`

## 2. Validation
- [x] 2.1 Add validation for position ID parameter (must be valid integer)
- [x] 2.2 Handle case when position doesn't exist (404 response)
- [x] 2.3 Handle case when no candidates exist for position (empty array response)
- [x] 2.4 Handle case when candidate has no interviews (averageScore: null or 0)

## 3. Testing
- [x] 3.1 Write unit tests for position service method
- [x] 3.2 Write integration tests for GET `/positions/:id/candidates` endpoint
- [x] 3.3 Test with position that has multiple candidates
- [x] 3.4 Test with position that has no candidates
- [x] 3.5 Test with non-existent position ID
- [x] 3.6 Test average score calculation with multiple interviews
- [x] 3.7 Test average score calculation with no interviews

