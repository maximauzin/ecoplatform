import client from './client';

export async function getReviews(pointId) {
    const { data } = await client.get(`/points/${pointId}/reviews/`);
    return data.results || data;
}

export async function addReview(pointId, rating, text) {
    const { data } = await client.post(`/points/${pointId}/reviews/`, { rating, text });
    return data;
}

export async function deleteReview(pointId, reviewId) {
    await client.delete(`/points/${pointId}/reviews/${reviewId}/`);
}
