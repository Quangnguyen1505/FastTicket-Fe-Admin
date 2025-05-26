import {axiosClient} from '@/helpers/call-apis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        const { searchParams } = new URL(req.url);
        const show_date = searchParams.get('show_date');
        const response = await axiosClient.get(`/v1/api/showtimes/movies/${id}`, {
            params: {
                show_date: show_date?.trim()
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