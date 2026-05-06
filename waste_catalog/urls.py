from django.urls import path

from waste_catalog.views import (
    RecognizeWasteView,
    WasteCategoryDetailView,
    WasteCategoryListView,
)

app_name = 'waste_catalog'

urlpatterns = [
    path('', WasteCategoryListView.as_view(), name='list'),
    path('recognize/', RecognizeWasteView.as_view(), name='recognize'),
    path('<slug:slug>/', WasteCategoryDetailView.as_view(), name='detail'),
]
