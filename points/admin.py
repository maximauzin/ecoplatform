from django.contrib import admin

from points.models import PointWasteCategory, Price, RecyclePoint


class PointWasteCategoryInline(admin.TabularInline):
    model = PointWasteCategory
    extra = 1


class PriceInline(admin.TabularInline):
    model = Price
    extra = 1


@admin.register(RecyclePoint)
class RecyclePointAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'address', 'owner', 'average_rating',
        'reviews_count', 'is_active', 'updated_at',
    )
    list_filter = ('is_active', 'waste_categories')
    search_fields = ('name', 'address')
    readonly_fields = ('average_rating', 'reviews_count', 'created_at', 'updated_at')
    inlines = [PointWasteCategoryInline, PriceInline]


@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ('point', 'category', 'subcategory', 'price_per_kg', 'updated_at')
    list_filter = ('category',)
    search_fields = ('point__name',)
