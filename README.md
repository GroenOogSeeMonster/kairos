# Kairos - AI-Powered Personal Planning Assistant

A modern, intuitive, and AI-powered Personal Planning Assistant that helps users effectively plan, prioritize, and align their short- and long-term goals, integrating seamlessly into their daily routines.

![Kairos Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC)

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

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Docker** (optional) - [Download here](https://www.docker.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kairos.git
   cd kairos
   ```

2. **Run the installation script**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Configure your environment**
   - Edit `backend/.env` with your database and API keys
   - Edit `frontend/.env` with your Google OAuth client ID

4. **Start the application**
   ```bash
   # Local development
   ./start-local.sh
   
   # Or with Docker
   ./start-docker.sh
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for modern styling
- **Framer Motion** for smooth animations
- **React Query** for data fetching
- **React Hook Form** for form management
- **Lucide React** for beautiful icons

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

## 🎨 Modern UI Features

### Clean & Intuitive Design
- **Modern Card Layout**: Clean, organized information display
- **Responsive Design**: Works perfectly on all devices
- **Dark Mode Support**: Easy on the eyes in any lighting
- **Smooth Animations**: Delightful micro-interactions

### Enhanced User Experience
- **Smart Search**: Find goals and tasks instantly
- **Filter & Sort**: Organize content your way
- **Progress Tracking**: Visual progress indicators
- **Quick Actions**: One-click task completion

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels
- **High Contrast**: Clear visual hierarchy
- **Focus Management**: Logical tab order

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

### Database (Supabase)
1. Create a new project on Supabase
2. Get your connection string
3. Update `DATABASE_URL` in your environment
4. Run migrations: `npx prisma migrate deploy`

## 📊 Project Structure

```
kairos/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   └── prisma/         # Database schema
├── docs/                   # Documentation
└── scripts/               # Setup and deployment scripts
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

## 🎯 Roadmap

- [ ] **AI Goal Suggestions**: Smart goal recommendations based on user patterns
- [ ] **Advanced Analytics**: Detailed productivity insights and trends
- [ ] **Team Collaboration**: Shared goals and team planning features
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Calendar Sync**: Enhanced calendar integration with conflict resolution
- [ ] **Voice Commands**: Voice-controlled task management
- [ ] **Integrations**: Slack, Notion, and other productivity tools

---

Built with ❤️ for productive people everywhere.