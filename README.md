# Lettercast

Transform your newsletters into personalized podcasts delivered via WhatsApp.

## Overview

Lettercast is a modern web application that converts newsletter content into audio format, making it easier to consume information on the go. Get the insights you love, delivered as a weekly AI-powered podcast episode right to your WhatsApp.

## Features

- **Newsletter Integration**: Connect your favorite newsletters to Lettercast for automated inbox management
- **AI-Powered Audio Generation**: Weekly personalized podcast episodes highlighting relevant insights
- **WhatsApp Delivery**: Receive audio digests and text summaries directly via WhatsApp
- **Time-Saving**: Get the essence of all your newsletters in just 15 minutes
- **Zero Inbox Clutter**: Automated newsletter management
- **Ultra-Convenient**: Listen on WhatsApp – no additional apps needed
- **Personalization**: Each episode is crafted specifically for your interests

## Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Backend
- PostgreSQL
- Supabase
- Drizzle ORM
- Server Actions

### Authentication
- Clerk

### Payments
- Stripe

### Deployment
- Vercel

## Project Structure

```
lettercast/
├── actions/           # Server actions
│   └── db/           # Database related actions
├── app/              # Next.js app router
│   ├── api/          # API routes
│   └── route/        # Route components
├── components/       # Shared components
│   ├── ui/          # UI components
│   └── utilities/   # Utility components
├── db/              # Database
│   └── schema/      # Database schemas
├── lib/             # Library code
│   └── hooks/       # Custom hooks
├── prompts/         # Prompt files
├── public/          # Static assets
└── types/           # Type definitions
```

