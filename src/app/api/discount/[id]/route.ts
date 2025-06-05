import {axiosClient} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    req: NextRequest, 
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');

        const payload = await req.json();

        if (!shopId) {
            return NextResponse.json({ error: "Missing shopId in headers" }, { status: 400 });
        }
        const response = await axiosClient.put(`/v1/api/discount/${id}`, payload, {
            headers: {
              'x-client-id': shopId,
              'authorization': `Bearer ${accessToken}`
            }
        });
        console.log("response", response)
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(
    req: NextRequest, 
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');
        if (!shopId) {
            return NextResponse.json({ error: "Missing shopId in headers" }, { status: 400 });
        }
        const response = await axiosClient.delete(`/v1/api/discount/${id}`, {
            headers: {
              'x-client-id': shopId,
              'authorization': `Bearer ${accessToken}`
            }
        });
        console.log("response", response)
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}