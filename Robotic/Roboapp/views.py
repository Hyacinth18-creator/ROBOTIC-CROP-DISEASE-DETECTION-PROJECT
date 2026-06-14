
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect,get_object_or_404

# Create your views here.
def index(request):
    return render(request, 'auth/landing/index.html')

@login_required
def dashboard(request):
    return render(request, 'auth/dashboard/dashboard.html')
@login_required
def analytics(request):
    return render(request, 'auth/dashboard/analytics.html')
@login_required
def diseasedetection(request):
    return render(request, 'auth/dashboard/diseasedetection.html')
@login_required
def farmsimulation(request):
    return render(request, 'auth/dashboard/farmsimulation.html')
@login_required
def profile(request):
    return render(request, 'auth/dashboard/profile.html')
@login_required
def reports(request):
    return render(request, 'auth/dashboard/reports.html')
@login_required
def settings(request):
    return render(request, 'auth/dashboard/settings.html')
@login_required
def treatmenthistory(request):
    return render(request, 'auth/dashboard/treatmenthistory.html')
def footer(request):
    return render(request, 'auth/footer.html')
def forgot_password(request):
    return render(request, 'auth/forgot-password.html')
def navbar(request):
    return render(request, 'auth/navbar.html')
def sidebar(request):
    return render(request, 'sidebar.html')

def register(request):
    """ Show the registration form """
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        full_name = (
            request.POST.get('full_name', '')
            or request.POST.get('fullname', '')
            or request.POST.get('name', '')
            or username
        ).strip()
        email = request.POST.get('email', '')
        phone = request.POST.get('phone', '')
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if not username:
            messages.error(request, "Username is required")
            return render(request, 'auth/register.html')

        if User.objects.filter(username__iexact=username).exists():
            messages.error(request, "That username is already taken")
            return render(request, 'auth/register.html')

        # Check the password
        if password == confirm_password:
            try:
                user = User.objects.create_user(username=username, password=password)
                if email:
                    user.email = email
                name_parts = full_name.split(maxsplit=1)
                user.first_name = name_parts[0]
                if len(name_parts) > 1:
                    user.last_name = name_parts[1]
                user.save()

                # Display a message
                messages.success(request, "Account created successfully! Please login to continue.")
                return render(request, 'auth/register.html', {
                    'auto_redirect_url': '/index/',
                    'auto_redirect_delay': 3000,
                })
            except Exception:
                # Display a message if the above fails
                messages.error(request, "Unable to create account right now")
        else:
            # Display a message saying passwords don't match
            messages.error(request, "Passwords do not match")

    return render(request, 'auth/register.html')


def login_user(request):
    if request.method == "POST":
        email = request.POST.get('email', '').strip()
        username = request.POST.get('username', '').strip()
        password = request.POST['password']

        user = None

        if email:
            matched_user = User.objects.filter(email__iexact=email).first()
            if matched_user:
                user = authenticate(request, username=matched_user.username, password=password)

        if user is None and username:
            user = authenticate(request, username=username, password=password)

        # Check if the user exists
        if user is not None:
            login(request, user)
            messages.success(request, "You are now logged in!")
            return redirect('/dashboard/')
        else:
            messages.error(request, "Invalid login credentials")

    return render(request, 'auth/login.html')