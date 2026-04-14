from rest_framework import serializers

from accounts.serializers import UserShortSerializer
from points.models import Price, RecyclePoint
from waste_catalog.models import WasteCategory
from waste_catalog.serializers import WasteCategoryListSerializer

import requests
from dadata import Dadata
import os


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


    def validate_address(self, value: str): #
        if not value.strip():
            raise serializers.ValidationError(
                'Адрес не может быть пустым.'
            )
        
        token = os.getenv('DADATA_TOKEN', '7e4ec0ff8c9f927a27f737eb1f2ec3cce8c43126')
        secret = os.getenv('DADATA_SECRET', '42966660192050d0a7ddabc1c0dff75153858208')
        
        try:
            with Dadata(token, secret) as dadata:
                result = dadata.clean("address", value)
        except Exception as e:
            raise serializers.ValidationError(
                f"Ошибка при валидации адреса {value.strip()}: {str(e)}"
            )

        if not result or result['qc'] != 0:
            raise serializers.ValidationError(
                f"Адрес {value.strip()} не найден."
            )
        
        standart_address = result['result']
        coordinates = [
            result['geo_lat'], result['geo_lon']
        ]
        
        # return value.strip()
        return standart_address # Стандартизированный адресс вида 
                                # г Москва, ул Сухонская, д 11
            


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
