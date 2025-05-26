import { NextRequest, NextResponse } from 'next/server';
import {axiosClient} from '@/helpers/call-apis';
import { cookies } from 'next/headers';

interface LoginResponse {
    metadata: {
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
        shop: {
            id: string;
            email: string;
        };
        publickey: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const response = await axiosClient.post<LoginResponse>(`/v1/api/access/login`, body);
        console.log("response", response)

        const accessToken = response.data?.metadata.tokens.accessToken;
        const userId = response.data?.metadata.shop.id;

        const cookieStore = await cookies();
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
    
        cookieStore.set('userId', userId, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
          
        return NextResponse.json(response.data, { status: response.status });
    } catch (error: unknown) {
        console.log("error", error)
        const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
        const message = err.response?.data?.message || err.message || "Failed to login";
        const status = err.response?.status || 500;

        return NextResponse.json({ error: message }, { status });
    }
}
