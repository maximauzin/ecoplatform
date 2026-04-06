from rest_framework import generics, permissions, status
from rest_framework.response import Response

from favorites.models import Favorite
from favorites.serializers import FavoriteSerializer


class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(
            user=self.request.user,
        ).select_related('point')

    def perform_create(self, serializer):
        point = serializer.validated_data['point']
        if Favorite.objects.filter(user=self.request.user, point=point).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': 'Уже в избранном.'})
        serializer.save(user=self.request.user)


class FavoriteDestroyView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
