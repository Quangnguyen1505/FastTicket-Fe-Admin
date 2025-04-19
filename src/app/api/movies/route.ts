import {axiosClient} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const limit = searchParams.get('limit') || '100';
        const page = searchParams.get('page') || '1';
        const movie_status = searchParams.get('movie_status') || 'now-showing';

        const response = await axiosClient.get(`/v1/api/movies`, {
            params: {
                limit,
                page,
                movie_status
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
        const shopId = req.headers.get('x-client-id');
        const accessToken = req.headers.get('authorization');

        const formData = await req.formData(); 

        const response = await axiosClient.post(`/v1/api/movies`, formData, {
            headers: {
                'x-client-id': shopId,
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': req.headers.get('Content-Type') || 'multipart/form-data'
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