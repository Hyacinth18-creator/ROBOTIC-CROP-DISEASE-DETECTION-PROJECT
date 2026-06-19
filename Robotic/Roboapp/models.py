from django.db import models
from django.contrib.auth.models import User

# =====================================================================
# 1. ROBOT & FIELD SCAN TELEMETRY (Disease Detection & Analytics Pages)
# =====================================================================

class Robot(models.Model):
    """Tracks physical or simulated autonomous robots deployed in fields."""
    STATUS_CHOICES = [
        ('ACTIVE', 'Scanning & Operating'),
        ('IDLE', 'Idle / Charging'),
        ('OFFLINE', 'Offline / Maintenance'),
    ]
    robot_id = models.CharField(max_length=50, unique=True)
    model_version = models.CharField(max_length=50, default="v1.0")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    last_ping = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Robot {self.robot_id} [{self.status}]"


class CropImageScan(models.Model):
    """Stores field scan imagery, GPS telemetry, and links them to the dashboard user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans')
    robot = models.ForeignKey(Robot, on_delete=models.SET_NULL, null=True, blank=True)
    image_url = models.URLField(max_length=500)  # Stores link to Supabase cloud storage bucket
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    captured_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Scan #{self.id} (User: {self.user.username})"


class DiseaseDiagnosis(models.Model):
    """Stores AI inference metrics used by your Analytics graphics and progress bars."""
    scan = models.OneToOneField(CropImageScan, on_delete=models.CASCADE, related_name='diagnosis')
    disease_detected = models.CharField(max_length=100)  # e.g., 'Healthy', 'Powdery Mildew', 'Leaf Blight'
    confidence_score = models.FloatField()  # Value between 0.0 and 1.0 (e.g., 0.945 for 94.5%)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diagnosis: {self.disease_detected} ({self.confidence_score * 100:.1f}%)"


# =====================================================================
# 2. TREATMENT HISTORY & AUTOMATED REPORTS
# =====================================================================

class TreatmentLog(models.Model):
    """Provides entries for the Treatment History table and Reports system."""
    STATUS_CHOICES = [
        ('PENDING', 'Pending Action'),
        ('ONGOING', 'In Progress / Applied'),
        ('RESOLVED', 'Resolved / Healthy'),
    ]
    diagnosis = models.ForeignKey(DiseaseDiagnosis, on_delete=models.CASCADE, related_name='treatments')
    prescribed_treatment = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Treatment for {self.diagnosis.disease_detected} -> Status: {self.status}"


# =====================================================================
# 3. ENVIRONMENTAL FARM SIMULATION
# =====================================================================

class FarmSimulation(models.Model):
    """Tracks environmental simulation experiments run on your Simulation page."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='simulations')
    simulation_name = models.CharField(max_length=100, default="Simulation Run")
    temperature = models.FloatField()  # Controlled test variable (°C)
    humidity = models.FloatField()     # Controlled test variable (%)
    simulated_risk_level = models.CharField(max_length=50)  # Calculated risk output: High, Med, Low
    executed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sim: {self.simulation_name} ({self.simulated_risk_level} Outbreak Risk)"


# =====================================================================
# 4. CREATIVE AI CHATBOT WITH MESSAGE PERSISTENCE
# =====================================================================

class ChatSession(models.Model):
    """Groups message sequences into distinct expandable conversation threads."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=200, default="New Crop Inquiry")
    created_at = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return f"Thread: {self.title} ({self.user.username})"


class ChatMessage(models.Model):
    """Individual dynamic message units within an AI session window."""
    SENDER_CHOICES = [
        ('USER', 'Farmer / App User'),
        ('AI_BOT', 'Crop AI Assistant'),
        ('ROBOT_SYS', 'Autonomous Robot Broadcast'),  # Allows robot telemetry to fire directly into your chat!
    ]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender_type = models.CharField(max_length=20, choices=SENDER_CHOICES, default='USER')
    message_content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    # Feedback tracking loop for UI interactive icons (thumbs up / thumbs down)
    has_positive_feedback = models.BooleanField(null=True, blank=True)
    
    # Context attachment element 
    contextual_scan_link = models.ForeignKey(
        CropImageScan, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Attaches a specific crop scan directly into the chat thread context."
    )

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.sender_type}] Message in Session {self.session.id} at {self.timestamp.strftime('%H:%M')}"