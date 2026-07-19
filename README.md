# 📚 Learn It

A personal skill-learning tracker that helps you learn and share new skills through structured Learning Paths. Import Markdown files, track your progress, test your knowledge with quizzes, and share your learning paths with others!

> 🚧 **Under Active Development** - This project is currently being built. Check back soon for updates!

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Zustand | State management |
| React Router | Navigation |
| react-i18next | Internationalization (EN/IT) |
| localStorage | Data persistence |
| GitHub Pages | Deployment |

## 🚀 How to Run

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/learn-it.git

# Navigate to project directory
cd learn-it

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter |

## 📖 How to Use

### Importing a Learning Path

1. Click the **Import Learning Path** button on the Dashboard or Learning Paths page
2. Drag and drop a `.md` file or click to browse
3. Preview the parsed content (title, description, difficulty, tags, author)
4. Confirm the import — the path is saved locally and persists across sessions

> ⚠️ File size limit: **50KB**. If your file exceeds this, try splitting the learning path into two separate files.

### Language Switching

Toggle between English and Italian using the language button in the sidebar. Your preference is saved automatically.

## 🤖 AI Usage

This project was developed with the assistance of [opencode](https://opencode.ai), an AI coding tool.
It was created as part of a personal learning journey to explore and understand AI-assisted software development.

All code, architecture decisions, and implementation were guided through AI conversation,
while design choices, feature priorities, and final review were made by the human developer.

## 📚 Documentation

- [Markdown Format Specification](docs/markdown-format.md) - How to create Learning Paths
- [Design System](docs/design/style.md) - Colors, typography, spacing, and style rules
- [Training Documentation](docs/training/README.md) - Components and concepts used in the project
