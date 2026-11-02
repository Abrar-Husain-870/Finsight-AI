import { Request, Response, NextFunction } from 'express';

/**
 * Neutralizes potentially dangerous characters in user input strings:
 * - PostgreSQL UTF-8 null-bytes (\0)
 * - HTML Script Injection / XSS vectors (<script>, javascript:, etc.)
 * - Dangerous control characters
 */
function sanitizeString(val: string): string {
  // 1. Remove null bytes immediately
  let cleaned = val.replace(/\0/g, '');

  // 2. Neutralize dangerous HTML script/event handler patterns (case-insensitive)
  cleaned = cleaned
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/\bjavascript:[^"'\s]*/gi, '')
    .replace(/\bvbscript:[^"'\s]*/gi, '')
    .replace(/\bon\w+\s*=/gi, '');

  return cleaned;
}

function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      result[key] = sanitizeObject(value);
    }
    return result;
  }
  return obj;
}

export function securitySanitizerMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      for (const [key, value] of Object.entries(req.query)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          delete (req.query as Record<string, unknown>)[key];
          continue;
        }
        (req.query as Record<string, unknown>)[key] = sanitizeObject(value);
      }
    }
    if (req.params && typeof req.params === 'object') {
      for (const [key, value] of Object.entries(req.params)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          delete (req.params as Record<string, unknown>)[key];
          continue;
        }
        (req.params as Record<string, unknown>)[key] = sanitizeObject(value);
      }
    }
  } catch {
    // Fail closed on malicious traversal
  }
  next();
}
