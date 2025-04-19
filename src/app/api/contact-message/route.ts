import {axiosApisGo} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const limit = searchParams.get('limit') || '50';
        const page = searchParams.get('page') || '1';
        const status = searchParams.get('status') || 0;

        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');

        const response = await axiosApisGo.get(`/v1/2024/contact-messages`, {
            params: {
                limit,
                page,
                status
            },
            headers: {
                'x-client-id': shopId,
                'authorization': `Bearer ${accessToken}`,
            }
        });

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

        const response = await axiosApisGo.post(`/v1/2024/contact-messages`, body);
        console.log("response", response)
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}