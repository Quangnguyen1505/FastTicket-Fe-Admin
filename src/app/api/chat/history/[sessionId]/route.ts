 import {axiosApisGo} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ sessionId: string }> }
) {
    try {
        const sessionId = (await params).sessionId;
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');
        
        console.log("sessionId", sessionId)
        const response = await axiosApisGo.get(`/v1/2024/chat-with-employee/history/${sessionId}`, {
            headers: {
                'x-client-id': shopId || '',
                'authorization': `Bearer ${accessToken || ''}`
            }
        }); 
        console.log("response", response)
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to fetch chat history";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}