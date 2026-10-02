export class ConnextError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = code;
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const Errors = {
  collegeEmailRejected: () =>
    new ConnextError("CollegeEmailRejectedError", "Use your college email", 400),
  invalidOtp: () =>
    new ConnextError("InvalidOtpError", "Invalid or expired OTP", 401),
  otpExpired: () =>
    new ConnextError("OtpExpiredError", "OTP expired. Request a new one.", 401),
  unauthenticated: () =>
    new ConnextError("UnauthenticatedError", "Sign in to continue", 401),
  forbidden: (message = "Not allowed") =>
    new ConnextError("ForbiddenError", message, 403),
  notFound: (entity: string) =>
    new ConnextError(`${entity}NotFoundError`, `${entity} not found`, 404),
  postNotFound: () =>
    new ConnextError("PostNotFoundError", "Post not found", 404),
  commentNotFound: () =>
    new ConnextError("CommentNotFoundError", "Comment not found", 404),
  alreadyResolved: () =>
    new ConnextError("PostAlreadyResolvedError", "Post already resolved", 409),
  alreadyAwarded: () =>
    new ConnextError("AlreadyAwardedError", "Credits already awarded for this reply", 409),
  selfConfirm: () =>
    new ConnextError("SelfConfirmError", "You cannot credit your own reply", 403),
  embeddingTimeout: () =>
    new ConnextError("EmbeddingTimeoutError", "Embedding provider timed out", 503),
  embeddingRateLimit: () =>
    new ConnextError("EmbeddingRateLimitError", "Embedding provider rate limited", 429),
  ollamaUnavailable: () =>
    new ConnextError("OllamaUnavailableError", "Local embedding provider unavailable", 503),
  embeddingDimensionMismatch: (got: number, expected: number) =>
    new ConnextError(
      "EmbeddingDimensionMismatchError",
      `Embedding dimension ${got} does not match EMBEDDING_DIMENSIONS=${expected}`,
      500,
    ),
  validation: (message: string) =>
    new ConnextError("ValidationError", message, 400),
};

export function isUniqueViolation(err: unknown): boolean {
  let current: unknown = err;
  for (let i = 0; i < 5 && current && typeof current === "object"; i++) {
    const code = (current as { code?: string }).code;
    if (code === "23505") return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}
