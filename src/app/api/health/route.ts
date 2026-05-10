import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'recipecrave',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? 'dev',
  });
}
