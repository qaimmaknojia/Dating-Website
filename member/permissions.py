from rest_framework import permissions

# Not used right now. Maybe in future
class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        print "permissions: " + str(str(obj.sender_user.id) == str(request.user.id))
        print str(obj.sender_user.id)
        print request.user.id
        return str(obj.sender_user.id) == str(request.user.id)
