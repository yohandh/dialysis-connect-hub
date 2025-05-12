
# DiaCare Web Application - Frontend Setup

## Overview
DiaCare is a comprehensive dialysis center management system designed to streamline the operations of dialysis centers, improve patient care management, and enhance communication between healthcare providers and patients.

## Features
- Patient portal with appointment booking, CKD stage tracking, and educational resources
- Staff portal for managing patients, appointments, and dialysis centers
- Admin portal for system-wide management and analytics
- Responsive design for all device types

## Tech Stack
- React 18
- TypeScript
- Vite
- TanStack React Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- React Router for navigation

## Prerequisites
- Node.js 18+ and npm/yarn
- Backend API service running (see dialyzeease-api README)

## Installation

1. Navigate to the frontend directory:
```bash
cd dialyzeease-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true  # Set to false to use the real backend
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:8080

## Build for Production

```bash
npm run build
```

## Mock API Mode

The application can run in two modes:
1. **Mock API Mode (default)**: Uses built-in mock data without needing a backend
2. **Real API Mode**: Connects to the backend API service

To toggle between modes:
- Set `VITE_USE_MOCK_API=true` in `.env` for mock mode
- Set `VITE_USE_MOCK_API=false` in `.env` for real API mode

## Portal Access

The application provides three different portals:
- **Patient Portal**: /patient
- **Staff Portal**: /staff
- **Admin Portal**: /admin

## Testing Accounts

For testing purposes, you can use these credentials:

### Patient Portal
- Username: patient
- Password: patient123

### Staff Portal
- Username: staff
- Password: staff123

### Admin Portal
- Username: admin
- Password: admin123
