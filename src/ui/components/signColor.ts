export function signColor(n: number): string {
  return n > 0 ? 'var(--text-success)' : n < 0 ? 'var(--text-danger)' : 'var(--text-secondary)'
}
