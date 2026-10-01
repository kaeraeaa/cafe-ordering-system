const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("cafe_token");
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Не вдалося підключитися до сервера. Переконайтеся, що Backend запущений на http://localhost:5000 і PostgreSQL працює."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const details = Array.isArray(data?.errors)
      ? data.errors.map((item) => item.message).join("; ")
      : "";
    throw new Error(data?.message || details || `Помилка сервера (${response.status})`);
  }

  return data;
}

export { API_URL };
