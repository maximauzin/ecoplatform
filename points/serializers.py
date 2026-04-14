import requests
from django.conf import settings
from rest_framework import serializers

from accounts.serializers import UserShortSerializer
from points.models import Price, RecyclePoint
from waste_catalog.models import WasteCategory
from waste_catalog.serializers import WasteCategoryListSerializer


def geocode_address(address):
    api_key = getattr(settings, 'YANDEX_GEOCODER_API_KEY', '')
    if not api_key:
        return None, None
    try:
        response = requests.get(
            'https://geocode-maps.yandex.ru/1.x/',
            params={'apikey': api_key, 'geocode': address, 'format': 'json'},
            timeout=5,
        )
        response.raise_for_status()
        members = response.json()['response']['GeoObjectCollection']['featureMember']
        if not members:
            return None, None
        pos = members[0]['GeoObject']['Point']['pos']
        lng, lat = pos.split()
        return float(lat), float(lng)
    except Exception:
        return None, None


class PriceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(
        source='subcategory.name', read_only=True, default=None,
    )

    class Meta:
        model = Price
        fields = (
            'id', 'category', 'category_name',
            'subcategory', 'subcategory_name',
            'price_per_kg', 'comment', 'updated_at',
        )
        read_only_fields = ('id', 'updated_at')


class RecyclePointListSerializer(serializers.ModelSerializer):
    waste_categories = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True,
    )

    class Meta:
        model = RecyclePoint
        fields = (
            'id', 'name', 'address', 'latitude', 'longitude',
            'average_rating', 'reviews_count', 'waste_categories',
        )


class RecyclePointDetailSerializer(serializers.ModelSerializer):
    owner = UserShortSerializer(read_only=True)
    waste_categories_detail = WasteCategoryListSerializer(
        source='waste_categories', many=True, read_only=True,
    )
    prices = PriceSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = RecyclePoint
        fields = (
            'id', 'name', 'address', 'latitude', 'longitude',
            'phone', 'email', 'website', 'schedule', 'description',
            'photo', 'owner', 'waste_categories_detail', 'prices',
            'average_rating', 'reviews_count',
            'is_favorite', 'is_active',
            'created_at', 'updated_at',
        )

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False


class RecyclePointCreateSerializer(serializers.ModelSerializer):
    waste_categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=WasteCategory.objects.all(),
    )

    class Meta:
        model = RecyclePoint
        fields = (
            'id', 'name', 'address', 'latitude', 'longitude',
            'phone', 'email', 'website', 'schedule', 'description',
            'photo', 'waste_categories',
        )

    def validate_waste_categories(self, value):
        if not value:
            raise serializers.ValidationError(
                'Укажите хотя бы одну категорию отходов.'
            )
        return value

    def create(self, validated_data):
        categories = validated_data.pop('waste_categories')
        if not validated_data.get('latitude') or not validated_data.get('longitude'):
            lat, lng = geocode_address(validated_data.get('address', ''))
            if lat and lng:
                validated_data['latitude'] = lat
                validated_data['longitude'] = lng
        point = RecyclePoint.objects.create(
            owner=self.context['request'].user,
            **validated_data,
        )
        point.waste_categories.set(categories)
        return point

    def update(self, instance, validated_data):
        categories = validated_data.pop('waste_categories', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categories is not None:
            instance.waste_categories.set(categories)
        return instance
