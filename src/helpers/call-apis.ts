import axios from 'axios';
import { env } from '@/env.mjs';

const axiosClient = axios.create({
    baseURL: env.NEXT_PUBLIC_BACKEND_DOMAIN,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosApisGo = axios.create({
    baseURL: env.NEXT_PUBLIC_BACKEND_DOMAIN_GO,
    headers: {
        'Content-Type': 'application/json',
    },
});

// export default axiosApis;
export { axiosApisGo, axiosClient };
