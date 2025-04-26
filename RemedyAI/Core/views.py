from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import Conversation, Message, Herb, Profile, UserPreferences
from django.db.models import Q
import json
import logging
import uuid
import traceback

# Set up logger
logger = logging.getLogger(__name__)

@login_required
def dashboard(request):
    """Main dashboard view for authenticated users with chat history and new chat option"""
    # Get real conversations for the current user
    conversations = request.user.conversations.all()[:5]  # Get 5 most recent conversations
    
    context = {
        'title': 'Dashboard - Natural Remedy Finder',
        'chat_history': [
            {
                'id': conv.id,
                'title': conv.title,
                'date': conv.updated_at.strftime('%Y-%m-%d'),
                'preview': conv.get_preview()
            } for conv in conversations
        ]
    }
    return render(request, 'Core/dashboard.html', context)

@login_required
def chat(request, chat_id=None):
    """View for starting a new chat or continuing an existing one"""
    if chat_id:
        # Get existing conversation
        conversation = get_object_or_404(Conversation, id=chat_id, user=request.user)
        messages_list = conversation.messages.all()
    else:
        # This is a new conversation
        conversation = None
        messages_list = []
    
    # Check if user has preferences
    has_preferences = hasattr(request.user, 'preferences') and request.user.preferences is not None
    
    context = {
        'title': 'Chat - Natural Remedy Finder',
        'conversation': conversation,
        'chat_id': chat_id,
        'is_new': chat_id is None,
        'messages': messages_list,
        'has_preferences': has_preferences
    }
    return render(request, 'Core/chat.html', context)

