from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'avatar', 'date_joined')
        read_only_fields = ('id', 'email', 'role', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('email', 'username', 'password1', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password2': 'Пароли не совпадают.'}
            )
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password1'],
            role=validated_data.get('role', User.Role.USER),
        )
