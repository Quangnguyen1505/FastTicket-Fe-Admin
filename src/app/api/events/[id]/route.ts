import {axiosApisGo} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest, 
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const response = await axiosApisGo.get(`/v1/2024/events/${id}`);
        console.log("response", response)
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function PUT(
    req: NextRequest, 
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');

        const formData = await req.formData(); 
        console.log(formData); 

        if (!shopId) {
            return NextResponse.json({ error: "Missing shopId in headers" }, { status: 400 });
        }
        const response = await axiosApisGo.put(`/v1/2024/events/${id}`, formData, {
            headers: {
              'x-client-id': shopId,
              'authorization': `Bearer ${accessToken}`,
              'Content-Type': req.headers.get('Content-Type') || 'multipart/form-data'
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
        const response = await axiosApisGo.delete(`/v1/2024/events/${id}`, {
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