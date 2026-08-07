import { AxiosError } from 'axios';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public referenceId?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function mapHttpError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<unknown>;
    
    // Check if network error (no response)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return new AppError('The request timed out. Please try again.', 'TIMEOUT', 408);
      }
      return new AppError('Network error. Please check your connection.', 'NETWORK_ERROR', 0);
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data as any;
    
    // Extract standardized message and code from backend ApiErrorResponse
    const message = data?.error?.message || axiosError.message;
    const code = data?.error?.code || 'UNKNOWN_ERROR';
    const referenceId = data?.error?.requestId;

    switch (status) {
      case 400:
        return new AppError(message || 'Invalid request.', code, 400, referenceId);
      case 401:
        return new AppError(message || 'Your session has expired. Please log in again.', code, 401, referenceId);
      case 403:
        return new AppError(message || 'You do not have permission to perform this action.', code, 403, referenceId);
      case 404:
        return new AppError(message || 'The requested resource could not be found.', code, 404, referenceId);
      case 409:
        return new AppError(message || 'There was a conflict with the current state.', code, 409, referenceId);
      case 422:
        return new AppError(message || 'Validation failed. Please check your inputs.', code, 422, referenceId);
      case 429:
        return new AppError('Too many requests. Please slow down and try again later.', code, 429, referenceId);
      case 500:
        return new AppError('An unexpected server error occurred.', code, 500, referenceId);
      case 503:
        return new AppError('The service is temporarily unavailable. Please try again later.', code, 503, referenceId);
      default:
        return new AppError(message || 'An unknown error occurred.', code, status, referenceId);
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new AppError('An unexpected error occurred.', 'UNKNOWN_ERROR', 500);
}

export function emitSystemAlert(message: string, type: 'warning' | 'error' = 'error') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('finsight:system-alert', { 
      detail: { message, type } 
    }));
  }
}
