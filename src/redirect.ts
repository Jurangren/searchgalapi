const FRONTEND_URL = 'https://www.searchgal.top';

const ALLOWED_HOST_SUFFIXES = [
  '.workers.dev',
  '.vercel.app',
  '.netlify.app',
];

const ALLOWED_HOSTS_EXACT = new Set([
  'localhost',
  '127.0.0.1',
]);

function isAllowedHost(host: string): boolean {
  const hostname = host.replace(/:\d+$/, '').toLowerCase();
  if (ALLOWED_HOSTS_EXACT.has(hostname)) return true;
  return ALLOWED_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix));
}

export function buildRedirectResponse(origin: string): Response {
  if (isAllowedHost(new URL(origin).hostname)) {
    return Response.redirect(`${FRONTEND_URL}?api=${encodeURIComponent(origin)}`, 302);
  }
  return Response.redirect(FRONTEND_URL, 302);
}
