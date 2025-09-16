## Environment variables

Create a `.env.local` with the following keys:

```env
# Database (Supabase Postgres)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres?schema=public"

# Supabase (client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# NextAuth (Google example)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Setup commands:

```bash
npx prisma generate
npx prisma db push
```

