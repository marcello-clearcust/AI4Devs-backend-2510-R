# Project Context

## Purpose
LTI (Talent Tracking System) is a full-stack application designed to manage and track candidate information throughout the recruitment process. The system allows recruiters to:

- Register and manage candidate profiles with personal information, education, work experience, and resumes
- Track candidate applications and interview processes
- Store and manage CV/resume files
- View candidate history and application status

The project follows Domain-Driven Design (DDD) principles and SOLID best practices to ensure maintainability, scalability, and code quality.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (v4.9.5)
- **ORM**: Prisma (v5.13.0)
- **Database**: PostgreSQL (via Docker)
- **File Upload**: Multer
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Testing**: Jest (v29.7.0) with ts-jest
- **Code Quality**: ESLint (v9.2.0), Prettier (v3.2.5)

### Frontend
- **Framework**: React (v18.3.1)
- **Language**: TypeScript (v4.9.5)
- **Build Tool**: Create React App (react-scripts v5.0.1)
- **UI Library**: React Bootstrap (v2.10.2), Bootstrap (v5.3.3)
- **Icons**: React Bootstrap Icons (v1.11.4)
- **Routing**: React Router DOM (v6.23.1)
- **Date Picker**: React DatePicker (v6.9.0)
- **Testing**: Jest, React Testing Library

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Environment Management**: dotenv (v16.4.5)
- **Version Control**: Git

## Project Conventions

### Code Style

#### Formatting Rules
- **Quotes**: Single quotes (`'`) for strings
- **Trailing Commas**: Always use trailing commas in multi-line structures
- **Indentation**: Consistent spacing (configured via Prettier)
- **File Encoding**: UTF-8

#### Naming Conventions
- **Classes**: PascalCase (e.g., `Candidate`, `Education`, `WorkExperience`)
- **Functions/Methods**: camelCase (e.g., `addCandidate`, `findCandidateById`)
- **Variables**: camelCase (e.g., `candidateData`, `firstName`)
- **Constants**: camelCase (consider UPPER_SNAKE_CASE for true constants)
- **Files**: 
  - Domain models: PascalCase (e.g., `Candidate.ts`, `Education.ts`)
  - Services: camelCase (e.g., `candidateService.ts`)
  - Controllers: camelCase (e.g., `candidateController.ts`)
  - Routes: camelCase (e.g., `candidateRoutes.ts`)

#### TypeScript Conventions
- Use strict mode (`"strict": true` in tsconfig.json)
- Prefer explicit types over `any` when possible
- Use interfaces for contracts (though currently underutilized - see improvements below)
- Use type guards for error handling (e.g., `error instanceof Error`)

### Architecture Patterns

#### Domain-Driven Design (DDD)
The project follows a layered DDD architecture:

1. **Domain Layer** (`backend/src/domain/models/`)
   - Contains business entities and domain models
   - **Entities**: `Candidate`, `Company`, `Position`, `Employee`, `Interview`, `InterviewFlow`, `InterviewStep`, `InterviewType`
   - **Value Objects**: `Education`, `WorkExperience`, `Resume`, `Application`
   - **Aggregates**: `Candidate` acts as the aggregate root, containing `Education[]`, `WorkExperience[]`, `Resume[]`, and `Application[]`
   - Domain models encapsulate business logic and validation

2. **Application Layer** (`backend/src/application/`)
   - Contains application services and business logic orchestration
   - **Services**: `candidateService.ts`, `fileUploadService.ts`, `positionService.ts`
   - **Validators**: `validator.ts` for input validation
   - Services coordinate between domain models and infrastructure
   - `candidateService.ts` exposes `updateCandidateStage` for changing candidate workflow stages

3. **Presentation Layer** (`backend/src/presentation/`)
   - Contains controllers that handle HTTP requests/responses
   - **Controllers**: `candidateController.ts`
   - Controllers are thin, delegating to application services

4. **Infrastructure Layer** (`backend/src/routes/`)
   - Contains route definitions and Express middleware
   - **Routes**: `candidateRoutes.ts`
   - Handles HTTP routing and request/response formatting

#### SOLID Principles
The project aims to follow SOLID principles:

- **Single Responsibility Principle (SRP)**: Each class has a single, well-defined responsibility
- **Open/Closed Principle (OCP)**: Classes are open for extension but closed for modification
- **Liskov Substitution Principle (LSP)**: Currently uses composition over inheritance
- **Interface Segregation Principle (ISP)**: Interfaces should be granular (improvement opportunity)
- **Dependency Inversion Principle (DIP)**: Dependencies should be on abstractions (improvement opportunity)

#### DRY (Don't Repeat Yourself)
- Common validation logic is centralized in validators
- Database operations are abstracted through Prisma
- Reusable service methods prevent code duplication

#### Current Architecture Improvements Needed
Based on the ManifestoBuenasPracticas.md:

