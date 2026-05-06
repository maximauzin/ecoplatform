import client from './client';

export async function getFavorites() {
    const { data } = await client.get('/favorites/');
    return data.results || data;
}

export async function addFavorite(pointId) {
    const { data } = await client.post('/favorites/', { point: pointId });
    return data;
}

export async function removeFavoriteById(favoriteId) {
    await client.delete(`/favorites/${favoriteId}/`);
}

export async function toggleFavorite(pointId, isCurrentlyFavorited) {
    if (!isCurrentlyFavorited) {
        return addFavorite(pointId);
    }
    const favorites = await getFavorites();
    const fav = favorites.find(f => f.point === pointId || f.point_detail?.id === pointId);
    if (fav) {
        await removeFavoriteById(fav.id);
    }
}
