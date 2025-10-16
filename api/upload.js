// api/upload.js
import { put } from '@vercel/blob';

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return new Response(
      JSON.stringify({ message: 'Filename is required' }),
      { status: 400 },
    );
  }

  // `request.body` adalah file itu sendiri
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return new Response(JSON.stringify(blob), { status: 200 });
}