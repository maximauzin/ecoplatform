from rest_framework import serializers

from waste_catalog.models import WasteCategory, WasteSubcategory


class WasteSubcategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = WasteSubcategory
        fields = ('id', 'name', 'slug', 'description', 'marking', 'image')


class WasteCategoryListSerializer(serializers.ModelSerializer):
    subcategories_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WasteCategory
        fields = ('id', 'name', 'slug', 'icon', 'subcategories_count')


class WasteCategoryDetailSerializer(serializers.ModelSerializer):
    subcategories = WasteSubcategorySerializer(many=True, read_only=True)
    points_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WasteCategory
        fields = (
            'id', 'name', 'slug', 'description', 'icon',
            'preparation_instructions', 'what_accepted', 'what_not_accepted',
            'subcategories', 'points_count',
        )
