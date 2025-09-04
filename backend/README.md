# WAZZUP Backend

Minimal Node.js backend API with TypeScript and Express for the WAZZUP mobile app.

## Features

- TypeScript configuration
- Express.js server
- Basic CORS support for development
- Health check endpoint
- Error handling middleware
- Development mode with hot reloading

## Setup

```bash
cd backend
npm install
```

## Scripts

```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start

# Start the development server (with hot reloading)
npm run dev

# Clean build files
npm run clean
```

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check endpoint

## Development

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

```bash
PORT=8000 npm start
```

## Project Structure

```
backend/
├── src/
│   └── server.ts       # Main Express server
├── dist/               # Built JavaScript files (generated)
├── package.json
├── tsconfig.json
└── README.md
```