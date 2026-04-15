from django.urls import include, path
from rest_framework.routers import DefaultRouter

from points.views import PriceViewSet, RecyclePointViewSet

app_name = 'points'

router = DefaultRouter()
router.register(r'', RecyclePointViewSet, basename='point')

urlpatterns = [
    path(
        '<int:point_pk>/prices/',
        PriceViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='point-prices-list',
    ),
    path(
        '<int:point_pk>/prices/<int:pk>/',
        PriceViewSet.as_view({
            'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy',
        }),
        name='point-prices-detail',
    ),
    path('', include(router.urls)),
]
