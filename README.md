# Munday Reviews

A modern, full-stack application for company reviews with real-time updates and interactive features.

## 🚀 Features

- User authentication and authorization
- Company review creation and management
- Real-time updates using WebSocket
- Interactive charts and analytics
- Responsive design with modern UI
- Rate limiting and security features
- Organization management

## 🛠 Tech Stack

### Frontend
- Angular 17
- TailwindCSS for styling
- Chart.js for data visualization
- Socket.io client for real-time features
- TypeScript

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM with SQLite/MySQL support
- Socket.io for WebSocket functionality
- JWT for authentication
- Express-validator for request validation
- Helmet for security
- Morgan for logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL (optional, SQLite included by default)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/munday-reviews.git
cd munday-reviews
```

2. Install Backend Dependencies:
```bash
cd munday-reviews-backend
npm install
```

3. Configure Environment Variables:
Create a `.env` file in the backend directory with the following variables:
```env
PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
NODE_ENV=development
```

4. Install Frontend Dependencies:
```bash
cd ../munday-reviews-frontend
npm install
```

## 🚀 Running the Application

### Backend
```bash
cd munday-reviews-backend
# Development mode with hot reload
npm run dev
# OR Production build
npm run build
npm start
```

### Frontend
```bash
cd munday-reviews-frontend
# Development server
npm start
# OR Production build
npm run build
```

The frontend will be available at `http://localhost:4200`
The backend API will be available at `http://localhost:3000`

## 🔒 Security Features

- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- Input validation and sanitization

## 📦 Project Structure

```
munday-reviews/
├── munday-reviews-frontend/    # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/      # Feature modules
│   │   │   │   └── core/          # Core services
│   │   └── assets/
│   └── ...
│
└── munday-reviews-backend/     # Express backend application
    ├── src/
    │   ├── controllers/       # Request handlers
    │   ├── models/           # Database models
    │   ├── routes/           # API routes
    │   ├── config/           # Configuration files
    │   └── utils/            # Utility functions
    └── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Express.js community
- All contributors who participate in this project 