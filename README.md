# Munday Reviews - Full Stack Developer Challenge

## Project Overview
A review platform built with Angular and Node.js, focusing on strict data validation and real-time updates.

## Key Features Implemented

### 1. Review Dashboard & Data Visualization
- Real-time updates using WebSocket integration
- Organization rating statistics and trends
- Rating distribution visualization
- Review timeline charts

### 2. Data Validation & Filtering
- Strict review validation rules (client & server-side)
- Review filtering by:
  - Date range
  - Rating
  - Status
  - Keywords
- Input sanitization and validation

### 3. CRUD Operations
- Complete review management system
- User authentication and authorization
- Organization management
- Real-time updates for all operations

### 4. Technical Implementation

#### Frontend (Angular 17)
- Real-time WebSocket integration
- Reactive forms with validation
- Material UI components
- TailwindCSS for styling
- Chart.js for data visualization

#### Backend (Node.js)
- Express.js REST API
- Socket.IO for real-time updates
- SQLite database with Sequelize ORM
- JWT authentication
- Input validation middleware

#### DevOps
- Docker containerization
- GitHub Actions CI/CD
- Automated testing setup

## Setup Instructions

### Prerequisites
- Docker Desktop
- Node.js 20.x (for local development)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/Munday-Interview.git
cd Munday-Interview
```

2. Start with Docker Compose:
```bash
docker-compose up
```

3. Access the application:
- Frontend: http://localhost
- API: http://localhost:3000

### Default Admin Credentials
- Email: admin@example.com
- Password: Admin123!@#

## Implementation Details

### Data Validation
- Server-side validation using express-validator
- Client-side form validation using Angular Reactive Forms
- Custom validation rules for reviews:
  - Rating (1-5 stars)
  - Minimum content length
  - Required fields validation

### Real-time Features
- WebSocket integration for live updates
- Real-time review notifications
- Live rating updates
- Instant data synchronization

### Database Structure
- Users (authentication, profiles)
- Organizations (company details)
- Reviews (ratings, content, metadata)
- Relationships and foreign key constraints

## Testing
- Backend unit tests with Jest
- Frontend tests with Jasmine
- GitHub Actions automated testing

## Note on UI/UX
This implementation focused primarily on functionality and technical requirements, with emphasis on:
- Robust data validation
- Real-time updates
- Secure authentication
- Efficient data management
- Scalable architecture

While the UI is functional and responsive, priority was given to implementing core features and ensuring system reliability.

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
- **Containerization**: Docker

## License

MIT 