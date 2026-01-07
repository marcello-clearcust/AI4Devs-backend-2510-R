## ADDED Requirements

### Requirement: Retrieve Candidates for Position
The system SHALL provide an endpoint to retrieve all candidates currently in the recruitment process for a specific position.

#### Scenario: Successfully retrieve candidates for position
- **WHEN** a GET request is made to `/positions/:id/candidates` with a valid position ID
- **THEN** the system SHALL return a 200 status code
- **AND** the response SHALL contain an array of candidate objects
- **AND** each candidate object SHALL include:
  - `candidateId`: the unique identifier of the candidate
  - `fullName`: the concatenation of candidate's firstName and lastName
  - `currentInterviewStep`: an object containing `id` (InterviewStep ID) and `name` (InterviewStep name)
  - `averageScore`: the average score from all interviews for this application (number or null if no interviews exist)

#### Scenario: Position not found
- **WHEN** a GET request is made to `/positions/:id/candidates` with a non-existent position ID
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL indicate that the position was not found

#### Scenario: No candidates for position
- **WHEN** a GET request is made to `/positions/:id/candidates` for a position with no applications
- **THEN** the system SHALL return a 200 status code
- **AND** the response SHALL contain an empty array `[]`

#### Scenario: Candidate with no interviews
- **WHEN** a candidate has an application but no interviews have been conducted
- **THEN** the `averageScore` field SHALL be `null`
- **AND** the `currentInterviewStep` SHALL still be populated with the step from the application

#### Scenario: Calculate average score from multiple interviews
- **WHEN** a candidate has multiple interviews for their application
- **THEN** the `averageScore` SHALL be calculated as the arithmetic mean of all non-null interview scores
- **AND** only interviews with a non-null `score` value SHALL be included in the calculation

#### Scenario: Invalid position ID format
- **WHEN** a GET request is made to `/positions/:id/candidates` with a non-numeric position ID
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL indicate that the ID format is invalid

