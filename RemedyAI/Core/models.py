from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

# Create Profile automatically when a User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

# Ensure Profile exists for all users
def ensure_profile_exists(user_id):
    """Make sure a profile exists for the given user."""
    user = User.objects.get(pk=user_id)
    Profile.objects.get_or_create(user=user)

# Create a management command to fix missing profiles
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Ensures all users have profile records'
    
    def handle(self, *args, **kwargs):
        for user in User.objects.all():
            profile, created = Profile.objects.get_or_create(user=user)
            if created:
                self.stdout.write(f"Created profile for {user.username}")
        self.stdout.write(self.style.SUCCESS('All users now have profiles'))

class UserPreferences(models.Model):
    """Store user preferences collected during chat personalization"""
    AGE_GROUP_CHOICES = (
        ('under_18', 'Under 18'),
        ('18_35', '18-35'),
        ('36_50', '36-50'),
        ('51_plus', '51+'),
    )
    
    WELLNESS_GOAL_CHOICES = (
        ('stress_relief', 'Stress Relief'),
        ('better_sleep', 'Better Sleep'),
        ('digestive_health', 'Digestive Health'),
        ('pain_relief', 'Pain Relief'),
        ('other', 'Other'),
    )
    
    ALLERGY_CHOICES = (
        ('none', 'None'),
        ('pollen', 'Pollen'),
        ('nuts', 'Nuts'),
        ('other', 'Other'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences', null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True, null=True, help_text="For non-logged in users")
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES, null=True, blank=True)
    wellness_goal = models.CharField(max_length=20, choices=WELLNESS_GOAL_CHOICES, null=True, blank=True)
    allergies = models.CharField(max_length=20, choices=ALLERGY_CHOICES, null=True, blank=True)
    other_allergies = models.TextField(blank=True, help_text="If 'Other' is selected for allergies")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.user:
            return f"Preferences for {self.user.username}"
        else:
            return f"Guest preferences ({self.session_id[:8]})"

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_personalized = models.BooleanField(default=False, help_text="Whether this conversation uses personalized preferences")
    preferences = models.ForeignKey(UserPreferences, on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='conversations', help_text="User preferences for this conversation")
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def get_last_message(self):
        return self.messages.order_by('-timestamp').first()
    
    def get_preview(self):
        last_message = self.get_last_message()
        if last_message:
            preview = last_message.content
            if len(preview) > 100:
                preview = preview[:97] + "..."
            return preview
        return "No messages yet"

class Message(models.Model):
    SENDER_CHOICES = (
        ('user', 'User'),
        ('bot', 'Bot'),
    )
    
    MESSAGE_TYPE_CHOICES = (
        ('general', 'General Message'),
        ('question', 'Preference Question'),
        ('answer', 'Preference Answer'),
        ('recommendation', 'Remedy Recommendation'),
    )
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='general')
    preference_key = models.CharField(max_length=30, blank=True, null=True, 
                                     help_text="For preference questions/answers, the key being asked about")
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.sender} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

class HerbCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Herb Categories"
    
    def __str__(self):
        return self.name


class Herb(models.Model):
    name = models.CharField(max_length=100)
    scientific_name = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    benefits = models.TextField()
    usage = models.TextField()
    precautions = models.TextField(blank=True)
    image = models.ImageField(upload_to='herbs/', null=True, blank=True)
    categories = models.ManyToManyField(HerbCategory, related_name='herbs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
