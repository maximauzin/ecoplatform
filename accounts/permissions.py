from rest_framework import permissions


class IsOwnerRole(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role == 'owner'
        )


class IsPointOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or request.user.is_staff
