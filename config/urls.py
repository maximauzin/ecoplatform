from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('allauth.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/points/', include('points.urls')),
    path('api/points/', include('reviews.urls')),
    path('api/favorites/', include('favorites.urls')),
    path('api/waste/', include('waste_catalog.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