1. **Repositories**: Currently, domain models directly use Prisma. Consider implementing repository interfaces to abstract data access
2. **Dependency Injection**: Use dependency injection for PrismaClient and other dependencies
3. **Factories**: Implement factory methods for complex object creation
4. **Interfaces**: Define more granular TypeScript interfaces for services and repositories
5. **Domain Events**: Consider implementing domain events for decoupled side effects

### Testing Strategy

#### Testing Framework
- **Backend**: Jest with ts-jest preset
- **Frontend**: Jest with React Testing Library

#### Test Structure
- Unit tests for domain models and services
- Integration tests for API endpoints
- Test files should be co-located with source files or in a `__tests__` directory

#### Testing Requirements
- All business logic should have unit tests
- API endpoints should have integration tests
- Test coverage goals: Aim for >80% coverage on critical paths
- Use descriptive test names that explain what is being tested

#### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Git Workflow

#### Branching Strategy
- **Main/Master**: Production-ready code
- **Feature branches**: For new features (e.g., `feature/backend-solved`)
- **Development branches**: For ongoing development work

#### Commit Conventions
- Use descriptive commit messages
- Follow conventional commit format when possible (feat:, fix:, docs:, etc.)
- Commit frequently with logical, atomic changes

#### Code Review
- All changes should be reviewed before merging
- Ensure tests pass before submitting for review
- Follow project conventions and best practices

## Domain Context

### Core Domain Entities

#### Candidate (Aggregate Root)
- Represents a job candidate in the system
- Contains personal information: firstName, lastName, email, phone, address
- Aggregates: Education[], WorkExperience[], Resume[], Application[]
- Primary identifier: `id` (number)

#### Education
- Represents a candidate's educational background
- Fields: institution, title, startDate, endDate
- Belongs to: Candidate

#### WorkExperience
- Represents a candidate's work history
- Fields: company, position, description, startDate, endDate
- Belongs to: Candidate

#### Resume
- Represents a CV/resume file uploaded for a candidate
- Fields: filePath, fileType
- Belongs to: Candidate

#### Application
- Represents a candidate's application to a position
- Fields: positionId, candidateId, applicationDate, currentInterviewStep, notes
- Related to: Candidate, Position, Interview

#### Position
- Represents a job position/opening
- Related to: Company, Application

#### Company
- Represents an employer/company
- Related to: Position, Employee

#### Interview
- Represents an interview session
- Related to: Application, InterviewStep, InterviewType

### Business Rules
- Each candidate must have a unique email address
- Candidates can have multiple education entries, work experiences, and resumes
- Applications link candidates to positions
- Interviews track the progression of applications through interview steps

### API Endpoints
- `POST /candidates` - Create a new candidate
- `GET /candidates/:id` - Retrieve a candidate by ID
- `PUT /candidates/:id/stage` - Update a candidate's stage
- `GET /positions/:id/candidates` - List candidates for a given position
- `POST /upload` - Upload a file (CV/resume)

## Important Constraints

### Technical Constraints
- Backend runs on port 3010
- Frontend runs on port 3000
- PostgreSQL database runs in Docker container on port 5432
- CORS is configured to allow requests from `http://localhost:3000`
- File uploads are handled via Multer middleware
- TypeScript strict mode is enabled

### Database Constraints
- Email addresses must be unique (enforced by Prisma schema)
- Foreign key relationships are enforced at the database level
- Database migrations are managed through Prisma

### Environment Variables
Required environment variables (configured in `.env` files):
- `DATABASE_URL`: PostgreSQL connection string
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_PORT`: Database port (default: 5432)

### Development Constraints
- Node.js version compatibility (check package.json engines if specified)
- TypeScript version: 4.9.5
- Prisma requires schema generation before use (`npx prisma generate`)
- Database migrations must be run before starting the application (`npx prisma migrate dev`)

## External Dependencies

### Backend Dependencies
- **@prisma/client**: Prisma ORM client for database operations
- **express**: Web framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **multer**: File upload handling middleware
- **dotenv**: Environment variable management
- **swagger-jsdoc** & **swagger-ui-express**: API documentation

### Frontend Dependencies
- **react** & **react-dom**: React library
- **react-router-dom**: Client-side routing
- **react-bootstrap** & **bootstrap**: UI component library
- **react-datepicker**: Date selection component
- **react-bootstrap-icons**: Icon library

### Development Tools
- **typescript**: TypeScript compiler
- **jest**: Testing framework
- **eslint**: Code linting
- **prettier**: Code formatting
- **ts-node-dev**: Development server with hot reload
- **prisma**: Prisma CLI for migrations and schema management

### Infrastructure
- **Docker**: Containerization platform
- **PostgreSQL**: Relational database system

### External Services
- Currently no external API integrations
- File storage is local (uploads directory)
- Consider cloud storage (AWS S3, Azure Blob Storage) for production deployments
