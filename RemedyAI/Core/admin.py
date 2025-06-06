from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, Conversation, Message, Herb, HerbCategory, UserPreferences

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    
# Extend the User admin
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ('user', 'age_group', 'wellness_goal', 'allergies', 'created_at')
    list_filter = ('age_group', 'wellness_goal', 'allergies')
    search_fields = ('user__username', 'other_allergies')

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('timestamp',)

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_personalized', 'created_at', 'updated_at')
    search_fields = ('title', 'user__username')
    list_filter = ('created_at', 'updated_at', 'is_personalized')
    inlines = [MessageInline]

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'content_preview', 'message_type', 'preference_key', 'conversation', 'timestamp')
    list_filter = ('sender', 'timestamp', 'message_type')
    search_fields = ('content', 'conversation__title', 'preference_key')
    
    def content_preview(self, obj):
        if len(obj.content) > 50:
            return obj.content[:47] + "..."
        return obj.content
    content_preview.short_description = 'Content'

class HerbAdmin(admin.ModelAdmin):
    list_display = ('name', 'scientific_name')
    search_fields = ('name', 'scientific_name', 'description')
    filter_horizontal = ('categories',)
    list_filter = ('categories',)

admin.site.register(Herb, HerbAdmin)
admin.site.register(HerbCategory)
