from django.contrib import admin
from .models import (
    Robot, 
    CropImageScan, 
    DiseaseDiagnosis, 
    TreatmentLog, 
    FarmSimulation, 
    ChatSession, 
    ChatMessage
)

# Customizing admin list views for easier system monitoring
@admin.register(Robot)
class RobotAdmin(admin.ModelAdmin):
    list_display = ('robot_id', 'status', 'model_version', 'last_ping')
    list_filter = ('status',)

@admin.register(CropImageScan)
class CropImageScanAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'robot', 'captured_at', 'latitude', 'longitude')
    list_filter = ('captured_at', 'robot')

@admin.register(DiseaseDiagnosis)
class DiseaseDiagnosisAdmin(admin.ModelAdmin):
    list_display = ('id', 'disease_detected', 'confidence_score', 'created_at')
    list_filter = ('disease_detected', 'created_at')

@admin.register(TreatmentLog)
class TreatmentLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'diagnosis', 'status', 'updated_at')
    list_filter = ('status', 'updated_at')

@admin.register(FarmSimulation)
class FarmSimulationAdmin(admin.ModelAdmin):
    list_display = ('simulation_name', 'user', 'temperature', 'humidity', 'simulated_risk_level', 'executed_at')
    list_filter = ('simulated_risk_level', 'executed_at')

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'is_archived')
    list_filter = ('is_archived', 'created_at')

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'sender_type', 'timestamp', 'is_read', 'has_positive_feedback')
    list_filter = ('sender_type', 'timestamp', 'is_read')