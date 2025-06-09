import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Optional: for OpenRouter analytics
    "X-Title": "Latent Terminal Chat", // Optional: for OpenRouter analytics
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e4b-it:free",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const aiMessage = completion.choices[0]?.message?.content

    if (!aiMessage) {
      throw new Error('No response from AI model')
    }

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
} 