
# DialyzeEase - Project Structure

## Monorepo Structure
```
dialysis-connect-hub/
├── dialyzeease-web/         # React frontend
├── dialyzeease-api/         # Node.js backend
├── dialyzeease-scripts/     # DB + DevOps scripts
├── dialyzeease-docs/        # Documentation
```

## Frontend Structure (dialyzeease-web)
```
dialyzeease-web/
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

## Backend Structure (dialyzeease-api)
```
dialyzeease-api/
├── controllers/                # API controllers
├── middleware/                 # Express middleware
├── models/                     # MongoDB models
├── routes/                     # API routes
├── config/                     # Backend configuration
├── utils/                      # Utility functions
├── server.js                   # Server entry point
└── package.json                # Backend dependencies
```

## Scripts Structure (dialyzeease-scripts)
```
dialyzeease-scripts/
├── db/                         # Database scripts
│   ├── init-db.js              # Database initialization script
│   └── sampleData/             # Sample data for database initialization
├── deploy/                     # Deployment scripts
└── README.md                   # Documentation for scripts
```

## Documentation Structure (dialyzeease-docs)
```
dialyzeease-docs/
├── api/                        # API documentation
├── database/                   # Database documentation
│   └── schema.md               # Database schema documentation
├── user-guides/                # User guides
└── architecture/               # Architectural documentation
```
