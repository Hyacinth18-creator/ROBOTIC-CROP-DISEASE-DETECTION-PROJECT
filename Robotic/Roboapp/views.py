from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Create your views here.
def index(request):
    return render(request, 'index.html')

def analytics(request):
    return render(request, 'dashboard/analytics.html')

def dashboard(request):
    return render(request, 'dashboard/dashboard.html') 

def diseasedetection(request):
    return render(request, 'dashboard/diseasedetection.html')

def farmsimulation(request):
    return render(request, 'dashboard/farmsimulation.html')

def profile(request):
    return render(request, 'dashboard/profile.html')

def reports(request):
    return render(request, 'dashboard/reports.html')

def settings(request):
    return render(request, 'dashboard/settings.html')

def treatmenthistory(request):
    return render(request, 'dashboard/treatmenthistory.html')

def forgot_password(request):
    return render(request, 'auth/forgot-password.html')

def login_user(request):
    if request.method == "POST":
        # Using .get() prevents MultiValueDictKeyError if fields are missing
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "You are now logged in!")
            
            # FIX: Sent superuser to the main dashboard instead of non-existent /appointment
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid login credentials")

    return render(request, 'auth/login.html')

def register(request):
    """ Handles account creation processing """
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # 1. Validate password match
        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return render(request, 'auth/register.html')
            
        # 2. Validate user uniqueness
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return render(request, 'auth/register.html')
            
        # 3. Securely build and save user profile
        user = User.objects.create_user(username=username, password=password)
        user.save()

        messages.success(request, "Account created successfully! Please log in.")
        # FIX: Explicitly target the named URL route pattern
        return redirect('login')
            
    return render(request, 'auth/register.html')

def logout_user(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('login')