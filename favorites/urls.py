from django.urls import path

from favorites.views import FavoriteDestroyView, FavoriteListCreateView

app_name = 'favorites'

urlpatterns = [
    path('', FavoriteListCreateView.as_view(), name='list-create'),
    path('<int:pk>/', FavoriteDestroyView.as_view(), name='destroy'),
]