@login_required
def send_message(request):
    """API endpoint for sending/receiving chat messages"""
    if request.method == 'POST':
        try:
            # Add debug logging
            logger.debug("Received message request")
            
            # Better content type handling
            try:
                data = json.loads(request.body)
                user_message = data.get('message')
                conversation_id = data.get('conversation_id')
                
                # Get personalization data if present
                message_type = data.get('message_type', 'general')
                preference_key = data.get('preference_key')
                is_personalization = data.get('is_personalization', False)
                
                logger.debug(f"Parsed JSON data: message={user_message}, conversation_id={conversation_id}, " 
                            f"message_type={message_type}, preference_key={preference_key}, "
                            f"is_personalization={is_personalization}")
            except json.JSONDecodeError:
                # Fallback to form data
                user_message = request.POST.get('message')
                conversation_id = request.POST.get('conversation_id')
                message_type = request.POST.get('message_type', 'general')
                preference_key = request.POST.get('preference_key')
                is_personalization = request.POST.get('is_personalization', False) == 'true'
                
                logger.debug(f"Parsed FORM data: message={user_message}, conversation_id={conversation_id}, " 
                            f"message_type={message_type}, preference_key={preference_key}, "
                            f"is_personalization={is_personalization}")
            
            # Make sure we have a message
            if not user_message:
                return JsonResponse({'status': 'error', 'message': 'No message provided'}, status=400)
            
            # Create new conversation if needed
            if not conversation_id:
                conversation = Conversation.objects.create(
                    user=request.user,
                    title=user_message[:50] + ("..." if len(user_message) > 50 else "")
                )
                logger.debug(f"Created new conversation with ID {conversation.id}")
            else:
                try:
                    conversation = Conversation.objects.get(id=conversation_id, user=request.user)
                    logger.debug(f"Retrieved conversation with ID {conversation.id}")
                except Conversation.DoesNotExist:
                    return JsonResponse({'status': 'error', 'message': 'Conversation not found'}, status=404)
            
            # Save user message
            user_msg = Message.objects.create(
                conversation=conversation,
                sender='user',
                content=user_message,
                message_type=message_type,
                preference_key=preference_key
            )
            logger.debug(f"Created user message: {user_msg.id}, content: {user_message[:30]}...")
            
            # Handle personalization responses
            if is_personalization and preference_key:
                logger.info(f"Processing personalization response for key: {preference_key}, value: {user_message}")
                
                # Get or create user preferences
                preferences, created = UserPreferences.objects.get_or_create(
                    user=request.user
                )
                if created:
                    logger.info(f"Created new preferences for user {request.user.username}")
                else:
                    logger.info(f"Using existing preferences for user {request.user.username}")
                
                # Update preference based on key
                if preference_key == 'age_group':
                    # Map the display values to the database values
                    age_mapping = {
                        "Under 18": "under_18",
                        "18-35": "18_35",
                        "36-50": "36_50",
                        "51+": "51_plus"
                    }
                    preferences.age_group = age_mapping.get(user_message)
                    logger.debug(f"Set age_group to {preferences.age_group}")
                    
                elif preference_key == 'wellness_goal':
                    # Map the display values to the database values
                    goal_mapping = {
                        "Stress Relief": "stress_relief",
                        "Better Sleep": "better_sleep",
                        "Digestive Health": "digestive_health",
                        "Pain Relief": "pain_relief",
                        "Other": "other"
                    }
                    preferences.wellness_goal = goal_mapping.get(user_message, 'other')
                    logger.debug(f"Set wellness_goal to {preferences.wellness_goal}")
                    
                elif preference_key == 'allergies':
                    # Map the display values to the database values
                    allergy_mapping = {
                        "None": "none",
                        "Pollen": "pollen",
                        "Nuts": "nuts",
                        "Other": "other"
                    }
                    preferences.allergies = allergy_mapping.get(user_message, 'other')
                    logger.debug(f"Set allergies to {preferences.allergies}")
                    
                elif preference_key == 'other_allergies':
                    preferences.other_allergies = user_message
                    logger.debug(f"Set other_allergies to {user_message}")
                
                # Save preferences and link to conversation
                preferences.save()
                conversation.preferences = preferences
                conversation.is_personalized = True
                conversation.save()
                logger.info(f"Saved preferences and updated conversation {conversation.id}")
                
                # Prepare next question or completion message
                if preference_key == 'age_group':
                    bot_message = "What is your primary wellness goal?"
                    next_preference = 'wellness_goal'
                    options = ["Stress Relief", "Better Sleep", "Digestive Health", "Pain Relief", "Other"]
                elif preference_key == 'wellness_goal':
                    bot_message = "Do you have any known allergies?"
                    next_preference = 'allergies'
                    options = ["None", "Pollen", "Nuts", "Other"]
                elif preference_key == 'allergies' and user_message == 'Other':
                    # Just return success, frontend will handle the specific allergy input
                    return JsonResponse({
                        'status': 'success',
                        'conversation_id': conversation.id,
                        'timestamp': user_msg.timestamp.strftime('%H:%M'),
                    })
                elif preference_key == 'other_allergies' or preference_key == 'allergies':
                    bot_message = "Thank you for providing your information! I'll use this to give you more personalized recommendations."
                    next_preference = None
                    options = []
                else:
                    bot_message = "Thank you for providing your information! I'll use this to give you more personalized recommendations."
                    next_preference = None
                    options = []
                
                # Save bot response
                bot_response = Message.objects.create(
                    conversation=conversation,
                    sender='bot',
                    content=bot_message,
                    message_type='question' if next_preference else 'general',
                    preference_key=next_preference
                )
                logger.debug(f"Created bot response: {bot_response.id}, content: {bot_message[:30]}...")
                
                return JsonResponse({
                    'status': 'success',
                    'conversation_id': conversation.id,
                    'bot_response': bot_message,
                    'timestamp': bot_response.timestamp.strftime('%H:%M'),
                    'is_personalization': next_preference is not None,
                    'preference_key': next_preference,
                    'options': options
                })
                
            # Regular chat flow
            # Here you would integrate with your AI backend to get a response
            # For now, we'll use a simple mock response
            bot_responses = [
                "Based on your symptoms, chamomile tea might help. It has anti-inflammatory properties and can help with relaxation.",
                "I'd recommend trying ginger for that. It's effective for nausea and has anti-inflammatory benefits.",
                "Lavender essential oil could be beneficial here. It's known for its calming effects and can help with sleep issues.",
                "Peppermint might be worth trying. It's excellent for digestive issues and can help with headaches too.",
                "Turmeric with black pepper could help with those inflammation symptoms. It's a powerful natural anti-inflammatory."
            ]
            
            # If user has preferences, personalize the response
            preferences = None
            try:
                preferences = request.user.preferences
                logger.info(f"Found preferences for user {request.user.username}: {preferences.age_group}, {preferences.wellness_goal}, {preferences.allergies}")
            except Exception as e:
                logger.warning(f"Could not get preferences for user: {str(e)}")
            
            if preferences and preferences.wellness_goal:
                # For a real app, you would use the preferences to provide tailored responses
                # Here we're just demonstrating the concept
                if preferences.wellness_goal == 'stress_relief':
                    bot_responses = [
                        "For stress relief, I highly recommend chamomile tea or lavender essential oil.",
                        "Have you tried passionflower for stress? It's particularly effective for anxiety-related stress."
                    ]
                elif preferences.wellness_goal == 'better_sleep':
                    bot_responses = [
                        "For better sleep, valerian root or melatonin supplements might be beneficial.",
                        "Lavender essential oil in a diffuser by your bed can really improve sleep quality."
                    ]
                elif preferences.wellness_goal == 'digestive_health':
                    bot_responses = [
                        "For digestive issues, ginger tea is excellent. It helps with nausea and general stomach discomfort.",
                        "Peppermint tea is very effective for indigestion and bloating. It relaxes the digestive tract muscles."
                    ]
                elif preferences.wellness_goal == 'pain_relief':
                    bot_responses = [
                        "For pain relief, turmeric with black pepper can be very effective as a natural anti-inflammatory.",
                        "White willow bark contains salicin, which is similar to aspirin and can help with pain management."
                    ]
            
            import random
            bot_message = random.choice(bot_responses)
            
            # Save bot response
            bot_response = Message.objects.create(
                conversation=conversation,
                sender='bot',
                content=bot_message,
                message_type='recommendation'
            )
            logger.debug(f"Created bot response: {bot_response.id}, content: {bot_message[:30]}...")
            
            return JsonResponse({
                'status': 'success',
                'conversation_id': conversation.id,
                'bot_response': bot_message,
                'timestamp': bot_response.timestamp.strftime('%H:%M')
            })
            
        except Exception as e:
            logger.error(f"Error in send_message: {str(e)}")
            logger.error(traceback.format_exc())
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST method is allowed'}, status=405)

