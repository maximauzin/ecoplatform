from django.contrib import admin

from reviews.models import Complaint, Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'point', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'point__name', 'text')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('user', 'point', 'reason', 'status', 'created_at')
    list_filter = ('status', 'reason', 'created_at')
    search_fields = ('user__username', 'point__name', 'comment')
    readonly_fields = ('created_at',)
    actions = ['mark_reviewed', 'mark_resolved', 'mark_rejected']

    @admin.action(description='Отметить как рассмотренные')
    def mark_reviewed(self, request, queryset):
        queryset.update(status=Complaint.Status.REVIEWED)

    @admin.action(description='Отметить как решённые')
    def mark_resolved(self, request, queryset):
        queryset.update(status=Complaint.Status.RESOLVED)

    @admin.action(description='Отклонить')
    def mark_rejected(self, request, queryset):
        queryset.update(status=Complaint.Status.REJECTED)
