# Kairos - AI-Powered Personal Planning Assistant

A modern, intuitive, and AI-powered Personal Planning Assistant that helps users effectively plan, prioritize, and align their short- and long-term goals, integrating seamlessly into their daily routines.

## 🌟 Features

### AI-Driven Productivity
- **Smart Goal Suggestions**: AI helps define clear, actionable goals
- **Automatic Prioritization**: AI analyzes urgency/importance for optimal task ordering
- **Smart Scheduling**: AI proposes realistic schedules based on availability and priorities

### Goal & Task Management
- **Visual Hierarchy**: Long-term, short-term, and daily task organization
- **Drag-and-Drop Interface**: Intuitive task rearrangement and completion
- **Categorization**: Tag goals/tasks (work, personal, health, etc.)

### Calendar Integration
- **Multi-Platform Sync**: Google Calendar, Microsoft Outlook, Apple Calendar
- **Smart Scheduling**: AI integrates tasks with existing calendar events
- **Conflict Resolution**: Automatic detection and suggestions for scheduling conflicts

### Smart Notifications
- **Morning Briefings**: Daily priority summaries via push/email
- **End-of-Day Reviews**: One-tap daily close-off with reflection prompts
- **Smart Reminders**: Context-aware notifications for important tasks

### User Experience
- **Onboarding Wizard**: Guided setup for values, roles, and aspirations
- **Progress Analytics**: AI-generated weekly/monthly progress summaries
- **Mobile-First Design**: PWA with native app experience

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Hook Form** for form management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** as ORM
- **PostgreSQL** database
- **Redis** for caching and sessions

### AI & Integrations
- **OpenAI API** for AI features
- **Google Calendar API** for calendar sync
- **Firebase Cloud Messaging** for push notifications
- **OAuth2** for secure authentication

### Infrastructure
- **Docker** for containerization
- **Vercel** for frontend deployment
- **Railway** for backend deployment
- **Supabase** for database hosting

## 📱 User Journey

1. **Onboarding**: Guided setup to understand user's values and goals
2. **Goal Setting**: AI-assisted goal creation and refinement
3. **Daily Planning**: Smart task prioritization and scheduling
4. **Execution**: Focused work with intelligent reminders
5. **Reflection**: End-of-day review and tomorrow's planning
6. **Progress Tracking**: Regular AI-generated insights and adjustments

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- OpenAI API key
- Google Calendar API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kairos.git
   cd kairos
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   
   # Frontend environment
   cp frontend/.env.example frontend/.env
   ```

4. **Database Setup**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Servers**
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
OPENAI_API_KEY="sk-..."
JWT_SECRET="your-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Frontend (.env)
```env
VITE_API_URL="http://localhost:3001"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

## 📊 Project Structure

```
kairos/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── stores/         # State management
│   │   └── utils/          # Utility functions
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utility functions
├── shared/                  # Shared types and utilities
└── docs/                   # Documentation and mockups
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway up
```

## 📱 Mobile App

The application is built as a Progressive Web App (PWA) that provides a native-like experience on mobile devices. Users can install it directly from their browser.

## 🔒 Security & Privacy

- **OAuth2 Authentication**: Secure third-party login
- **Data Encryption**: All sensitive data encrypted at rest
- **GDPR Compliance**: User data control and export capabilities
- **Regular Security Audits**: Automated vulnerability scanning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.kairos.app](https://docs.kairos.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/kairos/issues)
- **Discord**: [Join our community](https://discord.gg/kairos)

---

Built with ❤️ for productive people everywhere.