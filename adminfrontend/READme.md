# Admin Frontend

This is the admin portal for the EduPortal system, built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Institution-wide analytics and management console
- **User Management**: Manage users, roles, and permissions
- **Reports**: Generate and manage institutional reports for accreditation
- **Settings**: Configure system-wide settings and preferences

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

To build for production:

```bash
npm run build
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **React Router** - Client-side routing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── Navigation.tsx  # Main navigation component
│   └── StatsCard.tsx   # Statistics display component
├── pages/              # Page components
│   ├── AdminDashboard.tsx
│   ├── UserManagement.tsx
│   ├── Reports.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── lib/                # Utility functions
└── App.tsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is part of the EduPortal system.
