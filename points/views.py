from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from rest_framework import permissions, status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from accounts.permissions import IsOwnerRole, IsPointOwner
from points.filters import RecyclePointFilter
from points.models import Price, RecyclePoint
from points.serializers import (
    PriceSerializer,
    RecyclePointCreateSerializer,
    RecyclePointDetailSerializer,
    RecyclePointListSerializer,
)


class PointMapPagination(PageNumberPagination):
    page_size = 50
    max_page_size = 200


class RecyclePointViewSet(viewsets.ModelViewSet):
    filterset_class = RecyclePointFilter
    search_fields = ['name', 'address']
    ordering_fields = ['average_rating', 'reviews_count', 'created_at']
    pagination_class = PointMapPagination

    def get_queryset(self):
        qs = RecyclePoint.objects.filter(is_active=True).select_related(
            'owner',
        ).prefetch_related('waste_categories', 'prices')

        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius')

        if lat and lng:
            try:
                user_location = Point(float(lng), float(lat), srid=4326)
            except (ValueError, TypeError):
                return qs

            if radius:
                try:
                    qs = qs.filter(
                        location__dwithin=(user_location, D(m=int(radius)))
                    )
                except (ValueError, TypeError):
                    pass

            qs = qs.annotate(
                distance=Distance('location', user_location)
            ).order_by('distance')

        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return RecyclePointListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return RecyclePointCreateSerializer
        return RecyclePointDetailSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsOwnerRole()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsPointOwner()]
        return [permissions.AllowAny()]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])


class PriceViewSet(viewsets.ModelViewSet):
    serializer_class = PriceSerializer

    def get_queryset(self):
        return Price.objects.filter(
            point_id=self.kwargs['point_pk'],
        ).select_related('category', 'subcategory')

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwnerRole()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        point = RecyclePoint.objects.get(pk=self.kwargs['point_pk'])
        if point.owner != self.request.user and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()
        serializer.save(point=point)