# Helper function to get or create session preferences
def get_session_preferences(request):
    """Get or create preferences for the current session"""
    if request.user.is_authenticated:
        preferences, created = UserPreferences.objects.get_or_create(user=request.user)
        return preferences
    
    # For non-authenticated users, create session-based preferences
    session_id = request.session.get('preferences_id')
    if not session_id:
        session_id = str(uuid.uuid4())
        request.session['preferences_id'] = session_id
    
    preferences, created = UserPreferences.objects.get_or_create(
        session_id=session_id
    )
    return preferences

@login_required
def profile(request):
    """User profile view"""
    # Ensure profile exists
    user_profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        # Handle profile update
        request.user.first_name = request.POST.get('first_name', request.user.first_name)
        request.user.last_name = request.POST.get('last_name', request.user.last_name)
        request.user.email = request.POST.get('email', request.user.email)
        request.user.save()
        
        user_profile.bio = request.POST.get('bio', user_profile.bio)
        
        if 'profile_image' in request.FILES:
            user_profile.profile_image = request.FILES['profile_image']
        
        user_profile.save()
        messages.success(request, 'Your profile was updated successfully!')
        return redirect('Core:profile')
    
    context = {
        'title': 'My Profile - Natural Remedy Finder',
        'user_profile': user_profile,
    }
    return render(request, 'Core/profile.html', context)

@login_required
def encyclopedia(request):
    """Herb encyclopedia view"""
    query = request.GET.get('q', '')
    
    if query:
        herbs = Herb.objects.filter(
            Q(name__icontains=query) | 
            Q(scientific_name__icontains=query) | 
            Q(description__icontains=query) |
            Q(benefits__icontains=query)
        ).distinct()
    else:
        herbs = Herb.objects.all()
    
    context = {
        'title': 'Herb Encyclopedia - Natural Remedy Finder',
        'herbs': herbs,
        'query': query
    }
    return render(request, 'Core/encyclopedia.html', context)

@login_required
def herb_detail(request, herb_id):
    """View for detailed herb information"""
    herb = get_object_or_404(Herb, id=herb_id)
    
    context = {
        'title': f'{herb.name} - Natural Remedy Finder',
        'herb': herb
    }
    return render(request, 'Core/herb_detail.html', context)

