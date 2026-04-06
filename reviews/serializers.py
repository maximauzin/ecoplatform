from rest_framework import serializers

from accounts.serializers import UserShortSerializer
from reviews.models import Complaint, Review


class ReviewSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'rating', 'text', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError(
                'Оценка должна быть от 1 до 5.'
            )
        return value


class ComplaintSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = ('id', 'reason', 'comment', 'status', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')
