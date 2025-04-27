# DialyzeEase - Backend API

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![Express](https://img.shields.io/badge/Express-4.18.2-000000)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)

The backend API server for DialyzeEase, providing RESTful endpoints for patient management, appointment scheduling, user authentication, and dialysis center operations.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Patient Management**: Complete CRUD operations for patient records
- **Appointment Scheduling**: Create, view, update, and cancel appointments
- **Dialysis Center Management**: Center information and capacity management
- **CKD Records**: Track and manage chronic kidney disease progression
- **User Management**: Admin tools for managing system users

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL/MariaDB
- **ORM**: Native SQL with mysql2
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Logging**: morgan
- **CORS Support**: cors

## Prerequisites

- Node.js 18.x or higher
- MySQL/MariaDB 8.0 or higher (XAMPP recommended for local development)
- npm 8.x or higher (or yarn)

## Installation

### 1. Clone the Repository

If you're only working with the backend:

```bash
git clone https://github.com/yourusername/DialyzeEase.git
cd DialyzeEase/dialyzeease-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=dialyzeease
DB_PASSWORD=D91lyz5_E1s5
DB_NAME=dialyzeease
JWT_SECRET=your_secure_secret_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:8080

# For database initialization
DB_ROOT_USER=root
DB_ROOT_PASSWORD=your_root_password
```

### 4. Database Setup

Make sure your MySQL/MariaDB server is running, then initialize the database:

```bash
npm run init-db
```

This script will:
- Create the database user if it doesn't exist
- Create the database if it doesn't exist
- Set up all necessary tables and relationships
- Grant appropriate permissions

## Development

### Start Development Server

```bash
npm run dev
```

This will start the server with nodemon for automatic reloading at http://localhost:5000.

### Start Production Server

```bash
npm start
```

## Project Structure

```
dialyzeease-api/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/             # Database models
├── routes/             # API route definitions
├── scripts/            # Utility scripts (including DB initialization)
├── .env                # Environment variables (not in repo)
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
└── server.js           # Main application entry point
```

## API Endpoints

### Authentication
```
POST /api/auth/login    # User login
POST /api/auth/register # User registration (admin only)
GET  /api/auth/profile  # Get current user profile
```

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
| DB_HOST | MySQL/MariaDB host | localhost |
| DB_PORT | MySQL/MariaDB port | 3306 |
| DB_USER | MySQL/MariaDB username | dialyzeease |
| DB_PASSWORD | MySQL/MariaDB password | D91lyz5_E1s5 |
| DB_NAME | MySQL/MariaDB database name | dialyzeease |
| JWT_SECRET | Secret for signing JWT tokens | (required) |
| NODE_ENV | Environment (development/production) | development |
| CLIENT_URL | Frontend application URL | http://localhost:8080 |

## Testing the API

You can test the API using tools like Postman or curl. Example:

```bash
curl http://localhost:5000/health
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
