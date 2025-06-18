# 🤖 AgentCraft Frontend

A modern, responsive React frontend for the AgentCraft AI-powered chat application. Built with TypeScript, Tailwind CSS, and cutting-edge development tools for a scalable, maintainable codebase.

## 📋 Description

This frontend provides an intuitive and beautiful user interface for interacting with AI assistants. Features real-time chat, dark mode support, responsive design, and a modular architecture ready for future enhancements.

## 🛠 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.x for lightning-fast development
- **Styling**: Tailwind CSS 4.x with dark mode support
- **State Management**: Zustand for simple, scalable state
- **Routing**: React Router DOM with lazy loading
- **HTTP Client**: Axios with interceptors
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Package Manager**: pnpm

## 📁 Folder Structure

```
client/
├── src/
│   ├── app/                     # App-level providers and configuration
│   ├── features/               # Feature-based modules
│   │   └── chat/              # Chat feature
│   │       ├── components/    # ChatBox, ChatMessage, ChatInput
│   │       ├── pages/        # ChatPage
│   │       ├── services/     # API services
│   │       ├── store/        # Zustand store
│   │       ├── types/        # TypeScript interfaces
│   │       └── index.ts      # Feature exports
│   ├── shared/               # Shared utilities and components
│   │   ├── components/       # Reusable components
│   │   ├── ui/              # UI primitives (Button, Input)
│   │   ├── types/           # Global TypeScript types
│   │   └── utils/           # Utility functions (API client)
│   ├── layout/              # Layout components
│   ├── pages/               # Page components (HomePage)
│   ├── router/              # Router configuration
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles and Tailwind config
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entry point
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- AgentCraft backend running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

The app will automatically connect to the backend API running on `http://localhost:5000/api`.

## 📜 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint code analysis
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm preview` - Preview production build locally

## ✨ Features

### 🎨 **Modern UI/UX**
- Clean, responsive design that works on all devices
- Dark/light mode toggle with system preference detection
- Smooth animations and transitions
- Accessible components with proper ARIA labels

### 💬 **Chat Interface**
- Real-time chat with AI assistant
- Message history with timestamps
- Auto-scroll to latest messages
- Loading indicators and error handling
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### ⚡ **Performance**
- Lazy-loaded routes for optimal bundle splitting
- Component-level code splitting
- Optimized re-renders with proper state management
- Fast refresh during development

### 🧩 **Architecture**
- Feature-based folder structure for scalability
- Clean separation of concerns (components, services, stores)
- TypeScript strict mode for type safety
- Modular design ready for new features

## 🎯 API Integration

The frontend communicates with the backend through:

- **Base URL**: `/api` (proxied to backend)
- **Chat Endpoint**: `POST /api/chat`
- **Health Check**: `GET /api/health`

API client is pre-configured with:
- Request/response interceptors
- Error handling
- Timeout configuration
- Type-safe responses

## 🎨 Theming

### Dark Mode
Toggle between light and dark themes with the button in the header. Theme preference is:
- Saved to localStorage
- Respects system preference on first visit
- Applied instantly across all components

### Customization
Modify theme colors in `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      // Add your custom colors here
    }
  }
}
```

## 🔧 Development Guidelines

### Component Structure
```tsx
// Component with proper TypeScript and documentation
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div className="component-styles">
      {/* Component content */}
    </div>
  );
};
```

### State Management
Use Zustand for feature-specific state:
```tsx
interface FeatureState {
  data: Data[];
  isLoading: boolean;
}

export const useFeatureStore = create<FeatureState>((set) => ({
  data: [],
  isLoading: false,
  // actions here
}));
```

### API Services
Create typed API services:
```tsx
export class FeatureService {
  static async getData(): Promise<DataResponse> {
    const response = await api.get<DataResponse>('/feature/data');
    return response.data;
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `pnpm build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Add environment variables if needed

### Manual Deployment
```bash
pnpm build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards (ESLint + Prettier)
4. Ensure TypeScript passes (`pnpm build`)
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Use TypeScript strict mode
- Follow ESLint rules
- Format with Prettier
- Write descriptive commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for modern web experiences**
