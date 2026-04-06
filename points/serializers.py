from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from accounts.serializers import UserShortSerializer
from points.models import Price, RecyclePoint
from waste_catalog.serializers import WasteCategoryListSerializer


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
    distance = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = RecyclePoint
        fields = (
            'id', 'name', 'address', 'location',
            'average_rating', 'reviews_count',
            'waste_categories', 'distance',
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
            'id', 'name', 'address', 'location',
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
        queryset=__import__('waste_catalog.models', fromlist=['WasteCategory']).WasteCategory.objects.all(),
    )

    class Meta:
        model = RecyclePoint
        fields = (
            'id', 'name', 'address', 'location',
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
