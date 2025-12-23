<div align="center">

  <img src="public/logo.png" alt="Project Logo" width="72" height="72" />
  <h1>Rankmaker</h1>
  <p><em>A modern, feature-rich tier list creation platform</em></p>

  <!-- Header buttons -->
  <p>
    <a href="https://rankmaker.vercel.app/">
      <img src="https://img.shields.io/badge/Live_Demo-000?style=for-the-badge" alt="Live Demo"/>
    </a>
    <a href="https://github.com/vestal2k/rankmaker">
      <img src="https://img.shields.io/badge/Repository-000?style=for-the-badge&logo=github" alt="Repository"/>
    </a>
  </p>

  <br>
</div>

---

## Features

<div align="center">
<table>
<tr>
<td>

### Design

- Intuitive drag & drop interface
- Fully customizable tiers (colors, labels)
- Dark/Light mode support
- Responsive design for all devices
- Clean, modern UI with smooth animations

</td>
<td>

### Technical

- Real-time auto-save
- PNG/image export
- Support for images, videos, audio & GIFs
- YouTube, Twitter, Instagram embeds
- Undo/Redo with keyboard shortcuts
- Template system with 6 presets

</td>
<td>

### Experience

- No login required to create
- Public or private tier lists
- Upvote/downvote system
- Comments section
- Save favorite tier lists
- Share on social media
- User profiles with stats

</td>
</tr>
</table>
</div>

---

## Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,prisma,postgresql" />
</p>

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Drag & Drop**: dnd-kit
- **Deployment**: Vercel

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/vestal2k/rankmaker.git
cd rankmaker

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
pnpm prisma db push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Environment Variables

```env
DATABASE_URL=your_postgresql_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

---

## Feedback
If you enjoyed the project, leave a star or share it!
I'd love to hear your thoughts and ideas.

---

## Contributing
Contributions are welcome!
Feel free to open a pull request or an issue to suggest improvements.

---

## License
This project is under the **[MIT license](LICENSE)** – free to use with attribution.

---

## Growth

> Follow the evolution of the project over time

<div align="center">
<a href="https://star-history.com/#vestal2k/rankmaker&Timeline">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=vestal2k/rankmaker&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=vestal2k/rankmaker&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=vestal2k/rankmaker&type=Timeline" />
  </picture>
</a>
</div>

---

<br>

<p align="center" style="margin-top: 16px; margin-bottom: 0;">
  <a href="https://ko-fi.com/vestal2k">
    <img src="https://img.shields.io/badge/Support%20on%20Ko--fi-ff5e5b?style=for-the-badge" alt="Ko-fi"/>
  </a>
</p>

<p align="center" style="margin-top: 6px;">
  Project developed by <a href="https://github.com/vestal2k">Vestal</a>
</p>
