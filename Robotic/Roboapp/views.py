from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout

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

def robotic_operations(request):
    return render(request, 'dashboard/robotic-operations.html')

def treatment_missions(request):
    return render(request, 'dashboard/treatment-missions.html')

def experiments(request):
    return render(request, 'dashboard/experiments.html')

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
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        # Check if the user exists
        if user is not None:
            # login(request, user)
            login(request, user)
            messages.success(request, "You are now logged in!")
            # Admin
            if user.is_superuser:
                return redirect('/appointment')

            # For Normal Users
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid login credentials")

    return render(request, 'auth/login.html')

def register(request):
    """ Show the registration form """
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        # Check the password
        if password == confirm_password:
            
            if User.objects.filter(username=username).exists():
                   # Display a message if the above fails
                  messages.error(request, "Username already exist")
            
            else:
                user = User.objects.create_user(username=username, password=password)
                user.save()

                # Display a message
                messages.success(request, "Account created successfully")
                return redirect('/login/')
            
    
        else:
            # Display a message saying passwords don't match
            messages.error(request, "Passwords do not match")

    return render(request, 'auth/register.html')

def logout_user(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('login')
