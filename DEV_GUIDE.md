# AgentCraft Client Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Modern terminal (VS Code terminal, PowerShell, etc.)

### Installation & Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server:**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser:**
   - Local: http://localhost:5173/
   - Network: http://[your-ip]:5173/

## 📦 Dependencies

### Updated Versions (Dec 2024)
- **Vite**: `5.4.19` (downgraded from 6.3.5 for compatibility)
- **React**: `19.1.0`
- **TypeScript**: `5.8.3`
- **Tailwind CSS**: `4.1.10`
- **React Router**: `7.6.2`

### Why Vite 5.x?
- Better compatibility with development tools
- Stable ecosystem support
- Production-ready and battle-tested

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
pnpm run dev

# Production build
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format
```

## 🔧 Configuration

### Vite Config Features
- **Port**: 5173 (default)
- **Host**: `true` (accessible from network)
- **HMR Overlay**: Disabled for better dev experience
- **Path Aliases**: Configured for clean imports

### Path Aliases Available
```typescript
import Component from '@/components/Component'
import { useStore } from '@/stores/store'
import { apiService } from '@/services/api'
```

## 🎨 Styling

### Tailwind CSS v4
- **Configuration**: `tailwind.config.js`
- **Global Styles**: `src/styles/global.css`
- **Features**: Custom utilities, luxury components, animations

### Custom CSS Classes
- `.btn-primary` - Primary button with gradient
- `.btn-secondary` - Secondary button with backdrop
- `.card-luxury` - Luxury card with hover effects
- `.container-full` - Full-width container
- `.container-content` - Content-constrained container

## 🐛 Troubleshooting

### Common Issues & Solutions

#### CSS Import Order Error
```
@import must precede all other statements
```
**Solution**: Already fixed - Google Fonts import moved to top of `global.css`

#### Port Already in Use
```bash
# Find and kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <process-id> /F
```

#### Permission Issues (Windows)
```bash
# Run as administrator or change execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Module Resolution Issues
```bash
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
pnpm install
```

## 🌐 Development Environment

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### Terminal Options
- ✅ VS Code integrated terminal
- ✅ PowerShell
- ✅ Command Prompt
- ✅ Git Bash
- ✅ Windows Terminal

## 📁 Project Structure

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── sections/         # Landing page sections
│   ├── layouts/          # Layout components
│   ├── stores/           # Zustand state management
│   ├── services/         # API services
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript definitions
│   ├── styles/           # Global styles
│   └── validation/       # Form validation schemas
├── public/               # Static assets
├── dist/                 # Production build output
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔄 Development Workflow

1. **Start dev server**: `pnpm run dev`
2. **Make changes**: Files auto-reload via HMR
3. **Check types**: TypeScript errors in terminal/IDE
4. **Lint code**: `pnpm run lint` before committing
5. **Format code**: `pnpm run format` for consistency

## 🚀 Production Build

```bash
# Build for production
pnpm run build

# Preview production build locally
pnpm run preview

# Build output in dist/ directory
```

## 📝 Notes

- **Hot Module Replacement (HMR)**: Enabled for fast development
- **TypeScript**: Strict mode enabled for better code quality
- **Code Splitting**: Automatic via Vite
- **Asset Optimization**: Handled by Vite build process
- **Environment Variables**: Use `.env` files for configuration

## 🆘 Need Help?

If you encounter any issues:

1. Check this troubleshooting guide
2. Clear `node_modules` and reinstall
3. Restart the development server
4. Check browser console for errors
5. Verify Node.js version compatibility

The development environment is now optimized for a smooth, modern development experience! 🎉 