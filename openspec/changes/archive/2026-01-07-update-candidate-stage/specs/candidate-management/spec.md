## ADDED Requirements

### Requirement: Update Candidate Interview Stage
The system SHALL provide an endpoint to update the current interview step for a candidate's application.

#### Scenario: Successfully update candidate stage
- **WHEN** a PUT request is made to `/candidates/:id/stage` with:
  - A valid candidate ID in the URL path
  - A request body containing `applicationId` and `stage` (interviewStepId) as integers
  - The application exists and belongs to the candidate
  - The interview step exists and belongs to the position's interview flow
- **THEN** the system SHALL return a 200 status code
- **AND** the system SHALL update the application's `currentInterviewStep` field
- **AND** the response SHALL contain the updated application object
- **AND** the application object SHALL include:
  - `id`: the application ID
  - `positionId`: the position ID
  - `candidateId`: the candidate ID
  - `applicationDate`: the application date
  - `currentInterviewStep`: the updated interview step ID
  - `notes`: application notes (if any)
  - Related position and interviewStep data (optional, but recommended)

#### Scenario: Candidate not found
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a non-existent candidate ID
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL indicate that the candidate was not found

#### Scenario: Application not found
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a non-existent application ID
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL indicate that the application was not found

#### Scenario: Application does not belong to candidate
- **WHEN** a PUT request is made to `/candidates/:id/stage` with an application ID that does not belong to the specified candidate
- **THEN** the system SHALL return a 400 or 403 status code
- **AND** the response SHALL indicate that the application does not belong to the candidate

#### Scenario: Interview step not found
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a non-existent interview step ID
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL indicate that the interview step was not found

#### Scenario: Interview step does not belong to position's interview flow
- **WHEN** a PUT request is made to `/candidates/:id/stage` with an interview step ID that does not belong to the position's interview flow
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL indicate that the interview step is not valid for the position's interview flow

#### Scenario: Invalid request body
- **WHEN** a PUT request is made to `/candidates/:id/stage` with missing `applicationId` or `stage` fields
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL indicate that required fields are missing

#### Scenario: Invalid candidate ID format
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a non-numeric candidate ID
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL indicate that the ID format is invalid

#### Scenario: Invalid request body field types
- **WHEN** a PUT request is made to `/candidates/:id/stage` with `applicationId` or `stage` as non-integer values
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL indicate that the field types are invalid

