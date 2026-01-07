## Context
The endpoint needs to retrieve all candidates who have applied to a specific position, along with their current interview step information and average interview scores. This requires joining data across multiple tables: Position, Application, Candidate, InterviewStep, and Interview.

## Goals / Non-Goals
- Goals:
  - Efficiently query applications for a position with related candidate and interview data
  - Calculate average interview scores per application
  - Return structured data with candidate full name, interview step details, and average score
- Non-Goals:
  - Filtering or pagination (can be added later if needed)
  - Sorting (can be added later if needed)
  - Including detailed interview history (only average score needed)

## Decisions
- Decision: Use Prisma query with nested includes to fetch all required data in a single query
  - Alternatives considered: Multiple separate queries
  - Rationale: Single query is more efficient and ensures data consistency
- Decision: Calculate average score in application service layer
  - Alternatives considered: Database aggregation (AVG function)
  - Rationale: More flexible for future business logic, easier to handle null scores
- Decision: Return `currentInterviewStep` as object with `{ id, name }`
  - Alternatives considered: Return only ID or only name
  - Rationale: Provides complete information without requiring additional lookups
- Decision: Return `averageScore` as number or null
  - Alternatives considered: Return 0 when no interviews exist
  - Rationale: Null clearly indicates no data, avoiding confusion with actual zero scores

## Risks / Trade-offs
- Performance: Single query with multiple joins could be slow with large datasets
  - Mitigation: Monitor query performance; add indexes if needed; consider pagination later
- Null handling: Some candidates may have no interviews
  - Mitigation: Explicitly handle null scores in calculation and response

## Migration Plan
- No database migration required (using existing schema)
- No breaking changes to existing endpoints
- New endpoint can be deployed independently

## Open Questions
- None (all clarified with user)

