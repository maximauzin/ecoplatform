from django.contrib import admin

from waste_catalog.models import WasteCategory, WasteSubcategory


class WasteSubcategoryInline(admin.TabularInline):
    model = WasteSubcategory
    extra = 1


@admin.register(WasteCategory)
class WasteCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    inlines = [WasteSubcategoryInline]


@admin.register(WasteSubcategory)
class WasteSubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'marking')
    list_filter = ('category',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'marking')
