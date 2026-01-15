# Seenyor Frontend Project Documentation

## Project Overview

This is a React-based frontend application built with Vite for the Seenyor elderly care platform. The application provides dashboards and management interfaces for different user roles including super admins, support agents, nurses, and end users.

## Project Structure

```
seenyor-frontend/
├── public/                    # Static assets
│   ├── Device.png            # Device image asset
│   ├── firebase-messaging-sw.js # Firebase messaging service worker
│   └── vite.png              # Vite favicon
├── src/                      # Source code
│   ├── _Nurse/               # Nurse-specific components and utilities
│   ├── api/                  # API service files for different features
│   ├── assets/               # Image and icon assets
│   ├── Components/            # Reusable UI components
│   ├── Context/              # React context providers
│   ├── font/                 # Custom fonts
│   ├── hook/                 # Custom React hooks
│   ├── Layout/               # Layout components
│   ├── lib/                  # Utility libraries
│   ├── Pages/                # Page components organized by feature
│   ├── redux/                # Redux store and related files
│   ├── Routes/               # Routing configuration
│   ├── Shared/               # Shared components and utilities
│   ├── store/                # Additional state management
│   ├── utils/                # Utility functions
│   ├── App.css               # Global styles
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Entry point
├── .env.development          # Development environment variables
├── .env.production           # Production environment variables
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore file
├── components.json           # Component library configuration
├── index.html                # HTML template
├── jsconfig.json             # JavaScript configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project README
├── vite.config.js            # Vite configuration
└── yarn.lock                 # Yarn lock file
```

### Key Directories Explained

1. **src/api/** - Contains API service files organized by feature:
   - AdminDashboard.js, AdminUser.js, Dashboard.js, etc.
   - Each file contains functions to interact with specific API endpoints

2. **src/Pages/** - Contains page components organized by feature:
   - AdminDashboard/ - Super admin dashboard pages
   - AdminUser/ - User management pages
   - Alerts/ - Alert management pages
   - Elderlies/ - Elderly person management pages
   - Supportnursing/ - Support nursing dashboard pages
   - And many more feature-specific page directories

3. **src/Components/** - Reusable UI components:
   - ActionManu/, ActiveAlerts/, AddIcon/, Admin/, etc.
   - Each directory contains related components for specific UI features

4. **src/Redux/** - State management with Redux Toolkit:
   - api/ - RTK Query API services
   - features/ - Redux slices for different features

5. **src/Routes/** - Routing configuration:
   - Custom route protection and role-based access control
   - Different routes for different user roles

## How to Run the Project

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd seenyor-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development Server

To start the development server with hot reloading:

```bash
npm run dev
# or
yarn dev
```

This will start the Vite development server, typically on http://localhost:5173

### Environment Configuration

The project uses environment variables for different environments:

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables

Key environment variables include:

- `VITE_APP_BASE_API` - Base API URL
- `VITE_APP_BASE_API_V1` - V1 API URL
- `VITE_APP_VERSION` - Application version
- Firebase configuration variables

## How to Build the Project

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

This command will:

- Bundle all JavaScript and CSS assets
- Optimize the code for production
- Generate source maps
- Output files to the `dist/` directory

### Previewing the Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

This will serve the built files on a local server for testing.

### Build Process Details

The build process uses Vite with the following features:

- Code splitting for optimized loading
- Asset optimization and compression
- Source map generation for debugging
- Environment variable replacement

## Project Features

### Role-Based Access Control

The application implements role-based access control with different dashboards for:

- Super Admin
- Support Agent
- Nurse
- End User
- Monitoring Agency
- Distributor
- Installer
- And other specialized roles

### Key Technologies Used

- React 18 with Hooks
- React Router for routing
- Redux Toolkit for state management
- Vite for build tooling
- Tailwind CSS for styling
- Ant Design component library
- Firebase for notifications
- ECharts for data visualization
- Socket.io for real-time communication

### Routing Structure

The application uses hash-based routing with protected routes based on user roles. Routes are organized by:

1. Authentication routes
2. Supporter routes (for support agents, nurses, end users)
3. Super Admin routes
4. Support Nursing routes (for office, distributor, installer roles)

## Development Workflow

### Adding New Features

1. Create new components in the appropriate directory under `src/Components/` or `src/Pages/`
2. Add new API services in `src/api/` if needed
3. Update routes in `src/Routes/index.jsx` if new pages are added
4. Add Redux slices in `src/redux/features/` if new state management is needed

### Code Organization

- Use the `@/` alias to import from the `src/` directory
- Follow the existing component structure and naming conventions
- Use lazy loading for routes to improve performance
- Implement proper error handling and loading states

## Deployment

The production build can be deployed to any static hosting service:

1. Run `npm run build` to create the production build
2. Upload the contents of the `dist/` directory to your hosting provider
3. Configure your hosting provider to serve `index.html` for all routes (SPA routing)

## Firebase Integration

The project integrates with Firebase for:

- Cloud Messaging (notifications)
- Authentication (handled via JWT tokens)

Firebase service worker is located at `public/firebase-messaging-sw.js`.

## Sentry Integration

The project uses Sentry for error tracking and performance monitoring with:

- Browser tracing integration
- Session replay integration
- User feedback integration

## Custom Scripts

Available npm scripts:

- `dev` - Start development server
- `build` - Create production build
- `lint` - Run ESLint
- `preview` - Preview production build locally
