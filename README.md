# Lunarpedia PaaS Platform

A modern Platform-as-a-Service (PaaS) solution for deploying Docker containers with integrated billing and user management.

## Features

- 🚀 **One-Click Docker Deployment** - Deploy popular services like n8n, Chatwoot, PostgreSQL
- 💳 **Credit-Based Billing** - Flexible pay-as-you-use pricing model
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 🌐 **Custom Domains** - Premium add-on for custom domain support
- 📊 **Real-time Dashboard** - Monitor services and usage
- 🛡️ **Admin Panel** - Comprehensive management interface
- 💰 **Automatic Refunds** - Pro-rated refunds for cancelled services

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lunarpedia-paas-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the database migration in the Supabase SQL editor

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:5173
   - Create an account or sign in
   - Start deploying services!

### Database Setup

The application uses Supabase as the backend. Run the migration file `supabase/migrations/create_initial_schema.sql` in your Supabase SQL editor to set up:

- User management with credit system
- Service types and user services
- Credit transactions and billing
- Premium add-ons system
- Row Level Security (RLS) policies

### Admin Access

To create an admin user:

1. Sign up normally through the application
2. In your Supabase dashboard, go to Table Editor > users
3. Find your user record and change the `role` field from `'user'` to `'admin'`
4. Sign out and sign back in to access admin features

## Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Environment Variables**
   Add these in your Netlify dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Manual Deployment

You can deploy the built files to any static hosting service:

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.tsx     # Marketing landing page
│   ├── UserDashboard.tsx   # User service management
│   ├── AdminDashboard.tsx  # Admin panel
│   ├── AuthModal.tsx       # Authentication modal
│   ├── PaymentModal.tsx    # Credit purchase modal
│   └── UserAddonsPage.tsx  # Premium add-ons
├── hooks/              # Custom React hooks
│   ├── useAuth.ts         # Authentication logic
│   └── useServices.ts     # Service management
├── lib/                # Utilities and configuration
│   └── supabase.ts        # Supabase client and types
└── App.tsx             # Main application component

supabase/
└── migrations/         # Database schema
    └── create_initial_schema.sql
```

## Key Features Explained

### Credit System
- Users start with 250 welcome credits
- Services cost credits per month (n8n: 50, Chatwoot: 40, PostgreSQL: 30)
- Automatic pro-rated refunds when services are cancelled
- Credit purchase system with bonus credits

### Service Management
- One-click deployment of Docker containers
- Automatic URL generation with subdomain
- Environment variable management with auto-generated secrets
- Service status monitoring (running, stopped, pending, error)

### Premium Add-ons
- Custom domain support (+25 credits/month)
- SSL certificates
- Priority support
- Advanced analytics

### Security
- Row Level Security (RLS) on all database tables
- Secure password generation for services
- User isolation - users can only access their own data
- Admin-only access to service type management

## API Integration

The application is ready for Docker orchestration integration. Key integration points:

- **Service Creation**: `useServices.createService()` - Ready to trigger Docker container deployment
- **Service Management**: Start/stop/restart functionality hooks available
- **Environment Variables**: Secure storage and injection into containers
- **URL Routing**: Automatic subdomain generation and custom domain support

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: support@lunarpedia.com

---

Built with ❤️ using React, Supabase, and modern web technologies.