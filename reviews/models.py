from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    point = models.ForeignKey(
        'points.RecyclePoint',
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    text = models.TextField(blank=True, max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        unique_together = ('user', 'point')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} — {self.point.name}: {self.rating}'


class Complaint(models.Model):

    class Reason(models.TextChoices):
        CLOSED = 'closed', 'Пункт закрыт'
        WRONG_ADDRESS = 'wrong_address', 'Неверный адрес'
        WRONG_INFO = 'wrong_info', 'Неверная информация'
        FRAUD = 'fraud', 'Мошенничество'
        OTHER = 'other', 'Другое'

    class Status(models.TextChoices):
        PENDING = 'pending', 'На рассмотрении'
        REVIEWED = 'reviewed', 'Рассмотрена'
        RESOLVED = 'resolved', 'Решена'
        REJECTED = 'rejected', 'Отклонена'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='complaints',
    )
    point = models.ForeignKey(
        'points.RecyclePoint',
        on_delete=models.CASCADE,
        related_name='complaints',
    )
    reason = models.CharField(max_length=20, choices=Reason.choices)
    comment = models.TextField(blank=True, max_length=1000)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Жалоба'
        verbose_name_plural = 'Жалобы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} — {self.point.name}: {self.get_reason_display()}'
