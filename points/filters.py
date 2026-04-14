import math

from django_filters import rest_framework as filters

from points.models import RecyclePoint


def haversine_distance(lat1, lng1, lat2, lng2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class RecyclePointFilter(filters.FilterSet):
    categories = filters.CharFilter(method='filter_categories')
    min_rating = filters.NumberFilter(field_name='average_rating', lookup_expr='gte')
    lat = filters.NumberFilter(method='filter_geo')
    lng = filters.NumberFilter(method='filter_geo')
    radius = filters.NumberFilter(method='filter_geo')

    class Meta:
        model = RecyclePoint
        fields = ['categories', 'min_rating', 'lat', 'lng', 'radius']

    def filter_categories(self, queryset, name, value):
        ids = [int(i) for i in value.split(',') if i.strip().isdigit()]
        if ids:
            queryset = queryset.filter(waste_categories__id__in=ids).distinct()
        return queryset

    def filter_geo(self, queryset, name, value):
        params = self.data
        try:
            lat = float(params.get('lat'))
            lng = float(params.get('lng'))
            radius = float(params.get('radius', 5))
        except (TypeError, ValueError):
            return queryset

        ids = [
            p.pk for p in queryset
            if p.latitude and p.longitude
            and haversine_distance(lat, lng, float(p.latitude), float(p.longitude)) <= radius
        ]
        return queryset.filter(pk__in=ids)
