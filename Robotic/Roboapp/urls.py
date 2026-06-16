from django.urls import path
from Roboapp import views

urlpatterns = [
    # 1. Landing & Authentication Routes
    path('', views.index, name='index'),  # Changed root URL to load the index/landing page first
    path('index/', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),

    # 2. Main System Function Dashboards
    path('dashboard/', views.dashboard, name='dashboard'),
    path('analytics/', views.analytics, name='analytics'),
    path('diseasedetection/', views.diseasedetection, name='diseasedetection'),
    path('farmsimulation/', views.farmsimulation, name='farmsimulation'),
    path('treatmenthistory/', views.treatmenthistory, name='treatmenthistory'),
    path('reports/', views.reports, name='reports'),
    
    # 3. User Customization Pages
    path('profile/', views.profile, name='profile'),
    path('settings/', views.settings, name='settings'),
]