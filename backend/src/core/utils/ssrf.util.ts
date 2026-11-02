import net from 'net';

/**
 * Validates that an outbound URL does not target local, loopback, private, or cloud metadata endpoints.
 * Prevents Server-Side Request Forgery (SSRF) - OWASP A10:2021.
 */
export function isSafeOutboundUrl(urlStr: string, allowHttpInDev = false): { safe: boolean; reason?: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return { safe: false, reason: 'Invalid URL format' };
  }

  // 1. Protocol validation
  if (parsed.protocol !== 'https:' && (!allowHttpInDev || parsed.protocol !== 'http:')) {
    return { safe: false, reason: 'Only secure HTTPS protocols are permitted' };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // 2. Reject localhost & loopback names
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname === '0.0.0.0' ||
    hostname === '::'
  ) {
    return { safe: false, reason: 'Targeting localhost or internal network domains is strictly forbidden' };
  }

  // 3. IP Address range checks
  const ipType = net.isIP(hostname);
  if (ipType === 4) {
    const parts = hostname.split('.').map(Number);
    const [p0, p1] = parts;

    // Loopback: 127.0.0.0/8
    if (p0 === 127) return { safe: false, reason: 'Loopback IPv4 addresses are forbidden' };

    // Zero-conf / metadata: 169.254.0.0/16 (AWS / GCP / Azure metadata endpoint: 169.254.169.254)
    if (p0 === 169 && p1 === 254) return { safe: false, reason: 'Cloud instance metadata service (169.254.x.x) is blocked' };

    // RFC 1918 Private ranges:
    // 10.0.0.0/8
    if (p0 === 10) return { safe: false, reason: 'Private network (10.x.x.x) access is forbidden' };
    // 172.16.0.0/12 (172.16 - 172.31)
    if (p0 === 172 && p1 !== undefined && p1 >= 16 && p1 <= 31) {
      return { safe: false, reason: 'Private network (172.16.x.x - 172.31.x.x) access is forbidden' };
    }
    // 192.168.0.0/16
    if (p0 === 192 && p1 === 168) return { safe: false, reason: 'Private network (192.168.x.x) access is forbidden' };

    // Current network (0.0.0.0/8)
    if (p0 === 0) return { safe: false, reason: 'Current network 0.0.0.0/8 is forbidden' };
  } else if (ipType === 6) {
    // IPv6 Loopback ::1, Unique Local fc00::/7, Link-Local fe80::/10
    if (hostname === '::1' || hostname.startsWith('fe80:') || hostname.startsWith('fc00:') || hostname.startsWith('fd')) {
      return { safe: false, reason: 'Private or loopback IPv6 addresses are forbidden' };
    }
  }

  return { safe: true };
}

