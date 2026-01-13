# Brisa Gallery

A modern Brisa gallery website inspired by contemporary design.

## Features

- Minimalist black & white design
- Responsive layout (mobile-first)
- Collection showcase with seasonal archives
- ARCHIVE with category filtering
- Product detail pages with image gallery
- NEWS, CALL, and PLACE pages
- Smooth animations with Framer Motion
- SEO optimized
- Custom 404 page

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Animations**: Framer Motion
- **Package Manager**: Bun
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Brisa-gallery

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

```bash
# Development
bun run dev          # Start development server

# Production
bun run build        # Build for production
bun run start        # Start production server

# Linting
bun run lint         # Run ESLint
```

## Project Structure

```
Brisa-gallery/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── collection/        # Collection pages
│   │   ├── ARCHIVE/              # ARCHIVE pages
│   │   ├── NEWS/             # NEWS page
│   │   ├── CALL/           # CALL page
│   │   ├── PLACE/         # PLACE page
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── layout/            # Layout components (Header, Nav, Footer)
│   │   └── features/          # Feature components
│   ├── lib/                   # Utilities and data
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
├── public/                    # Static assets
└── .github/workflows/         # CI/CD pipelines
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build and run
docker-compose up

# Or build manually
docker build -t Brisa-gallery .
docker run -p 3000:3000 Brisa-gallery
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Brisa Gallery
```

## Design System

- **Colors**: Black (#000000), White (#FFFFFF), Gray (#333333)
- **Typography**: System fonts with wide letter-spacing (0.05em - 0.2em)
- **Layout**: Max-width 1440px, responsive breakpoints at 600px and 1024px
- **Animations**: Subtle fade-in and slide effects using Framer Motion

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

---

Built with Next.js and Bun
