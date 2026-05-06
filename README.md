# Инструкция по запуску проекта

## Бэкенд (Django)

1. Перейдите в папку проекта:
   ```bash
   cd проект
   ```
2. Создайте и активируйте виртуальное окружение:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Настройте конфигурацию:
   Создайте файл `.env` на основе `.env.example` и заполните его.
5. Выполните миграции и подготовку данных:
   ```bash
   python manage.py migrate
   python manage.py create_test_data
   ```
6. Запустите сервер:
   ```bash
   python manage.py runserver
   ```

## Фронтенд (React)

1. Перейдите в папку фронтенда:
   ```bash
   cd проект/react-parts
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите проект:
   ```bash
   npm run dev
   ```
