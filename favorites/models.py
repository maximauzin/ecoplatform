from django.conf import settings
from django.db import models


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites',
    )
    point = models.ForeignKey(
        'points.RecyclePoint',
        on_delete=models.CASCADE,
        related_name='favorites',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'
        unique_together = ('user', 'point')

    def __str__(self):
        return f'{self.user.username} — {self.point.name}'
