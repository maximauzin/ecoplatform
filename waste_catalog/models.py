from django.db import models


class WasteCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    preparation_instructions = models.TextField(blank=True)
    what_accepted = models.TextField(blank=True)
    what_not_accepted = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Категория отходов'
        verbose_name_plural = 'Категории отходов'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class WasteSubcategory(models.Model):
    category = models.ForeignKey(
        WasteCategory,
        on_delete=models.CASCADE,
        related_name='subcategories',
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    marking = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='waste/', null=True, blank=True)

    class Meta:
        verbose_name = 'Подкатегория отходов'
        verbose_name_plural = 'Подкатегории отходов'
        ordering = ['category', 'name']

    def __str__(self):
        return f'{self.category.name} — {self.name}'
