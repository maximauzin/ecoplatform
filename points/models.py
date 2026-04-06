from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.core.validators import MinValueValidator
from django.db import models

from waste_catalog.models import WasteCategory, WasteSubcategory


class RecyclePoint(gis_models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_points',
    )
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=500)
    location = gis_models.PointField(srid=4326)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    schedule = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True, max_length=2000)
    photo = models.ImageField(upload_to='points/', null=True, blank=True)
    waste_categories = models.ManyToManyField(
        WasteCategory,
        through='PointWasteCategory',
        related_name='points',
    )
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0,
    )
    reviews_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Пункт приёма'
        verbose_name_plural = 'Пункты приёма'
        indexes = [
            models.Index(fields=['-average_rating']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name


class PointWasteCategory(models.Model):
    point = models.ForeignKey(RecyclePoint, on_delete=models.CASCADE)
    category = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Категория пункта'
        verbose_name_plural = 'Категории пунктов'
        unique_together = ('point', 'category')

    def __str__(self):
        return f'{self.point.name} — {self.category.name}'


class Price(models.Model):
    point = models.ForeignKey(
        RecyclePoint,
        on_delete=models.CASCADE,
        related_name='prices',
    )
    category = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(
        WasteSubcategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    price_per_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    comment = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Цена приёма'
        verbose_name_plural = 'Цены приёма'

    def __str__(self):
        return f'{self.point.name} — {self.category.name}: {self.price_per_kg} руб/кг'
