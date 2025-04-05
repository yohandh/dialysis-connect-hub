
# Dialysis Connect Hub - Project Structure

## Monorepo Structure
```
dialysis-connect-hub/
├── dchub-web/         # React frontend
├── dchub-api/         # Node.js backend
├── dchub-scripts/     # DB + DevOps scripts
├── dchub-docs/        # Documentation
```

## Frontend Structure (dchub-web)
```
dchub-web/
├── public/                     # Static assets
├── src/                        # Frontend code
│   ├── api/                    # API service functions
│   ├── components/             # Reusable React components
│   ├── config/                 # Configuration files
│   ├── data/                   # Static data and mock data
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and helpers
│   ├── pages/                  # Page components
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
└── package.json                # Frontend dependencies
```

## Backend Structure (dchub-api)
```
dchub-api/
├── controllers/                # API controllers
├── middleware/                 # Express middleware
├── models/                     # MongoDB models
├── routes/                     # API routes
├── config/                     # Backend configuration
├── utils/                      # Utility functions
├── server.js                   # Server entry point
└── package.json                # Backend dependencies
```

## Scripts Structure (dchub-scripts)
```
dchub-scripts/
├── db/                         # Database scripts
│   ├── init-db.js              # Database initialization script
│   └── sampleData/             # Sample data for database initialization
├── deploy/                     # Deployment scripts
└── README.md                   # Documentation for scripts
```

## Documentation Structure (dchub-docs)
```
dchub-docs/
├── api/                        # API documentation
├── database/                   # Database documentation
│   └── schema.md               # Database schema documentation
├── user-guides/                # User guides
└── architecture/               # Architectural documentation
```
