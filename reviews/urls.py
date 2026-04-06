from django.urls import path

from reviews.views import ComplaintCreateView, ReviewDestroyView, ReviewListCreateView

app_name = 'reviews'

urlpatterns = [
    path(
        '<int:point_pk>/reviews/',
        ReviewListCreateView.as_view(),
        name='review-list-create',
    ),
    path(
        '<int:point_pk>/reviews/<int:pk>/',
        ReviewDestroyView.as_view(),
        name='review-destroy',
    ),
    path(
        '<int:point_pk>/complaints/',
        ComplaintCreateView.as_view(),
        name='complaint-create',
    ),
]
