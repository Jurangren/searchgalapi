import { buildRedirectResponse } from '../src/redirect';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    const url = new URL(request.url);
    return buildRedirectResponse(url.origin);
}
