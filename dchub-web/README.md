# Dialysis Connect Hub - Frontend

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff)

The frontend web application for Dialysis Connect Hub, a comprehensive platform connecting dialysis patients with healthcare providers.

## Features

- **Patient Portal**: Dashboard, appointment management, CKD tracking
- **Healthcare Provider Portal**: Patient management, scheduling, treatment documentation
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with React, Tailwind CSS, and Shadcn UI components
- **Data Visualization**: Charts and graphs for patient data using Nivo and Recharts
- **Form Handling**: Robust form validation with React Hook Form and Zod

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod
- **Data Visualization**: Nivo, Recharts
- **Date Handling**: date-fns

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher (or yarn/pnpm)

## Installation

### 1. Clone the Repository

If you're only working with the frontend:

```bash
git clone https://github.com/yourusername/DialysisConnectHub.git
cd DialysisConnectHub/dchub-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

By default, the application is configured to connect to the backend API running on `http://localhost:5000`. If you need to change this, update the API configuration in `src/config/api.config.ts`.

## Development

### Start Development Server

```bash
npm run dev
```

This will start the development server at http://localhost:8080 (or another port if 8080 is in use).

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
dchub-web/
├── public/              # Static assets
├── src/
│   ├── api/             # API service functions
│   ├── components/      # Reusable React components
│   │   ├── common/      # Shared components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── home/        # Homepage components
│   │   ├── layout/      # Layout components
│   │   ├── patient/     # Patient-specific components
│   │   └── ui/          # UI components (Shadcn)
│   ├── config/          # Configuration files
│   ├── data/            # Static data and mock data
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .gitignore           # Git ignore file
├── components.json      # Shadcn UI configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Connecting to the Backend

The frontend is configured to connect to the backend API. You can toggle between using mock data and the real API by modifying the `USE_MOCK_API` flag in `src/config/api.config.ts`.

## Browser Support

The application is optimized for modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file in the root directory for details.

## Related Projects

- [dchub-api](../dchub-api) - Backend API server
- [dchub-app](../dchub-app) - Mobile application (future development)
