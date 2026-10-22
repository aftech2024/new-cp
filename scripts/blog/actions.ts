/**
 * Inside a GitHub Actions run, turn a log line into an annotation so it shows on
 * the run page and in the failure email, not only in the step log. Elsewhere the
 * message is returned unchanged.
 */
export function annotation(level: "error" | "warning", message: string): string {
  if (!process.env.GITHUB_ACTIONS) return message;
  return `::${level}::${message.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A")}`;
}
