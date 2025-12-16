# Finnish Words App

A web application for learning Finnish vocabulary with translations in English and Russian. Built with Next.js, React, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finnish-words-app.git
cd finnish-words-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials

For practice mode access:
- **Username**: admin
- **Password**: admin


## Project Structure

```
finnish-words-app/
├── app/
│   ├── components/
│   │   └── WordsTable.tsx      # Main table component with filtering
│   ├── config/
│   │   └── topics.ts           # Topic configuration
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── practice/
│   │   └── page.tsx            # Practice page (auth required)
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── not-found.tsx           # 404 page
│   └── page.tsx                # Home page (server component)
├── components/
│   └── ui/                     # shadcn/ui components
├── OmaSuomi words.csv          # Word database
└── public/                     # Static assets
```

## Data Format

The word data is stored in `OmaSuomi words.csv` with the following structure:

```csv
finnish;english;russian;type;group
ajattella (3), ajattelen;to think;думать;verb;Actions & Movement
```

## Features in Detail

### Filtering
- Filter by topic from the sidebar
- Filter by word type using interactive badges
- Combine topic and type filters for precise results

### Search
- Real-time search across all three languages
- Case-insensitive matching
- Works in combination with filters

### Authentication
- Session persistence using localStorage and cookies
- 7-day cookie expiration
- Protected practice mode route

## Building for Production

```bash
npm run build
npm run start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Milana Begantsova**

## Acknowledgments

- Word data sourced from OmaSuomi language learning materials
- UI components from shadcn/ui
- Built with Next.js and Tailwind CSS
