# College Appointment System

A RESTful API backend system for managing professor-student appointments at a college.

## Features

- Authentication for students and professors
- Professor availability management
- Appointment booking and management
- Role-based access control
- API documentation with Swagger

## Prerequisites

- Node.js
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with:
   ```
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_uri
   PORT=3000
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Running Tests

```bash
npm test
```

## API Documentation

Access the Swagger documentation at `/api-docs` when the server is running.

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Professor Availability
- POST /api/availability
- GET /api/availability/{professorId}
- DELETE /api/availability/{slotId}

### Appointments
- POST /api/appointments
- GET /api/appointments
- DELETE /api/appointments/{appointmentId}

## Database Schema

### Users
- id: ObjectId
- email: String
- password: String (hashed)
- role: String (student/professor)
- name: String

### Availability
- id: ObjectId
- professorId: ObjectId
- startTime: Date
- endTime: Date
- status: String (available/booked)

### Appointments
- id: ObjectId
- studentId: ObjectId
- professorId: ObjectId
- slotId: ObjectId
- status: String (scheduled/cancelled)