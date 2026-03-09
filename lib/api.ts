const ENV_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const API_BASE_CANDIDATES = [
  ENV_API_BASE,
  "http://127.0.0.1:9000",
  "http://localhost:9000",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
].filter((url): url is string => Boolean(url));

const REQUEST_TIMEOUT_MS = 15000;
let lastHealthyBaseUrl: string | null = ENV_API_BASE ?? null;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text || `Request failed with status ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as T;
}

function withTimeout(signal?: AbortSignal) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function requestWithFallback<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const preferred = [
    ...(lastHealthyBaseUrl ? [lastHealthyBaseUrl] : []),
    ...API_BASE_CANDIDATES.filter((url) => url !== lastHealthyBaseUrl),
  ];

  let lastError: unknown = null;

  for (const baseUrl of preferred) {
    const timeout = withTimeout(init?.signal);
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        ...init,
        signal: timeout.signal,
      });
      const data = await handleResponse<T>(res);
      lastHealthyBaseUrl = baseUrl;
      return data;
    } catch (err) {
      lastError = err;
    } finally {
      timeout.clear();
    }
  }

  throw new Error(
    `Unable to reach backend API. Tried: ${preferred.join(", ")}. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

export function getCurrentApiBaseUrl(): string {
  return lastHealthyBaseUrl ?? API_BASE_CANDIDATES[0] ?? "unresolved";
}

export type AnalyzeTextResult = {
  status: string;
  report: string;
  verification_results: Array<{
    claim?: string;
    status?: string;
    explanation?: string;
    correction?: string;
    evidence?: Array<{
      source?: string;
      title?: string;
      snippet?: string;
      url?: string;
      trusted?: boolean;
    }>;
  }>;
};

export async function analyzeTextApi(text: string): Promise<AnalyzeTextResult> {
  return requestWithFallback<AnalyzeTextResult>("/api/analyze-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
}

export type TrendCluster = {
  topic: string;
  count: number;
  examples?: string[];
};

export async function getTrendsApi(): Promise<TrendCluster[]> {
  return requestWithFallback<TrendCluster[]>("/api/trends", {
    method: "GET",
  });
}

export type RawArticle = {
  id: number;
  source_id?: string | null;
  external_id?: string | null;
  url?: string | null;
  content_type?: string | null;
  title?: string | null;
  text_content?: string | null;
  published_at?: string | null;
};

export async function getArticlesApi(): Promise<RawArticle[]> {
  return requestWithFallback<RawArticle[]>("/api/articles", {
    method: "GET",
  });
}

export async function triggerScanApi(): Promise<{ status: string }> {
  return requestWithFallback<{ status: string }>("/api/trigger-scan", {
    method: "POST",
  });
}

export async function analyzeArticleApi(
  contentId: number,
): Promise<AnalyzeTextResult> {
  return requestWithFallback<AnalyzeTextResult>(`/api/analyze/${contentId}`, {
    method: "POST",
  });
}

export async function healthCheckApi(): Promise<{ status: string }> {
  return requestWithFallback<{ status: string }>("/api/health", {
    method: "GET",
  });
}



