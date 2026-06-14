
from django.urls import path
from Roboapp import views

urlpatterns = [
    path('', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('navbar/', views.navbar, name='navbar'),
    path('sidebar/', views.sidebar, name='sidebar'),
    path('footer/', views.footer, name='footer'),
    path('index/', views.index, name='index'),
    path('treatmenthistory/', views.treatmenthistory, name='treatmenthistory'),
    path('settings/', views.settings, name='settings'),
    path('reports/', views.reports, name='reports'),
    path('profile/', views.profile, name='profile'),
    path('farmsimulation/', views.farmsimulation, name='farmsimulation'),
    path('diseasedetection/', views.diseasedetection, name='diseasedetection'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('analytics/', views.analytics, name='analytics'),
    
]
