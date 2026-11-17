import { GENERATED_TASKS_SCHEMA } from '@/lib/ai/schema'

// Works with any provider that exposes the "OpenAI-compatible" chat completions API
// (OpenAI, Mistral, Groq, OpenRouter, Together, Ollama, Gemini and Anthropic compatibility modes...).
// The provider is chosen with environment variables, so changing it never touches the code:
//   AI_API_URL          base URL, e.g. https://api.mistral.ai/v1 or http://localhost:11434/v1 (required)
//   AI_MODEL            model name, e.g. mistral-small-latest, gpt-4o-mini, llama3.1 (required)
//   AI_API_KEY          secret key; may be empty for a local model (optional)
//   AI_RESPONSE_FORMAT  how to ask for JSON: "json_schema" (default, strictest), "json_object" or "none"
//                       (for providers that do not support the first ones: the prompt describes the shape anyway)
const TIMEOUT_MS = 30_000

type ResponseFormatMode = 'json_schema' | 'json_object' | 'none'

// Success: the text of the answer. Failure: a message that is safe to show to the user.
export type LlmResult =
    | { ok: true; content: string }
    | { ok: false; message: string }

type ChatCompletionResponse = {
    choices?: { message?: { content?: unknown }; finish_reason?: string }[]
}

const getResponseFormatMode = (): ResponseFormatMode => {
    const mode = process.env.AI_RESPONSE_FORMAT
    return mode === 'json_object' || mode === 'none' ? mode : 'json_schema'
}

const buildResponseFormat = (mode: ResponseFormatMode) => {
    if (mode === 'json_schema') {
        return { response_format: { type: 'json_schema', json_schema: { name: 'GeneratedTasks', strict: true, schema: GENERATED_TASKS_SCHEMA } } }
    }
    if (mode === 'json_object') return { response_format: { type: 'json_object' } }
    return {}
}

/**
 * Asks the configured model for a JSON answer.
 * Server only: the key is read from AI_API_KEY (no NEXT_PUBLIC_ prefix, so the browser never sees it).
 * The details of an error are only logged on the server: the user gets a generic sentence.
 * No temperature nor token limit is sent: some models refuse them, and the prompt already limits the answer.
 *
 * @param systemPrompt the rules given to the model
 * @param userMessage  the request and its context
 * @returns            the answer text, or a message to display
 */
export const askLlm = async (systemPrompt: string, userMessage: string): Promise<LlmResult> => {
    const baseUrl = process.env.AI_API_URL
    const model = process.env.AI_MODEL
    if (!baseUrl || !model) {
        return { ok: false, message: "La génération par l'IA n'est pas configurée sur ce serveur." }
    }
    const apiKey = process.env.AI_API_KEY

    try {
        const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage },
                ],
                ...buildResponseFormat(getResponseFormatMode()),
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(TIMEOUT_MS),
        })

        if (!response.ok) {
            console.error(`The AI provider answered ${response.status}`)
            if (response.status === 429) return { ok: false, message: "Trop de demandes à l'IA, réessayez dans un instant." }
            return { ok: false, message: "L'IA est momentanément indisponible, réessayez plus tard." }
        }

        const body = await response.json() as ChatCompletionResponse
        const choice = body.choices?.[0]
        if (choice?.finish_reason === 'length') {
            return { ok: false, message: 'La réponse était trop longue. Demandez moins de tâches à la fois.' }
        }
        const content = choice?.message?.content
        if (typeof content !== 'string') {
            return { ok: false, message: "L'IA n'a pas renvoyé de réponse exploitable, réessayez." }
        }
        return { ok: true, content }
    } catch (error) {
        console.error('The AI call failed', error instanceof Error ? error.name : 'unknown error')
        return { ok: false, message: "Impossible de joindre l'IA, réessayez plus tard." }
    }
}

/**
 * Turns the text answered by the model into JSON. Some models wrap their JSON in a markdown fence
 * (```json ... ```) even when told not to: the fence is removed before parsing.
 *
 * @param content the text answered by the model
 * @returns       the parsed JSON (any shape), or null when it is not valid JSON
 */
export const parseJsonContent = (content: string): unknown => {
    const withoutFence = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    try {
        return JSON.parse(withoutFence)
    } catch {
        return null
    }
}
