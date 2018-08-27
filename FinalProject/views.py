from django.shortcuts import *
import django.contrib.auth as auth
from django.contrib.auth.models import User
from django.http import *

app_name = "main"

def home(request):
    return render(request, 'main/home.html')


def login_test(request):
    next = request.GET.get('next', '')

    if request.method == "GET":
        return render(request, "main/developer_tests.html", {'redirect_to': next})

def login(request):
    next = request.GET.get('next', '')

    if request.method == "GET":
        return render(request, "main/login.html", {'redirect_to': next})

    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']

        try:
            user = User.objects.get(email=email)

            if user is not None:
                user = auth.authenticate(username=user.username, password=password)

                if user is not None and user.is_active:
                    auth.login(request, user)
                    return HttpResponse("True")

                return HttpResponse(status=404, content="False")
            else:
                return HttpResponse(status=404, content="False")
                # return HttpResponseRedirect('/accounts/login')
        except User.DoesNotExist:
            return HttpResponse(status=404, content="False")
        except:
            return HttpResponse(status=500, content="Server Error")


def logout(request):

    try:
        auth.logout(request)
    except:
        return HttpResponse(status=404, content="Fail")

    return HttpResponse("Success")

def signup(request):
    return render(request, "main/signup.html")