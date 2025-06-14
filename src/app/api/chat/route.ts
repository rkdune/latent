import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Get API key from headers (user's key) or fallback to environment variable
    const userApiKey = request.headers.get('x-api-key')
    const apiKey = userApiKey || process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key available' },
        { status: 401 }
      )
    }

    // Create OpenAI instance with appropriate API key
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Optional: for OpenRouter analytics
        "X-Title": "Logits Terminal Chat", // Optional: for OpenRouter analytics
      },
    })

    const completion = await openai.chat.completions.create({
      model: model || "google/gemma-3n-e4b-it:free", // Use selected model or default
      messages: messages,
      temperature: 0.7,
      max_tokens: 2500,
      stream: true, // Enable streaming
    })

    // Create a ReadableStream for the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              // Send the content as a JSON string with a newline delimiter
              const data = JSON.stringify({ content }) + '\n'
              controller.enqueue(new TextEncoder().encode(data))
            }
          }
          // Send a final message to indicate the stream is complete
          controller.enqueue(new TextEncoder().encode(JSON.stringify({ done: true }) + '\n'))
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(new TextEncoder().encode(JSON.stringify({ error: 'Streaming failed' }) + '\n'))
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
} 