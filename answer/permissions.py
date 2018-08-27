from rest_framework import permissions

# Not used right now. Maybe in future
class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return str(obj.user_id.id) == str(request.user.id)
