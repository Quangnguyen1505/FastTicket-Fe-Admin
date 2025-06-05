import { NextRequest, NextResponse } from 'next/server';
import { axiosClient } from '@/helpers/call-apis';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    console.log("params:", searchParams.get('groupBy'))
    const shopId = req.headers.get('x-client-id');
    const accessToken = req.headers.get('authorization');
    const response = await axiosClient.get('/v1/api/revenue/summary', {
      headers: {
        'x-client-id': shopId,
        'authorization': `Bearer ${accessToken}`
      },
      params: {
        from: searchParams.get('from'),
        to: searchParams.get('to'),
        groupBy: searchParams.get('groupBy')
      }
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to fetch revenue";
    const status = err.response?.status || 500;

    return NextResponse.json({ error: message }, { status });
  }
}