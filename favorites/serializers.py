from rest_framework import serializers

from favorites.models import Favorite
from points.serializers import RecyclePointListSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    point_detail = RecyclePointListSerializer(source='point', read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'point', 'point_detail', 'created_at')
        read_only_fields = ('id', 'created_at')
