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

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
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
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
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
