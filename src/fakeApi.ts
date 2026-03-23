const FAKE_USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Frontend Engineer" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Backend Developer" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Full Stack Developer" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "DevOps Engineer" },
  { id: 5, name: "Edward Norton", email: "edward@example.com", role: "Data Scientist" },
  { id: 6, name: "Fiona Apple", email: "fiona@example.com", role: "UI/UX Designer" },
  { id: 7, name: "George Lucas", email: "george@example.com", role: "Product Manager" },
  { id: 8, name: "Hannah Montana", email: "hannah@example.com", role: "QA Engineer" },
  { id: 9, name: "Ivan Drago", email: "ivan@example.com", role: "Security Engineer" },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", role: "Mobile Developer" },
  { id: 11, name: "Kevin Hart", email: "kevin@example.com", role: "Cloud Architect" },
  { id: 12, name: "Lisa Simpson", email: "lisa@example.com", role: "ML Engineer" },
  { id: 13, name: "Michael Scott", email: "michael@example.com", role: "Engineering Manager" },
  { id: 14, name: "Nancy Drew", email: "nancy@example.com", role: "Penetration Tester" },
  { id: 15, name: "Oscar Wilde", email: "oscar@example.com", role: "Technical Writer" },
];

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Fake API that simulates a network request with random delay.
 * Supports AbortSignal for cancellation.
 */
export async function searchUsers(
  query: string,
  signal?: AbortSignal
): Promise<User[]> {
  // Simulate random network latency (200ms - 2000ms)
  const delay = Math.random() * 1800 + 200;

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, delay);

    // If signal is aborted, reject and clear timeout
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  // Filter users by query
  const lower = query.toLowerCase();
  return FAKE_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(lower) ||
      u.email.toLowerCase().includes(lower) ||
      u.role.toLowerCase().includes(lower)
  );
}
