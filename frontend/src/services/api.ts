export interface BattleResult {
  problem: string;
  solution_1: string;
  solution_2: string;
  judge: {
    solution_1_score: number;
    solution_2_score: number;
    solution_1_reasoning: string;
    solution_2_reasoning: string;
  };
}

export const API_BASE_URL = 'http://localhost:3000';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    return false;
  }
}

export async function runBackendBattle(problem: string): Promise<BattleResult> {
  const response = await fetch(`${API_BASE_URL}/api/battle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ problem }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data;
}
