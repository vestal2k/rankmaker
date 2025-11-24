# 🎯 Rankmaker

A modern, feature-rich tier list creation platform - an improved version of tiermaker.com with enhanced UX, social features, and cloud storage.

## ✨ Features

### ✅ Core Features
- **Drag & Drop Builder**: Smooth, intuitive tier list creation with dnd-kit
- **Customizable Tiers**: Add/remove tiers, customize names and colors
- **Cloud Image Storage**: Upload images to Vercel Blob for permanent URLs
- **PNG Export**: Download tier lists as high-quality images
- **No Login Required**: Create tier lists without signing up, login only required to save
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Authentication**: Secure auth via Clerk
- **Database**: Neon PostgreSQL + Prisma ORM v7

### ✅ Social Features
- **Explore Page**: Discover public tier lists created by the community
- **User Profiles**: View tier lists by username
- **Likes System**: Like tier lists you enjoy
- **Comments**: Discuss and share opinions on tier lists
- **Public/Private Toggle**: Control who can see your tier lists

### ✅ Polish & UX
- **Dark Mode**: Apple-style dark theme (#161618) with system detection
- **Responsive Design**: Works beautifully on all devices
- **SEO Optimized**: OpenGraph and Twitter card metadata
- **Marketing Homepage**: Professional landing page with features showcase

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL + Prisma ORM v7
- **Cloud Storage**: Vercel Blob
- **Image Export**: html2canvas
- **Theme**: next-themes
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Clerk account ([dashboard.clerk.com](https://dashboard.clerk.com))
- Neon PostgreSQL database ([neon.tech](https://neon.tech))

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then fill in your credentials:
   ```env
   # Get from https://dashboard.clerk.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Get from https://neon.tech
   DATABASE_URL=postgresql://...

   # Vercel Blob (auto-configured on Vercel deployment)
   BLOB_READ_WRITE_TOKEN=vercel_blob_...

   # Optional: Base URL for metadata
   NEXT_PUBLIC_APP_URL=https://rankmaker.vercel.app
   ```

4. **Run database migrations**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
rankmaker/
├── app/                           # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── tierlists/           # CRUD operations for tier lists
│   │   ├── upload/              # Image upload to Vercel Blob
│   │   └── users/               # User profile endpoints
│   ├── create/                  # Tier list builder page
│   ├── explore/                 # Public feed of tier lists
│   ├── profile/[username]/      # User profile pages
│   ├── tierlist/[id]/          # Tier list detail view
│   ├── sign-in/                # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Marketing homepage
│   └── globals.css             # Global styles & dark theme
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── header.tsx              # Navigation header
│   ├── theme-provider.tsx      # Dark mode provider
│   └── theme-toggle.tsx        # Theme toggle button
├── lib/                        # Utilities
│   └── db.ts                   # Prisma client instance
├── prisma/                     # Database
│   ├── schema.prisma           # Database schema
│   └── prisma.config.ts        # Prisma v7 config
└── .claude/                    # Project documentation (not committed)
```

## 🎨 Usage

### Creating a Tier List

1. Navigate to `/create` or click "Start Creating" on the homepage
2. Click "Add Images" to upload items (stored in Vercel Blob)
3. Drag images into different tiers
4. Customize tier names and colors
5. Toggle public/private visibility
6. Click "Save" to store your tier list (requires login)
7. Click "Export PNG" to download as an image

### Exploring Tier Lists

1. Visit `/explore` to see all public tier lists
2. Click on any tier list to view details
3. Like and comment on tier lists you enjoy
4. Click on usernames to view their profile

## 🎨 Dark Mode

The dark theme uses Apple's signature color (#161618) for a premium, modern look. Users can toggle between light, dark, or system preference in the header.

## 📝 Development Notes

- Using Prisma 7 with new config format (`prisma.config.ts`)
- Authentication fully handled by Clerk (no manual password management)
- Images stored in Vercel Blob with public URLs and random suffixes
- Next.js 15 requires async params in API routes and dynamic pages
- Build includes automatic Prisma generation via postinstall hook
- useSearchParams wrapped in Suspense boundary for static generation

## 🚀 Deployment

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (BLOB_READ_WRITE_TOKEN is auto-configured)
4. Deploy!

The build process automatically:
- Generates Prisma Client
- Builds Next.js with optimizations
- Configures Vercel Blob storage

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project as inspiration for your own!

---

Built with ❤️ using Next.js, Prisma, and modern web technologies
