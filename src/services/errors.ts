export class DomainError extends Error {
  constructor(
    public readonly code: "NOT_FOUND" | "UNAUTHORIZED" | "INVALID_INPUT",
    message: string,
  ) {
    super(message)
    this.name = "DomainError"
  }
}
