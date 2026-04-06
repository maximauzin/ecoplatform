from django.contrib import admin

from favorites.models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'point', 'created_at')
    search_fields = ('user__username', 'point__name')
