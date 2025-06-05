import {axiosApisGo} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');

        const payload = await req.json(); 

        const response = await axiosApisGo.post(`/v1/2024/chat-with-employee/join-session`, payload, {
            headers: {
                'x-client-id': shopId,
                'authorization': `Bearer ${accessToken}`,
            }
        });
        console.log("response", response)
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to join session";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}