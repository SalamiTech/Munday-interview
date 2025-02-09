# Munday Reviews

A modern review platform built with Angular and Node.js, featuring real-time updates using WebSocket.

## Features

- 🔄 Real-time review updates
- 👥 User authentication
- 🏢 Organization management
- ⭐ Review creation and management
- 📊 Rating statistics and analytics

## Prerequisites

- Docker Desktop
- Node.js 20.x (for local development without Docker)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/Munday-Interview.git
cd Munday-Interview
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- API: http://localhost:3000

## Local Development (Without Docker)

### Backend Setup

```bash
cd munday-reviews-backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd munday-reviews-frontend
npm install
npm start
```

## Testing

Run backend tests:
```bash
cd munday-reviews-backend
npm test
```

Run frontend tests:
```bash
cd munday-reviews-frontend
npm test
```

## Project Structure

```
.
├── munday-reviews-frontend/  # Angular frontend application
├── munday-reviews-backend/   # Node.js backend API
├── docker-compose.yml        # Docker composition
└── README.md
```

## Tech Stack

- **Frontend**: Angular 17, Material UI, TailwindCSS
- **Backend**: Node.js, Express, SQLite
- **Real-time**: Socket.IO
- **Testing**: Jest, Jasmine
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## License

MIT 