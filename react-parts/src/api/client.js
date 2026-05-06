import axios from 'axios';

const client = axios.create({
    baseURL: '/api',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

client.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    response => response,
    async error => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return client(original);
                });
            }
            original._retry = true;
            isRefreshing = true;

            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) {
                isRefreshing = false;
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post('/api/auth/token/refresh/', { refresh });
                localStorage.setItem('access_token', data.access);
                if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
                client.defaults.headers.Authorization = `Bearer ${data.access}`;
                processQueue(null, data.access);
                original.headers.Authorization = `Bearer ${data.access}`;
                return client(original);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default client;
