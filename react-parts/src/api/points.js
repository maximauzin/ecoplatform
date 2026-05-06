import client from './client';

export async function getPoints(params = {}) {
    const { data } = await client.get('/points/', { params });
    return data.results || data;
}

export async function getPoint(id) {
    const { data } = await client.get(`/points/${id}/`);
    return data;
}

export async function createPoint(formData) {
    const { data } = await client.post('/points/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}

export async function updatePoint(id, formData) {
    const { data } = await client.patch(`/points/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}

export async function deletePoint(id) {
    await client.delete(`/points/${id}/`);
}

export async function suggestAddress(query) {
    const { data } = await client.get('/points/suggest-address/', { params: { query } });
    return data;
}
