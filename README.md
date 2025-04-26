# DialyzeEase

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)

A comprehensive platform connecting dialysis patients with healthcare providers, offering tools for appointment management, patient records, and CKD education.

## Project Overview

DialyzeEase is a monorepo containing multiple interconnected applications:

- **dialyzeease-web**: React frontend application
- **dialyzeease-api**: Node.js backend API
- **dialyzeease-scripts**: Database and DevOps scripts
- **dialyzeease-docs**: Project documentation
- **dialyzeease-app**: Mobile application (future development)
- **dialyzeease-protocol**: Communication protocol definitions (future development)

## Key Features

### Patient Portal
- **Patient Dashboard**: Personalized overview of appointments, CKD stage, and recommendations
- **Appointment Management**: View, book, and manage dialysis appointments
- **CKD Stage Tracking**: Monitor CKD progression with historical data visualization
- **Education Resources**: Access to tailored educational content based on CKD stage
- **Notifications**: Receive important alerts about appointments and treatment updates

### Healthcare Provider Portal
- **Staff Dashboard**: Overview of scheduled appointments and patient statistics
- **Patient Management**: Comprehensive patient record viewing and editing
- **Appointment Scheduling**: Manage and schedule patient appointments
- **Treatment Documentation**: Record and track dialysis treatment details
- **Patient Communication**: Send notifications and reminders to patients

### Administrative Features
- **Center Management**: Add and manage dialysis centers
- **User Administration**: Create and manage user accounts with role-based access control
- **Reporting**: Generate reports on patient outcomes and center performance
- **Audit Logging**: Track system activities for compliance and security

## Architecture

### Monorepo Structure

```
dialysis-connect-hub/
├── dialyzeease-web/         # React frontend
│   ├── public/        # Static assets
│   ├── src/           # Frontend code
│   │   ├── api/       # API service functions
│   │   ├── components/# Reusable React components
│   │   ├── config/    # Configuration files
│   │   ├── data/      # Static data and mock data
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utilities and helpers
│   │   ├── pages/     # Page components
│   │   ├── types/     # TypeScript type definitions
│   │   ├── utils/     # Utility functions
│   │   ├── App.tsx    # Main app component
│   │   └── main.tsx   # Entry point
│   └── package.json   # Frontend dependencies
│
├── dialyzeease-api/         # Node.js backend
│   ├── config/        # Backend configuration
│   ├── controllers/   # API controllers
│   ├── middleware/    # Express middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── scripts/       # Utility scripts
│   ├── server.js      # Server entry point
│   └── package.json   # Backend dependencies
│
├── dialyzeease-scripts/     # DB + DevOps scripts
│   └── *.sql          # Database schema files
│
└── dialyzeease-docs/        # Documentation
    ├── api/           # API documentation
    ├── database/      # Database documentation
    ├── user-guides/   # User guides
    └── architecture/  # Architectural documentation
```

### Technical Stack

- **Frontend**: React, TypeScript, Vite, React Router, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MySQL/MariaDB
- **API**: RESTful API architecture
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod validation
- **Data Visualization**: Nivo, Recharts

## System Requirements

- Node.js v16.x or higher
- MySQL/MariaDB v8.0 or higher
- npm v8.x or higher (or yarn/bun)
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DialyzeEase.git
cd DialyzeEase
```

### 2. Backend Setup (dialyzeease-api)

```bash
cd dialyzeease-api
npm install

# Create .env file with your configuration
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=dc_hub
DB_PASSWORD=DC-Hu2
DB_NAME=dc_hub
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:8080
```

Initialize the database:

```bash
# Make sure you're in the dialyzeease-api directory
cd dialyzeease-api
npm run init-db
```

Start the backend server:

```bash
cd dialyzeease-api
npm start
```

The backend API will be available at http://localhost:5000.

### 3. Frontend Setup (dialyzeease-web)

```bash
cd dialyzeease-web
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend application will be available at http://localhost:8080.

## API Documentation

The API documentation is available in the `dialyzeease-docs/api` directory. Key endpoints include:

### Health Check
```
GET /health
```

### Authentication
```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/verify
```

### Patients
```
GET /api/patients
GET /api/patients/:id
POST /api/patients
PUT /api/patients/:id
DELETE /api/patients/:id
```

### Appointments
```
GET /api/appointments
GET /api/appointments/:id
POST /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id
```

### Centers
```
GET /api/centers
GET /api/centers/:id
POST /api/centers
PUT /api/centers/:id
DELETE /api/centers/:id
```

### CKD Records
```
GET /api/ckd-records
GET /api/ckd-records/:id
POST /api/ckd-records
PUT /api/ckd-records/:id
DELETE /api/ckd-records/:id
```

### Users
```
GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

## Database Schema

The database schema is documented in `dialyzeease-docs/database/schema.md`. The main tables include:

- `users` - User accounts and authentication
- `patients` - Patient profiles and medical information
- `appointments` - Dialysis appointment scheduling
- `centers` - Dialysis center information
- `ckd_records` - CKD stage tracking and history
- `roles` - User role definitions

## Development

### Project Structure

```
dialysis-connect-hub/
├── dialyzeease-web/         # React frontend
├── dialyzeease-api/         # Node.js backend
├── dialyzeease-scripts/     # DB + DevOps scripts
├── dialyzeease-docs/        # Documentation
├── dialyzeease-app/         # Mobile app (future)
└── dialyzeease-protocol/    # Protocol definitions (future)
```

### Frontend Structure (dialyzeease-web)

- `public/` - Static assets
- `src/` - Frontend code
  - `api/` - API service functions
  - `components/` - Reusable React components
  - `config/` - Configuration files
  - `data/` - Static data and mock data
  - `hooks/` - Custom React hooks
  - `lib/` - Utilities and helpers
  - `pages/` - Page components
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `App.tsx` - Main app component
  - `main.tsx` - Entry point

### Backend Structure (dialyzeease-api)

- `controllers/` - API controllers
- `middleware/` - Express middleware
- `models/` - Database models
- `routes/` - API routes
- `config/` - Backend configuration
- `utils/` - Utility functions
- `server.js` - Server entry point

## Deployment

### Backend Deployment

```bash
cd dialyzeease-api
npm run build
npm run start:prod
```

### Frontend Deployment

```bash
cd dialyzeease-web
npm run build
```

The built files will be in the `dist` directory, which can be deployed to any static hosting service.

## Testing

### Backend Tests

```bash
cd dialyzeease-api
npm test
```

### Frontend Tests

```bash
cd dialyzeease-web
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/DialyzeEase](https://github.com/yourusername/DialyzeEase)
