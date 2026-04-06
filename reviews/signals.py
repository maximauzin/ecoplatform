from django.db.models import Avg, Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from reviews.models import Review


@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_point_rating(sender, instance, **kwargs):
    point = instance.point
    agg = Review.objects.filter(point=point).aggregate(
        avg=Avg('rating'), cnt=Count('id'),
    )
    point.average_rating = agg['avg'] or 0
    point.reviews_count = agg['cnt']
    point.save(update_fields=['average_rating', 'reviews_count'])
