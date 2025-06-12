# Logits.App

![Demo GIF](https://github.com/rkdune/latent/blob/main/demogif.gif)


A modern, terminal-inspired AI chat interface built with Next.js and OpenRouter. Features a sleek dark theme, markdown support, and beautiful code blocks.

## Features

- 💬 Real-time streaming responses
- 📝 Markdown and code syntax highlighting
- 🔄 Multiple AI model support via OpenRouter
- 💾 Chat history management
- 🌓 Theme customization


## Project Structure

```
src/
├── app/
│   ├── api/chat/
│   │   └── route.ts           # OpenRouter API integration and streaming
│   ├── globals.css            # Global styles and CSS variables
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main application entry point
├── components/
│   ├── chat-interface.tsx     # Main chat UI component
│   ├── model-selector.tsx     # AI model selection dropdown
│   └── theme-wrapper.tsx      # Theme application wrapper
├── contexts/
│   ├── ModelContext.tsx       # Model selection state management
│   └── ThemeContext.tsx       # Theme state management
├── hooks/
│   └── useChat.ts             # Chat state and message handling
├── lib/
│   └── utils.ts               # Utility functions (cn, etc.)
└── types/
    └── chat.ts                # TypeScript type definitions
```

## Color Palette

- **Primary Text**: #DEDEDE (active/strong white)
- **Secondary Text**: #ABABAB (weaker gray)
- **Primary Background**: #181818 (main areas)
- **Secondary Background**: #252525 (inactive/header areas)
- **Border**: #404040
- **Border Hover**: #333333

