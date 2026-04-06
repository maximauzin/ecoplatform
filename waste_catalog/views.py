from django.db.models import Count
from rest_framework import generics, permissions

from waste_catalog.models import WasteCategory
from waste_catalog.serializers import (
    WasteCategoryDetailSerializer,
    WasteCategoryListSerializer,
)


class WasteCategoryListView(generics.ListAPIView):
    serializer_class = WasteCategoryListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return WasteCategory.objects.annotate(
            subcategories_count=Count('subcategories'),
        ).order_by('order', 'name')


class WasteCategoryDetailView(generics.RetrieveAPIView):
    serializer_class = WasteCategoryDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return WasteCategory.objects.prefetch_related(
            'subcategories',
        ).annotate(
            points_count=Count('points', distinct=True),
        )
