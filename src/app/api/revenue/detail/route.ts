import { NextRequest, NextResponse } from 'next/server';
import { axiosClient } from '@/helpers/call-apis';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const shopId = req.headers.get('x-client-id');
    const accessToken = req.headers.get('authorization');
    const response = await axiosClient.get('/v1/api/revenue/detail', {
      headers: {
        'x-client-id': shopId,
        'authorization': `Bearer ${accessToken}`
      },
      params: {
        type: searchParams.get('type'),
        id: searchParams.get('id'),
        from: searchParams.get('from'),
        to: searchParams.get('to'),
        groupBy: searchParams.get('groupBy')
      }
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to fetch detail revenue";
    const status = err.response?.status || 500;

    return NextResponse.json({ error: message }, { status });
  }
}