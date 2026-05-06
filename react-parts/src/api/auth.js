import client from './client';

export async function login(email, password) {
    const { data } = await client.post('/auth/token/', { email, password });
    return data;
}

export async function register(email, username, password1, password2, role = 'user') {
    const { data } = await client.post('/accounts/register/', {
        email, username, password1, password2, role,
    });
    return data;
}
