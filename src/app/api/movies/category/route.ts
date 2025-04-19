import {axiosClient} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await axiosClient.get(`/v1/api/categories`);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');

        const response = await axiosClient.post(`/v1/api/categories`, body, {
            headers: {
                'x-client-id': shopId,
                'authorization': `Bearer ${accessToken}`
            }
        });
        console.log("response", response)
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}