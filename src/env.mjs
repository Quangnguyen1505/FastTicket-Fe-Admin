import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
        NEXT_PUBLIC_BACKEND_DOMAIN: z.string().min(1),
        NEXT_PUBLIC_BACKEND_DOMAIN_GO: z.string().min(1),
        NEXT_PUBLIC_IMAGE: z.string().min(1),
        NEXT_PUBLIC_HOST: z.string().min(1),
    },
    runtimeEnv: {
        NEXT_PUBLIC_APP_URL:
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        NEXT_PUBLIC_BACKEND_DOMAIN:
            process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'http://localhost:8000', 
        NEXT_PUBLIC_BACKEND_DOMAIN_GO:
            process.env.NEXT_PUBLIC_BACKEND_DOMAIN_GO || 'http://localhost:8082',
        NEXT_PUBLIC_IMAGE:
            process.env.NEXT_PUBLIC_IMAGE || '/assets/images',
        NEXT_PUBLIC_HOST: 
            process.env.NEXT_PUBLIC_HOST || "localhost"
    }
})