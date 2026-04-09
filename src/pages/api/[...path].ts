import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  url.hostname = 'api.ratsstore.my.id';
  url.protocol = 'https:';
  url.port = '443';

  const headers = new Headers(request.headers);
  headers.set('host', 'api.ratsstore.my.id');

  const init: RequestInit = {
    method: request.method,
    headers: headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
    // @ts-ignore
    init.duplex = 'half';
  }

  try {
    const response = await fetch(url.toString(), init);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
};
