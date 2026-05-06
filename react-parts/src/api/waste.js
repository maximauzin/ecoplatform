import client from './client';

export async function getCategories() {
    const { data } = await client.get('/waste/');
    return data;
}

export async function recognizeWaste(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await client.post('/waste/recognize/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}
