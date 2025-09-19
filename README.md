# 📱 Contact Manager - Full Stack CRUD Application

<div align="center">

![Contact Manager](https://img.shields.io/badge/Contact-Manager-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![Express](https://img.shields.io/badge/Express-5.1.0-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

*A modern, secure, and user-friendly contact management system built with Next.js and Express*

</div>

## 🌟 Features

### 🔐 **Authentication & Security**
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens (15-minute expiration)
- ✅ Password hashing with bcrypt
- ✅ Auto-logout on token expiration
- ✅ Protected routes and API endpoints

### 👥 **Contact Management**
- ✅ Create, Read, Update, Delete contacts
- ✅ Real-time search and filtering
- ✅ Contact statistics dashboard
- ✅ Confirmation dialogs for deletions
- ✅ Form validation and error handling

### 🎨 **User Experience**
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Dark/Light theme toggle
- ✅ Interactive components with Radix UI
- ✅ Loading states and error messages
- ✅ Mobile-friendly design

### ⚡ **Performance & Architecture**
- ✅ Next.js 15 with Turbopack
- ✅ API proxy configuration
- ✅ MongoDB Atlas integration
- ✅ Optimized database queries
- ✅ TypeScript for type safety

## 🏗️ Project Structure

```
CRUD application/
├── 📁 mycontact-frontend/          # Next.js Frontend
│   ├── 📁 app/
│   │   ├── 📁 auth/                # Authentication pages
│   │   ├── 📁 dashboard/           # Contact management
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   ├── 📁 components/ui/           # Reusable UI components
│   ├── 📁 lib/
│   │   ├── api.ts                  # API client & interceptors
│   │   └── utils.ts                # Utility functions
│   ├── .env.local                  # Environment variables
│   ├── next.config.ts              # Next.js configuration
│   └── package.json
│
├── 📁 mycontacts-backend/          # Express.js Backend
│   ├── 📁 config/
│   │   └── dbConnection.js         # MongoDB connection
│   ├── 📁 controllers/
│   │   ├── contactController.js    # Contact CRUD operations
│   │   └── userController.js       # User authentication
│   ├── 📁 middleware/
│   │   ├── errorHandleer.js        # Error handling
│   │   └── validateTokenHandler.js # JWT validation
│   ├── 📁 models/
│   │   ├── contactModel.js         # Contact schema
│   │   └── userModel.js            # User schema
│   ├── 📁 routes/
│   │   ├── contactRoutes.js        # Contact API routes
│   │   └── userRoutes.js           # User API routes
│   ├── .env                        # Environment variables
│   ├── server.js                   # Express server
│   └── package.json
│
├── start-dev.bat                   # Windows startup script
├── package.json                    # Root package.json
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd "CRUD application"
```

### 2️⃣ Backend Setup
```bash
cd mycontacts-backend
npm install
```

Create `.env` file:
```env
PORT=5001
ACCESS_TOKEN_SECRET=your_jwt_secret_key
CONNECTION_STRING=
```

### 3️⃣ Frontend Setup
```bash
cd ../mycontact-frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=/api
```

### 4️⃣ Start Development Servers

**Option 1: Using Batch File (Windows)**
```bash
# From root directory
start-dev.bat
```

**Option 2: Manual Start**
```bash
# Terminal 1 - Backend
cd mycontacts-backend
npm run dev

# Terminal 2 - Frontend
cd mycontact-frontend
npm run dev
```

**Option 3: Using Concurrently**
```bash
# From root directory
npm install
npm run dev
```

### 5️⃣ Access the Application
- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:5001

## 🔧 Configuration

### API Proxy Setup
The frontend uses Next.js rewrites to proxy API calls:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/users/:path*',
      destination: 'http://localhost:5001/api/users/:path*',
    },
    {
      source: '/api/contacts/:path*',
      destination: 'http://localhost:5001/api/contacts/:path*',
    },
  ];
}
```

### Database Schema

**User Model:**
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

**Contact Model:**
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  user_id: ObjectId (required, ref: User),
  timestamps: true
}
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/current` | Get current user (protected) |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts (protected) |
| POST | `/api/contacts` | Create contact (protected) |
| GET | `/api/contacts/:id` | Get contact by ID (protected) |
| PUT | `/api/contacts/:id` | Update contact (protected) |
| DELETE | `/api/contacts/:id` | Delete contact (protected) |

## 🛡️ Security Features

### JWT Authentication
- **Token Expiration**: 15 minutes
- **Auto-refresh**: Redirects to login on expiration
- **Secure Storage**: localStorage with automatic cleanup

### Password Security
- **Hashing**: bcrypt with salt rounds (10)
- **Validation**: Strong password requirements
- **Error Handling**: Specific error messages

### API Security
- **Protected Routes**: JWT middleware validation
- **Error Handling**: Comprehensive error responses
- **Input Validation**: Request body validation

### File Security
- **Environment Variables**: All `.env` files are gitignored
- **Sensitive Data**: Database credentials and secrets excluded
- **IDE Files**: Editor configurations ignored
- **Logs & Cache**: Temporary files excluded from version control

## 🎨 UI Components

### Built with Radix UI + Tailwind CSS
- **Dialog**: Modal confirmations
- **Tabs**: Authentication forms
- **Cards**: Contact display
- **Buttons**: Interactive elements
- **Inputs**: Form controls
- **Alerts**: Status messages

### Theme Support
- Light/Dark mode toggle
- Responsive design
- Accessible components
- Modern animations

## 🔍 Error Handling

### Frontend
- **API Interceptors**: Automatic error handling
- **User Feedback**: Toast notifications
- **Form Validation**: Real-time validation
- **Loading States**: User experience indicators

### Backend
- **Async Error Handler**: Centralized error handling
- **HTTP Status Codes**: Proper response codes
- **Detailed Logging**: Console logging for debugging
- **Validation Errors**: Mongoose validation

## 📊 Features in Detail

### Registration Flow
1. User fills registration form
2. Frontend validates input
3. Backend checks email uniqueness
4. Password is hashed and stored
5. User redirected to login

### Login Flow
1. User enters credentials
2. Backend validates email existence
3. Password comparison with bcrypt
4. JWT token generation
5. Token stored in localStorage
6. Redirect to dashboard

### Contact Management
1. **Create**: Add new contacts with validation
2. **Read**: View all contacts with search
3. **Update**: Edit contact information
4. **Delete**: Remove with confirmation dialog

### Auto-Logout System
1. **Token Expiration**: 15-minute JWT expiry
2. **API Interceptor**: Catches 401 responses
3. **Cleanup**: Removes stored data
4. **Redirect**: Automatic login redirect

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd mycontact-frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd mycontacts-backend
# Set environment variables
# Deploy to your preferred platform
```

### Environment Variables
**Production Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

**Production Backend:**
```env
PORT=5001
ACCESS_TOKEN_SECRET=your_production_secret
CONNECTION_STRING=your_production_mongodb_url
NODE_ENV=production
```

## 🔒 Security Notes

### Protected Files
The following files are automatically excluded from version control:
- `.env` - Backend environment variables
- `.env.local` - Frontend environment variables
- `node_modules/` - Dependencies
- `.history/` - IDE history files
- `test-*.js` - Test files with potential sensitive data
- IDE configuration files

### Before Committing
1. **Never commit** environment files
2. **Check** for hardcoded credentials
3. **Review** console.log statements
4. **Verify** .gitignore is working

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request



## 👨‍💻 Author

**Dhruv Soni**
- GitHub: Soniji5504
- Email: dhruvsoniji0505$@gmail.com
## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icons

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by Dhruv Soni

</div># Contact_manager
