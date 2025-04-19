import { NextRequest, NextResponse } from 'next/server';
import {axiosClient} from '@/helpers/call-apis';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await axiosClient.post(`/v1/api/access/login`, body);
        console.log("response", response)
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}
