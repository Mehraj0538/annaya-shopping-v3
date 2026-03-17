import { handleAuth } from '@auth0/nextjs-auth0';

const handler = handleAuth();

export async function GET(request: Request, props: { params: Promise<{ auth0: string }> }) {
  return handler(request, { params: await props.params } as any);
}
