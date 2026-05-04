# OwlForm Frontend

A modern, beautiful form endpoint service that allows you to collect form submissions without needing to build a backend. Built with Next.js, React, and Tailwind CSS.

## What is OwlForm?

OwlForm is a service that provides instant form endpoints for your websites. Instead of building a backend to handle form submissions, you simply:

1. **Create a form** in your OwlForm dashboard
2. **Get a unique endpoint URL** (e.g., `https://api.owlform.com/form/abc123`)
3. **Embed it anywhere** - Next.js, React, Vue, WordPress, Webflow, or plain HTML

```html
<form action="https://api.owlform.com/form/abc123" method="POST">
  <input name="name" placeholder="Full name" />
  <input name="email" placeholder="Work email" />
  <textarea name="message" rows="4"></textarea>
  <button type="submit">Send message</button>
</form>
```

That's it! No JavaScript required, no backend to maintain.

## Features

- ⚡ **60-second setup** - Register, grab your endpoint, paste into your form
- 📊 **Real-time dashboard** - Watch submissions appear live with search, filter, and export
- 🔌 **Framework agnostic** - Works with any HTML form, zero JavaScript required
- 🔀 **Custom redirects** - Send users to a thank-you page after submit

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **UI Library**: HeroUI (@heroui/react)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Charts**: Chart.js + react-chartjs-2
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or later
- **pnpm** 8.x or later (recommended) - or npm/yarn
- **OwlForm Backend API** running (see below)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/klee3/owlform_frontend.git
cd owlform_frontend
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

> **Note**: The frontend expects the OwlForm backend API to be running. If you're running the backend locally, it should be on `http://localhost:8080`. Update this URL if your backend is running elsewhere.

### 4. Run the Development Server

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
owloform_frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # User dashboard
│   │   └── [workspaceSlug]/
│   │       └── form/
│   │           └── [formSlug]/  # Form details & submissions
│   └── form-submitted/    # Thank you page after form submission
├── components/            # Reusable React components
│   ├── AppNavbar.tsx      # Main navigation bar
│   ├── AuthNavbar.tsx     # Auth pages navigation
│   ├── CreateFormDialog.tsx  # Form creation modal
│   ├── FormChart.tsx      # Form statistics chart
│   ├── FormHowToDrawer.tsx   # Integration instructions
│   └── FormSeciont.tsx    # Form section component
├── hooks/                 # Custom React hooks
│   └── api/              # API hooks (useFormStats, useDeleteForm, etc.)
├── lib/                   # Utility functions and config
│   ├── AppProvider.tsx    # App-wide context provider
│   ├── constant.ts       # Constants (API_BASE_URL)
│   └── api/              # API client configuration
├── store/                 # Zustand state stores
│   ├── session.store.ts   # User session state
│   └── workspace.store.ts # Workspace state
└── public/                # Static assets
```

## Available Scripts

| Command      | Description                      |
| ------------ | -------------------------------- |
| `pnpm dev`   | Start the development server     |
| `pnpm build` | Build the production application |
| `pnpm start` | Start the production server      |
| `pnpm lint`  | Run ESLint to check for errors   |

## Backend Setup

OwlForm requires a backend API to function. The frontend is designed to work with the OwlForm backend service.

For the backend, you'll need to set up the OwlForm backend repository. The backend handles:

- User authentication
- Form CRUD operations
- Form submission storage
- Webhook dispatching
- Email notifications

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on Vercel
3. Configure the `NEXT_PUBLIC_API_BASE_URL` environment variable
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS Amplify
- Docker container

## License

This project is private and for personal use.
