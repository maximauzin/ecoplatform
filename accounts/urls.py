from django.urls import path

from accounts.views import FrontendConfigView, ProfileView, RegisterView

app_name = 'accounts'

urlpatterns = [
    path('config/', FrontendConfigView.as_view(), name='config'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
