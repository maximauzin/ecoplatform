from django.contrib.auth import get_user_model, login
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from accounts.serializers import ProfileSerializer, RegisterSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user, backend='django.contrib.auth.backends.ModelBackend')


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
