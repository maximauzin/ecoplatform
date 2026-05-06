from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Create test users, waste categories, and recycling points'

    def handle(self, *args, **kwargs):
        from waste_catalog.models import WasteCategory
        from points.models import RecyclePoint

        # --- Waste categories ---
        categories_data = [
            {'name': 'Бумага', 'slug': 'bumaga', 'icon': '📄', 'order': 1,
             'what_accepted': 'Газеты, картон, офисная бумага, журналы'},
            {'name': 'Пластик', 'slug': 'plastik', 'icon': '♻️', 'order': 2,
             'what_accepted': 'ПЭТ-бутылки, пластиковые контейнеры (маркировка 1, 2, 5)'},
            {'name': 'Стекло', 'slug': 'steklo', 'icon': '🍶', 'order': 3,
             'what_accepted': 'Стеклянные бутылки, банки, флаконы'},
            {'name': 'Металл', 'slug': 'metall', 'icon': '🔩', 'order': 4,
             'what_accepted': 'Алюминиевые банки, жестяные консервы, металлолом'},
        ]
        categories = {}
        for cd in categories_data:
            cat, created = WasteCategory.objects.get_or_create(
                slug=cd['slug'],
                defaults={
                    'name': cd['name'],
                    'icon': cd['icon'],
                    'order': cd['order'],
                    'what_accepted': cd['what_accepted'],
                }
            )
            categories[cd['slug']] = cat
            status = 'создана' if created else 'уже существует'
            self.stdout.write(f'  Категория "{cat.name}" — {status}')

        # --- Owner user ---
        owner, created = User.objects.get_or_create(
            email='owner@ecoplatform.ru',
            defaults={
                'username': 'eco_owner',
                'role': User.Role.OWNER,
            }
        )
        if created:
            owner.set_password('EcoOwner123!')
            owner.save()
            self.stdout.write(self.style.SUCCESS('  Владелец создан: owner@ecoplatform.ru / EcoOwner123!'))
        else:
            self.stdout.write('  Владелец уже существует: owner@ecoplatform.ru')

        # --- Regular user ---
        user, created = User.objects.get_or_create(
            email='user@ecoplatform.ru',
            defaults={
                'username': 'eco_user',
                'role': User.Role.USER,
            }
        )
        if created:
            user.set_password('EcoUser123!')
            user.save()
            self.stdout.write(self.style.SUCCESS('  Пользователь создан: user@ecoplatform.ru / EcoUser123!'))
        else:
            self.stdout.write('  Пользователь уже существует: user@ecoplatform.ru')

        # --- Test recycling points (Yekaterinburg) ---
        points_data = [
            {
                'name': 'Пункт умной переработки',
                'address': 'Екатеринбург, ул. Ленина, 24',
                'latitude': '56.838517',
                'longitude': '60.607178',
                'schedule': 'Пн–Вс: 10:00–20:00',
                'description': 'Принимаем бумагу, пластик и стекло. Приносите чистое сырьё.',
                'categories': ['bumaga', 'plastik', 'steklo'],
            },
            {
                'name': 'Ярмарка вторсырья «Полочки»',
                'address': 'Екатеринбург, пр-кт Ленина, 101',
                'latitude': '56.845234',
                'longitude': '60.623421',
                'schedule': 'Пн–Пт: 09:00–18:00',
                'description': 'Макулатура и картон. Вывозим крупные партии.',
                'categories': ['bumaga'],
            },
            {
                'name': 'Эко-центр «Зелёный»',
                'address': 'Екатеринбург, ул. Малышева, 51',
                'latitude': '56.832100',
                'longitude': '60.614000',
                'schedule': 'Пн–Вс: 08:00–22:00',
                'description': 'Пластик всех видов, металлолом. Консультируем по подготовке.',
                'categories': ['plastik', 'metall'],
            },
            {
                'name': 'Пункт приёма стеклотары',
                'address': 'Екатеринбург, ул. Белинского, 83',
                'latitude': '56.821500',
                'longitude': '60.618000',
                'schedule': 'Пн–Сб: 10:00–19:00',
                'description': 'Стеклянные бутылки и банки. Принимаем целую и битую тару.',
                'categories': ['steklo'],
            },
            {
                'name': 'Сбор макулатуры в помощь животным',
                'address': 'Екатеринбург, пл. 1905 года, 1',
                'latitude': '56.836000',
                'longitude': '60.612000',
                'schedule': 'Пн–Вс: 12:00–17:00',
                'description': 'Вся выручка от сдачи макулатуры идёт приюту для бездомных животных.',
                'categories': ['bumaga'],
            },
        ]

        for pd in points_data:
            if RecyclePoint.objects.filter(name=pd['name']).exists():
                self.stdout.write(f'  Точка "{pd["name"]}" — уже существует')
                continue
            cats = [categories[slug] for slug in pd['categories'] if slug in categories]
            point = RecyclePoint.objects.create(
                owner=owner,
                name=pd['name'],
                address=pd['address'],
                latitude=pd['latitude'],
                longitude=pd['longitude'],
                schedule=pd['schedule'],
                description=pd['description'],
            )
            point.waste_categories.set(cats)
            self.stdout.write(self.style.SUCCESS(f'  Точка "{point.name}" — создана'))

        self.stdout.write(self.style.SUCCESS('\n✅ Тестовые данные созданы!'))
        self.stdout.write('   Владелец:      owner@ecoplatform.ru  /  EcoOwner123!')
        self.stdout.write('   Пользователь:  user@ecoplatform.ru   /  EcoUser123!')
