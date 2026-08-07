import crypto from 'crypto';

const SECRET = process.env.ENCRYPTION_KEY || 'finsight-secure-ai-key-2026';
const KEY = crypto.scryptSync(SECRET, 'salt', 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

export function decrypt(encText: string): string {
  if (!encText) return '';
  const parts = encText.split(':');
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return encText;
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const authTag = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
