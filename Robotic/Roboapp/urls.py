from django.contrib import admin
from django.urls import path
from Roboapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('index/', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('analytics/', views.analytics, name='analytics'),
    path('diseasedetection/', views.diseasedetection, name='diseasedetection'),
    path('farmsimulation/', views.farmsimulation, name='farmsimulation'),
    path('treatmenthistory/', views.treatmenthistory, name='treatmenthistory'),
    path('reports/', views.reports, name='reports'),
    path('profile/', views.profile, name='profile'),
    path('settings/', views.settings, name='settings'),
]