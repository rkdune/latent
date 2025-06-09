# Latent Chat

## Color Palette

- **Text**: #DEDEDE (active/strong white)
- **Inactive Text**: #ABABAB (weaker gray)
- **Dark Background**: #181818 (main areas)
- **Lighter Dark Background**: #252525 (inactive/header areas)
- **Borders**: #404040, Hover: #333333

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # OpenRouter API integration
│   ├── layout.tsx           # Root layout
│   └── page.tsx            # Main page
├── components/
│   └── chat-interface.tsx   # Main chat UI component
├── hooks/
│   └── useChat.ts          # Chat state management
├── lib/
│   └── utils.ts            # Utility functions
└── types/
    └── chat.ts             # TypeScript type definitions
```