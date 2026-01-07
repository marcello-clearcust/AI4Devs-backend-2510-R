## Context
The endpoint needs to update the `currentInterviewStep` field of an Application record. This requires validating that:
1. The candidate exists
2. The application exists and belongs to the candidate
3. The interview step exists
4. The interview step belongs to the position's interview flow (ensuring the step is valid for that position)
5. Optionally, validate that the transition is sequential (can be implemented as basic validation first)

The endpoint is scoped under `/candidates/:id/stage` but operates on Application records, requiring careful validation to ensure data integrity.

## Goals / Non-Goals
- Goals:
  - Update application's current interview step efficiently
  - Validate all constraints before updating
  - Return updated application with related data
  - Provide clear error messages for validation failures
- Non-Goals:
  - Automatic stage progression (manual updates only)
  - Stage transition history/audit trail (can be added later)
  - Bulk updates (single application at a time)
  - Automatic interview scheduling (separate concern)

## Decisions
- Decision: Use PUT method for idempotent update operation
  - Alternatives considered: PATCH method
  - Rationale: PUT is semantically correct for updating a specific resource state
- Decision: Validate interview step belongs to position's interview flow
  - Alternatives considered: Only validate step exists
  - Rationale: Ensures data integrity - a step must be valid for the position's flow
- Decision: Return full updated application object
  - Alternatives considered: Return only success message or minimal data
  - Rationale: Allows client to immediately use updated data without additional request
- Decision: Sequential validation can be basic initially (validate step exists in flow)
  - Alternatives considered: Strict sequential validation (only allow next step)
  - Rationale: Allows flexibility for edge cases; strict validation can be added later if needed
- Decision: Use Prisma transaction for update operation
  - Alternatives considered: Direct update without transaction
  - Rationale: Ensures atomicity if additional validations or side effects are added later

## Risks / Trade-offs
- Data integrity: Updating stage without proper validation could lead to invalid states
  - Mitigation: Comprehensive validation before update
- Performance: Multiple validation queries could be slow
  - Mitigation: Use Prisma includes to fetch related data efficiently; consider query optimization
- Race conditions: Concurrent updates to same application
  - Mitigation: Database constraints ensure consistency; consider optimistic locking if needed later

## Migration Plan
- No database migration required (using existing schema)
- No breaking changes to existing endpoints
- New endpoint can be deployed independently

## Open Questions
- Sequential validation strictness: Should we enforce strict sequential progression (only allow moving to next step) or allow any valid step in the flow?
  - Decision: Start with basic validation (step must exist in flow), allow flexibility for now

