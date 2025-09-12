# Faculty Frontend

This is the faculty portal for the EduPortal system, built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of pending reviews and recent activities
- **Pending Reviews**: Review and approve student achievements and certifications
- **Review History**: Track all review activities and decisions
- **Profile**: Manage faculty profile and personal information

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
- **React Router** - Client-side routing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── Navigation.tsx  # Main navigation component
│   └── StatsCard.tsx   # Statistics display component
├── pages/              # Page components
│   ├── FacultyDashboard.tsx
│   ├── PendingReviews.tsx
│   ├── ReviewHistory.tsx
│   ├── Profile.tsx
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
