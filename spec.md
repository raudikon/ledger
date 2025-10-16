# Tax Attorney Todo App Specification

## Technical Stack

### Frontend
- React.js for the user interface
- TypeScript for type safety
- Tailwind CSS for styling

### Backend
- Express for full-stack framework
- Authentication handled by BetterAuth 
- Database: Supabase + Drizzle ORM
- TypeScript for type safety

### Deployment
- Deployed to Vercel
- Database hosted on Supabase
- Environment variables managed through Vercel

## Public Homepage
The landing page will include:
- Hero section with app name and tagline
- Feature showcase with animated screenshots/GIFs demonstrating:
  * Client/Matter organization
  * Quick-add task functionality
  * Task management workflow
  * Global search and filtering
- "Get Started" section with:
  * Sign up/Login buttons (BetterAuth authentication)
  * Demo video or interactive demo
- Pricing information (if applicable)
- Footer with necessary links and information

## Authentication
- Handled by BetterAuth authentication
- Features:
  * Email/Password login
  * Google OAuth integration
  * Secure session management
  * User profile management
  * Role-based access control

## Functional Requirements

### Data Structure
1. Clients (e.g., Goldman Sachs, McKenzie)
   - Name
   - List of Matters

2. Matters (e.g., Fund 1, Fund 2)
   - Name
   - Associated Client
   - Status (Active/Completed)
   - List of Tasks
   - Completion Status

3. Tasks
   - Description
   - Status (Done/Not Done)
   - Assignee
   - Notes
   - Associated Matter
   - Associated Client
   - Created Date
   - Due Date (optional)

### Core Features
1. Client Management
   - Add new clients
   - View all clients
   - Edit client information
   - Delete clients (with confirmation)

2. Matter Management
   - Add new matters under a client
   - View matters by client
   - Mark entire matter as complete
   - Edit matter details
   - Delete matters (with confirmation)

3. Task Management
   - Add tasks in two ways:
     * Directly under a specific client/matter
     * Global quick-add with auto-complete suggestions for client/matter
   - New tasks automatically appear at the top of their matter table
   - Mark tasks as complete
   - Assign tasks to team members
   - Add/edit notes for tasks
   - Delete tasks

4. View/Organization Features
   - Hierarchical view (Client → Matter → Tasks)
   - Quick-add feature with intelligent auto-complete
   - Global search by assignee to find all tasks across matters and clients
   - Filter tasks by:
     * Client
     * Matter
     * Status
     * Assignee (with ability to view all tasks for a specific assignee)

5. User Interface Components
   - Client Cards View
   - Matter Tables under each client
   - Task List with columns:
     * Description
     * Checkbox for completion
     * Assignee field
     * Notes field
   - Global quick-add input with auto-complete

## Project Structure

```
tax-todo-app
└── tax-todo-app
    ├── src
    │   ├── controllers
    │   │   ├── TaskController.ts
    │   │   └── UserController.ts
    │   ├── models
    │   │   ├── Task.ts
    │   │   └── User.ts
    │   ├── routes
    │   │   ├── taskRoutes.ts
    │   │   └── userRoutes.ts
    │   ├── services
    │   │   ├── TaskService.ts
    │   │   └── UserService.ts
    │   ├── middleware
    │   │   ├── auth.ts
    │   │   └── validation.ts
    │   ├── types
    │   │   └── index.ts
    │   ├── utils
    │   │   ├── constants.ts
    │   │   └── helpers.ts
    │   ├── config
    │   │   └── database.ts
    │   └── app.ts
    ├── tests
    │   ├── integration
    │   │   └── tasks.test.ts
    │   └── unit
    │       └── TaskService.test.ts
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## Directory Structure Explanation

### `/src`
Main source code directory containing all application code.

#### `/controllers`
- Contains the logic for handling HTTP requests and responses
- Processes incoming data and returns appropriate responses
- Examples: `TaskController.ts` for handling task-related operations

#### `/models`
- Defines data structures and database schemas
- Handles database interactions
- Examples: `Task.ts` for defining task structure and database operations

#### `/routes`
- Defines API endpoints and routes
- Maps URLs to controller functions
- Examples: `taskRoutes.ts` for task-related endpoints

#### `/services`
- Contains business logic
- Handles complex operations and data processing
- Examples: `TaskService.ts` for task-related business logic

#### `/middleware`
- Contains reusable middleware functions
- Handles authentication, validation, etc.
- Examples: `auth.ts` for authentication middleware

#### `/types`
- Contains TypeScript type definitions
- Defines interfaces and types used across the application

#### `/utils`
- Contains utility functions and constants
- Provides helper methods used throughout the application

#### `/config`
- Contains configuration files
- Handles database connections, environment variables, etc.

### `/tests`
Contains all test files for the application.

#### `/integration`
- Contains integration tests
- Tests multiple components working together

#### `/unit`
- Contains unit tests
- Tests individual components in isolation

## Development Milestones

### Milestone 1: Project Setup & Database Schema
**Goal**: Get the foundation ready
- Initialize project with TypeScript, Express, and React
- Set up Supabase project and get connection credentials
- Configure Drizzle ORM with Supabase
- Define database schema (Clients, Matters, Tasks tables)
- Run initial migration to create tables
- Set up environment variables
- Verify database connection with a test query

### Milestone 2: Basic Authentication
**Goal**: Users can sign up and log in
- Install and configure BetterAuth
- Create sign-up page (email/password only for now)
- Create login page
- Implement authentication middleware
- Create protected route wrapper
- Test: User can register, login, and access protected routes

### Milestone 3: Client CRUD Operations
**Goal**: Basic client management works
- Create API endpoints (GET, POST, PUT, DELETE for clients)
- Build simple client list page (no styling, just a list)
- Add "Create Client" form (simple input + button)
- Display clients with edit/delete buttons
- Test: Can create, view, edit, and delete clients

### Milestone 4: Matter CRUD Operations
**Goal**: Matters are linked to clients
- Create API endpoints for matters
- Add "Create Matter" form under each client
- Display matters under their respective clients
- Implement matter edit/delete functionality
- Test: Can create matters under clients and manage them

### Milestone 5: Task CRUD Operations
**Goal**: Basic task functionality works
- Create API endpoints for tasks
- Add "Create Task" form under each matter
- Display tasks in a simple table (description, checkbox, assignee, notes)
- Implement task completion toggle
- Add edit/delete task functionality
- Test: Can create and manage tasks under matters

### Milestone 6: Quick-Add Feature
**Goal**: Can add tasks from anywhere
- Create global quick-add component (sticky header or floating button)
- Implement basic autocomplete for client/matter selection
- Tasks added via quick-add appear in correct matter
- Test: Quick-add creates tasks that show up properly

### Milestone 7: Search & Filter
**Goal**: Can find tasks easily
- Implement search by assignee
- Add basic filters (client, matter, status, assignee)
- Create "All Tasks" view showing filtered results
- Test: Can filter and find specific tasks

### Milestone 8: Deploy MVP
**Goal**: App is live and functional
- Set up Vercel project
- Configure environment variables in Vercel
- Deploy backend and frontend
- Test production deployment end-to-end
- Fix any deployment-specific issues

## MVP Success Criteria

### Required Features
- User can sign up/login
- Can create a client → matter → task hierarchy
- Can check off tasks as complete
- Can use quick-add to create tasks
- Can search for tasks by assignee
- App is deployed and accessible online
- Everything works (no crashes), just looks plain

### Not Included in MVP
- OAuth/Google login (just email/password)
- Pretty styling (basic HTML elements only)
- Complex UI components
- Animations or transitions
- Mobile optimization
- Public landing page
- Role-based access control
