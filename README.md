# Munday Reviews

A modern, full-stack review platform with strict validation rules, real-time updates, and comprehensive data visualization. Similar to Trustpilot but with enhanced data integrity and visualization features.

## 🎯 Core Features

### 1. Review Dashboard & Data Visualization
- **Overall Ratings Dashboard**
  - Aggregated average ratings per organization
  - Interactive time-series charts for review trends
  - Rating distribution visualizations (1-5 stars)
- **Real-time Updates**
  - WebSocket integration for live review updates
  - Instant dashboard metric updates
  - Live notification system

### 2. Strict Data Validation & Filtering
- **Review Validation Rules**
  - Required rating (1-5 stars)
  - Minimum character length for review text
  - User and organization validation
  - Client and server-side validation enforcement
- **Advanced Filtering System**
  - Date range filtering
  - Rating-based filtering
  - Review status filtering
  - Keyword search functionality

### 3. CRUD Operations
- Complete review management system
- Strict validation enforcement on all operations
- Audit trail for review modifications
- Role-based access control

### 4. Data Model
```typescript
User {
  id: string
  name: string
  email: string
  // Additional user fields
}

Organization {
  id: string
  name: string
  description: string
  // Additional organization fields
}

Review {
  id: string
  userId: string
  organizationId: string
  rating: number (1-5)
  reviewText: string
  timestamp: Date
  status: string
  // Additional review metadata
}
```

## 🛠 Technical Stack

### Frontend
- **Framework**: Angular 17
- **UI Components**:
  - TailwindCSS for modern, responsive design
  - Chart.js for interactive visualizations
  - Socket.io-client for real-time features
- **State Management**: NgRx (optional)
- **Testing**: Jasmine & Karma

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Socket.io
- **Security**:
  - JWT authentication
  - Express-validator
  - Helmet security headers
  - Rate limiting
- **Testing**: Jest

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Database Migrations**: Sequelize CLI
- **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js (v14 or higher)
- MySQL (if running without Docker)
- npm or yarn

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/munday-reviews.git
cd munday-reviews
```

2. Start the application stack:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

### Manual Setup

1. Configure Backend:
```bash
cd munday-reviews-backend
cp .env.example .env
npm install
```

2. Configure Frontend:
```bash
cd ../munday-reviews-frontend
npm install
```

3. Start Development Servers:
```bash
# Terminal 1 - Backend
cd munday-reviews-backend
npm run dev

# Terminal 2 - Frontend
cd munday-reviews-frontend
npm start
```

## 🔒 Data Validation Rules

### Review Submission
- Rating: Required, integer between 1-5
- Review Text: Required, minimum 50 characters
- User: Must be authenticated
- Organization: Must exist in database

### Input Sanitization
- HTML/Script tag removal
- Special character escaping
- Whitespace normalization

## 🔍 Filtering Capabilities

- **Date Range**: Filter reviews within specific timeframes
- **Rating**: Filter by star rating (1-5)
- **Status**: Filter by review status (pending/approved/rejected)
- **Search**: Full-text search across review content
- **Organization**: Filter by organization name/ID
- **Sorting**: Multiple sort options (date, rating, etc.)

## 📊 Data Visualization

- **Rating Distribution**: Bar/Pie charts showing rating breakdowns
- **Time Series**: Line charts for review trends
- **Organization Comparisons**: Comparative analytics
- **User Activity**: Review submission patterns
- **Interactive Filters**: Dynamic chart updates based on filters

## 🧪 Testing

```bash
# Run backend tests
cd munday-reviews-backend
npm test

# Run frontend tests
cd munday-reviews-frontend
npm test
```

## 📝 API Documentation

API documentation is available at `http://localhost:3000/api-docs` when running the application.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:
- Automated testing
- Code quality checks
- Docker image builds
- Deployment automation

## 📜 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular team
- Express.js community
- All contributors 