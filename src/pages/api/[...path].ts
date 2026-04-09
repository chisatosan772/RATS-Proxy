import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  // Modify the URL to point to your backend API
  url.hostname = 'api.ratsstore.my.id';
  url.protocol = 'https:';
  url.port = '443';

  // Create new headers, omitting host to let fetch handle it or explicitly setting it
  const headers = new Headers(request.headers);
  headers.set('host', 'api.ratsstore.my.id');

  // We need to pass the body for POST/PUT/PATCH requests
  const init: RequestInit = {
    method: request.method,
    headers: headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // Only set body for methods that allow it
    // Some environments need duplex: 'half' for streams
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
    console.error('Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
};
