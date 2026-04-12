from django_filters import rest_framework as filters

from points.models import RecyclePoint


class RecyclePointFilter(filters.FilterSet):
    categories = filters.CharFilter(method='filter_categories')
    min_rating = filters.NumberFilter(field_name='average_rating', lookup_expr='gte')

    class Meta:
        model = RecyclePoint
        fields = ['categories', 'min_rating']

    def filter_categories(self, queryset, name, value):
        ids = [int(i) for i in value.split(',') if i.strip().isdigit()]
        if ids:
            queryset = queryset.filter(waste_categories__id__in=ids).distinct()
        return queryset
