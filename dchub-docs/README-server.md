
# DiaCare API Server - Backend Setup

## Overview
This is the backend API server for the DiaCare dialysis center management system. It provides RESTful API endpoints for patient management, appointment scheduling, user authentication, and dialysis center operations.

## Tech Stack
- Node.js 
- Express.js
- MongoDB
- Mongoose ORM
- JWT for authentication

## Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB 6.0+ running locally or remotely

## Installation

1. Navigate to the backend directory:
```bash
cd dchub-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dialysis-center
JWT_SECRET=your_secure_secret_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:8080
```

## Database Setup

1. Make sure MongoDB is running.

2. Initialize the database with sample data (optional):
```bash
node ../dchub-scripts/db/init-db.js
```

## Running the Server

Start the server in development mode:
```bash
npm run dev
```

The API will be available at http://localhost:5000/api

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and receive JWT token
- GET /api/auth/profile - Get current user profile (requires auth)

### Patient Endpoints
- GET /api/patients - Get all patients
- GET /api/patients/:id - Get patient by ID
- POST /api/patients - Create a new patient
- PUT /api/patients/:id - Update patient information
- DELETE /api/patients/:id - Delete a patient

### Appointment Endpoints
- GET /api/appointments - Get all appointments
- GET /api/appointments/:id - Get appointment by ID
- POST /api/appointments - Create a new appointment
- PUT /api/appointments/:id - Update an appointment
- DELETE /api/appointments/:id - Delete an appointment

### Centers Endpoints
- GET /api/centers - Get all dialysis centers
- GET /api/centers/:id - Get center by ID
- POST /api/centers - Create a new center
- PUT /api/centers/:id - Update center information
- DELETE /api/centers/:id - Delete a center

### CKD Record Endpoints
- GET /api/ckd-records/:patientId - Get CKD records for a patient
- POST /api/ckd-records - Create a new CKD record
- PUT /api/ckd-records/:id - Update a CKD record

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port to run the server on | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/dialysis-center |
| JWT_SECRET | Secret for signing JWT tokens | (required) |
| NODE_ENV | Environment (development/production) | development |
| CLIENT_URL | Frontend application URL | http://localhost:8080 |

## Testing the API

You can test the API using tools like Postman or curl. Example:

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"ok"}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

Error responses include a message field explaining the error.
