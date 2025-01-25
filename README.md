# Lettercast

Transform your newsletters into personalized podcasts delivered via WhatsApp.

Feel free to use this repo as a starting point for your own version. 

Otherwise, you can try it yourself at: www.lettercast.fyi

## Overview

This is a modern web application that converts newsletter content into audio format, making it easier to consume information on the go. Get the insights you love, delivered as a weekly AI-powered podcast episode right to your WhatsApp.

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

### Analytics
- PostHog

### Deployment
- Vercel

## How to Do It Yourself

1. Clone this repository
2. Create a `.env.local` file with the following variables:

```env
# DB
DATABASE_URL=your_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AutoContent
AUTOCONTENT_API_KEY=your_autocontent_api_key

# Green-API (WhatsApp)
NEXT_PUBLIC_GREEN_API_URL=your_green_api_url
GREEN_API_INSTANCE_ID=your_instance_id
GREEN_API_TOKEN=your_green_api_token
```

3. Set up email scraping:
   - For Gmail: Enable Gmail API in Google Cloud Console
   - Create OAuth 2.0 credentials
   - Get refresh token using OAuth 2.0 playground
   - Other email providers: Implement your own email fetching logic

4. Configure podcast generation frequency & logic
   - Use a cron service (like Vercel Cron) to trigger the generation

5. Run the development server:
```bash
npm install
npm run dev
```

Your instance will now:
- Fetch newsletters from your email
- Generate audio content weekly
- Deliver podcasts via WhatsApp

