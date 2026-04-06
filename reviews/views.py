from rest_framework import generics, permissions, status
from rest_framework.response import Response

from reviews.models import Complaint, Review
from reviews.serializers import ComplaintSerializer, ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(
            point_id=self.kwargs['point_pk'],
        ).select_related('user')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        point_pk = self.kwargs['point_pk']
        if Review.objects.filter(user=self.request.user, point_id=point_pk).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {'detail': 'Вы уже оставляли отзыв на этот пункт.'}
            )
        serializer.save(user=self.request.user, point_id=point_pk)


class ReviewDestroyView(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(point_id=self.kwargs['point_pk'])

    def perform_destroy(self, instance):
        if instance.user != self.request.user and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()
        instance.delete()


class ComplaintCreateView(generics.CreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        point_pk = self.kwargs['point_pk']
        serializer.save(user=self.request.user, point_id=point_pk)

        closed_count = Complaint.objects.filter(
            point_id=point_pk, reason=Complaint.Reason.CLOSED,
        ).count()
        if closed_count >= 3:
            from points.models import RecyclePoint
            RecyclePoint.objects.filter(pk=point_pk).update(is_active=False)
