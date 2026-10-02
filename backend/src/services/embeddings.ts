import { env } from "../env.js";
import { ConnextError, Errors } from "../errors.js";

export function hashEmbed(text: string, dimensions = env.EMBEDDING_DIMENSIONS): number[] {
  const vec = new Array(dimensions).fill(0);
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  if (tokens.length === 0) {
    vec[0] = 0.01;
    return vec;
  }
  for (const token of tokens) {
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const idx = Math.abs(h) % dimensions;
    vec[idx] += 1;
    vec[(idx + 17) % dimensions] += 0.5;
  }
  const norm = Math.sqrt(vec.reduce((s, n) => s + n * n, 0)) || 1;
  return vec.map((n) => n / norm);
}

type EmbedResult = { vector: number[]; provider: string; model: string };

async function callOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  input: string,
): Promise<number[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/embeddings`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ model, input }),
      signal: controller.signal,
    });
    if (res.status === 429) throw Errors.embeddingRateLimit();
    if (!res.ok) {
      const errText = await res.text();
      if (baseUrl.includes("11434")) throw Errors.ollamaUnavailable();
      throw new ConnextError(
        "EmbeddingProviderError",
        `Embedding provider returned ${res.status}: ${errText.slice(0, 200)}`,
        503,
      );
    }
    const json = (await res.json()) as {
      data?: { embedding?: number[] }[];
    };
    const embedding = json.data?.[0]?.embedding;
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new ConnextError("EmbeddingProviderError", "Malformed embedding response", 503);
    }
    return embedding;
  } catch (err) {
    if (err instanceof ConnextError) throw err;
    if (err instanceof Error && err.name === "AbortError") throw Errors.embeddingTimeout();
    if (baseUrl.includes("11434")) throw Errors.ollamaUnavailable();
    throw Errors.embeddingTimeout();
  } finally {
    clearTimeout(timer);
  }
}

function assertDim(vec: number[]): void {
  if (vec.length !== env.EMBEDDING_DIMENSIONS) {
    throw Errors.embeddingDimensionMismatch(vec.length, env.EMBEDDING_DIMENSIONS);
  }
}

export function isMockEmbeddings(): boolean {
  return env.EMBEDDING_BASE_URL === "mock" || env.EMBEDDING_MODEL === "mock-hash";
}

export async function embedText(text: string): Promise<EmbedResult> {
  if (isMockEmbeddings()) {
    const vector = hashEmbed(text);
    assertDim(vector);
    return { vector, provider: "mock", model: "mock-hash" };
  }

  try {
    const vector = await callOpenAiCompatible(
      env.EMBEDDING_BASE_URL,
      env.EMBEDDING_API_KEY,
      env.EMBEDDING_MODEL,
      text,
    );
    assertDim(vector);
    return { vector, provider: env.EMBEDDING_BASE_URL, model: env.EMBEDDING_MODEL };
  } catch (primaryErr) {
    if (env.EMBEDDING_FALLBACK_BASE_URL) {
      try {
        const vector = await callOpenAiCompatible(
          env.EMBEDDING_FALLBACK_BASE_URL,
          env.EMBEDDING_FALLBACK_API_KEY,
          env.EMBEDDING_FALLBACK_MODEL || env.EMBEDDING_MODEL,
          text,
        );
        assertDim(vector);
        return {
          vector,
          provider: env.EMBEDDING_FALLBACK_BASE_URL,
          model: env.EMBEDDING_FALLBACK_MODEL || env.EMBEDDING_MODEL,
        };
      } catch (fallbackErr) {
        throw fallbackErr instanceof ConnextError ? fallbackErr : primaryErr;
      }
    }
    throw primaryErr;
  }
}

export async function assertEmbeddingConfig(): Promise<void> {
  if (isMockEmbeddings()) {
    const probe = hashEmbed("connext-healthcheck");
    assertDim(probe);
    return;
  }
  if (!env.EMBEDDING_API_KEY && !env.EMBEDDING_BASE_URL.includes("11434")) {
    return;
  }
  const result = await embedText("connext-healthcheck");
  assertDim(result.vector);
}

export function toVectorLiteral(vec: number[]): string {
  return `[${vec.join(",")}]`;
}
