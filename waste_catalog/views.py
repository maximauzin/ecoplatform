import base64

import requests
from django.conf import settings
from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from waste_catalog.models import WasteCategory
from waste_catalog.serializers import (
    WasteCategoryDetailSerializer,
    WasteCategoryListSerializer,
)

LABEL_MAP = {
    'Бумага': ['paper', 'cardboard', 'newspaper', 'book', 'box', 'carton', 'magazine', 'journal'],
    'Пластик': ['plastic', 'bottle', 'container', 'packaging', 'bag', 'cup', 'polymer', 'polythene'],
    'Стекло': ['glass', 'jar', 'window', 'mirror', 'glassware', 'crystal'],
    'Металл': ['metal', 'can', 'aluminum', 'tin', 'steel', 'iron', 'copper', 'bronze'],
}


class WasteCategoryListView(generics.ListAPIView):
    serializer_class = WasteCategoryListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return WasteCategory.objects.annotate(
            subcategories_count=Count('subcategories'),
        ).order_by('order', 'name')


class WasteCategoryDetailView(generics.RetrieveAPIView):
    serializer_class = WasteCategoryDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return WasteCategory.objects.prefetch_related(
            'subcategories',
        ).annotate(
            points_count=Count('points', distinct=True),
        )


class RecognizeWasteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'categories': [], 'error': 'No image provided'}, status=400)

        api_key = getattr(settings, 'YANDEX_VISION_API_KEY', '')
        folder_id = getattr(settings, 'YANDEX_FOLDER_ID', '')

        if not api_key or not folder_id:
            return Response({'categories': [], 'error': 'Vision API not configured'})

        try:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
            payload = {
                'folderId': folder_id,
                'analyze_specs': [{
                    'content': image_data,
                    'features': [{'type': 'LABEL_DETECTION'}],
                }],
            }
            resp = requests.post(
                'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze',
                json=payload,
                headers={'Authorization': f'Api-Key {api_key}'},
                timeout=10,
            )
            resp.raise_for_status()
            results = resp.json().get('results', [])
            labels = []
            for result in results:
                for feature in result.get('results', []):
                    for label in feature.get('labelDetection', {}).get('labels', []):
                        if label.get('confidence', 0) > 0.5:
                            labels.append(label.get('name', '').lower())

            matched = set()
            for category, keywords in LABEL_MAP.items():
                if any(kw in label for label in labels for kw in keywords):
                    matched.add(category)

            return Response({'categories': list(matched)})
        except Exception:
            return Response({'categories': []})
