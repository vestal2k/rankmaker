# 🎯 Tierlist Maker

A modern, feature-rich tier list creation platform - an improved version of tiermaker.com with enhanced UX, real-time collaboration, and social features.

## ✨ Features

### ✅ Implemented (MVP)
- **Drag & Drop Builder**: Smooth, intuitive tier list creation with dnd-kit
- **Customizable Tiers**: Add/remove tiers, customize names and colors
- **Image Upload**: Upload multiple images locally
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Authentication**: Secure auth via Clerk
- **Database**: PostgreSQL with Prisma ORM

### 🚧 Coming Soon
- **Cloud Storage**: Upload images to Cloudflare R2 or Vercel Blob
- **Save & Share**: Persistent tier lists with unique URLs
- **PNG Export**: Download tier lists as high-quality images
- **Explore Page**: Discover popular tier lists
- **Social Features**: Likes, comments, profiles
- **Real-time Collaboration**: Edit tier lists together
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL + Prisma ORM
- **Deployment**: Vercel (planned)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Clerk account ([dashboard.clerk.com](https://dashboard.clerk.com))
- Neon PostgreSQL database ([neon.tech](https://neon.tech))

### Installation

1. **Clone the repository** (or you're already here!)

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
tierlist-maker/
├── app/                    # Next.js app directory
│   ├── create/            # Tier list builder page
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── header.tsx        # Navigation header
├── lib/                  # Utilities
│   └── db.ts            # Prisma client instance
├── prisma/              # Database
│   └── schema.prisma    # Database schema
└── .claude/             # Project documentation (not committed)
```

## 🎨 Usage

### Creating a Tier List

1. Navigate to `/create`
2. Click "Add Images" to upload items
3. Drag images into different tiers
4. Customize tier names and colors
5. (Coming soon) Save and share your tier list!

## 📝 Development Notes

- Using Prisma 7 with new config format (`prisma.config.ts`)
- Authentication fully handled by Clerk (no manual password management)
- Images currently stored as base64 locally (cloud storage coming soon)
- Focused on MVP first, then iterating with social features

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project as inspiration for your own!

---

Built with ❤️ using Next.js and modern web technologies
