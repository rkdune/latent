# [Logits.App](https://logits.app)

![Demo GIF](https://github.com/rkdune/latent/blob/main/demogif.gif)

A modern, terminal-inspired AI chat interface built with Next.js and OpenRouter. Features persistent chat history, optional Google authentication, multiple open-source AI models, and a sleek UI with both dark and light themes.

## Features
- 💬 **Real-time streaming responses**
- 🔄 **Multiple open-source AI model support**
- 📝 **Rich markdown rendering**
- 🔑 **Google OAuth integration**
- 💾 **Persistent chat history**
- 🚪 **Guest mode**
- 🌓 **Dark/Light theme toggle**
- 📑 **Tab-based chat management**

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts       # NextAuth.js configuration
│   │   └── chat/
│   │       └── route.ts       # OpenRouter API integration and streaming
│   ├── globals.css            # Global styles and CSS variables
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main application entry point
├── components/
│   ├── chat-interface.tsx     # Main chat UI with tabs and sidebar
│   ├── model-selector.tsx     # AI model selection dropdown
│   ├── ApiKeyModal.tsx        # Custom API key configuration modal
│   └── Providers.tsx          # Client-side context providers wrapper
├── contexts/
│   ├── AuthContext.tsx        # Authentication state management
│   ├── ModelContext.tsx       # AI model selection state
│   ├── ThemeContext.tsx       # Dark/light theme management
│   └── ApiKeyContext.tsx      # Custom API key management
├── hooks/
│   ├── useChat.ts             # Chat state, tabs, and message handling
│   └── useDatabase.ts         # Supabase database operations
├── lib/
│   ├── utils.ts               # Utility functions (cn, etc.)
│   └── supabase.ts            # Supabase client configuration
└── types/
    └── chat.ts                # TypeScript type definitions
```

## Design System

- **Primary Text**: #DEDEDE (active/strong white)
- **Secondary Text**: #ABABAB (weaker gray)
- **Primary Background**: #181818 (main areas)
- **Secondary Background**: #252525 (inactive/header areas)
- **Border**: #404040
- **Border Hover**: #333333