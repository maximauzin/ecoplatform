import client from './client';

export async function getProfile() {
    const { data } = await client.get('/accounts/profile/');
    return data;
}

export async function updateProfile(formData) {
    const { data } = await client.patch('/accounts/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}
