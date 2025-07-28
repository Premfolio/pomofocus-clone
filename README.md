# Pomofocus Clone

A full-stack Pomodoro timer web application built with React, Node.js, Express, and MongoDB. This application replicates the core functionality of Pomofocus with a modern, responsive design.

## Features

### 🎯 Core Timer Features
- **Pomodoro Timer**: 25-minute focus sessions
- **Short Breaks**: 5-minute breaks between sessions
- **Long Breaks**: 15-minute breaks after 4 Pomodoros
- **Auto-start options**: Automatically start breaks and Pomodoros
- **Session tracking**: Complete session history and statistics

### 📋 Task Management
- **Task creation and management**
- **Pomodoro estimation**: Estimate how many Pomodoros each task needs
- **Task completion tracking**
- **Project categorization**
- **Priority levels**

### 📊 Analytics & Reports
- **Activity summary**: Hours focused, days accessed, streaks
- **Focus time tracking**: Daily, weekly, monthly, yearly views
- **Detailed session history**
- **User rankings** (premium feature)

### ⚙️ Customizable Settings
- **Timer durations**: Customize Pomodoro, short break, and long break times
- **Sound settings**: Alarm sounds, volume, repeat options
- **Theme customization**: Multiple color themes
- **Automation options**: Auto-start timers and task switching

### 🔐 User Authentication
- **User registration and login**
- **JWT-based authentication**
- **User profiles and preferences**
- **Premium features support**

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Deployment
- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database

## Project Structure

```
pomofocus-clone/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── index.js          # Server entry point
├── package.json           # Root package.json
├── vercel.json           # Vercel configuration
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pomofocus-clone
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm run install-client

# Install server dependencies
npm run install-server
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/pomofocus
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/pomofocus

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task

### Timer
- `POST /api/timer/start` - Start timer session
- `POST /api/timer/complete/:id` - Complete timer session
- `GET /api/timer/active` - Get active session
- `GET /api/timer` - Get session history
- `GET /api/timer/stats` - Get timer statistics

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/reset` - Reset to default

### Reports
- `GET /api/reports` - Get comprehensive report data
- `GET /api/reports/detail` - Get detailed sessions
- `GET /api/reports/ranking` - Get user rankings

## Deployment to Vercel

### 1. Prepare for Deployment

#### Environment Variables
Set up environment variables in Vercel:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure JWT secret key
- `NODE_ENV` - Set to "production"

#### Database Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to Vercel environment variables

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm run install-all`

### 3. Build Configuration

The `vercel.json` file is already configured to:
- Route API requests to the Node.js server
- Serve the React app for all other routes
- Handle both frontend and backend builds

### 4. Post-Deployment

After deployment:
1. Set up environment variables in Vercel dashboard
2. Test the application functionality
3. Monitor logs for any issues

## Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes
3. Test locally: `npm run dev`
4. Commit changes: `git commit -m "Add new feature"`
5. Push and create pull request

### Database Migrations
When updating models:
1. Update the model schema
2. Test with existing data
3. Consider migration scripts for production

### API Development
1. Add new routes in `server/routes/`
2. Update models if needed
3. Test endpoints with Postman or similar
4. Update frontend to use new endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## Acknowledgments

- Inspired by [Pomofocus](https://pomofocus.io/)
- Built with modern web technologies
- Designed for productivity and focus 