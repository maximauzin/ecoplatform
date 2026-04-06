from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        USER = 'user', 'Пользователь'
        OWNER = 'owner', 'Владелец пункта'

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER,
    )
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.email

    @property
    def is_owner(self):
        return self.role == self.Role.OWNER
