from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import Conversation, Message, Herb, Profile
from django.db.models import Q
import json

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
    
    context = {
        'title': 'Chat - Natural Remedy Finder',
        'conversation': conversation,
        'chat_id': chat_id,
        'is_new': chat_id is None,
        'messages': messages_list
    }
    return render(request, 'Core/chat.html', context)

@login_required
def send_message(request):
    """API endpoint for sending/receiving chat messages"""
    if request.method == 'POST':
        try:
            # Add debug logging
            print("Received message request")
            
            # Better content type handling
            try:
                data = json.loads(request.body)
                user_message = data.get('message')
                conversation_id = data.get('conversation_id')
            except json.JSONDecodeError:
                # Fallback to form data
                user_message = request.POST.get('message')
                conversation_id = request.POST.get('conversation_id')
            
            print(f"Message: {user_message}, Conversation ID: {conversation_id}")
            
            # Make sure we have a message
            if not user_message:
                return JsonResponse({'status': 'error', 'message': 'No message provided'}, status=400)
            
            # Create new conversation if needed
            if not conversation_id:
                conversation = Conversation.objects.create(
                    user=request.user,
                    title=user_message[:50] + ("..." if len(user_message) > 50 else "")
                )
                print(f"Created new conversation with ID {conversation.id}")
            else:
                try:
                    conversation = Conversation.objects.get(id=conversation_id, user=request.user)
                    print(f"Retrieved conversation with ID {conversation.id}")
                except Conversation.DoesNotExist:
                    return JsonResponse({'status': 'error', 'message': 'Conversation not found'}, status=404)
            
            # Save user message
            Message.objects.create(
                conversation=conversation,
                sender='user',
                content=user_message
            )
            
            # Here you would integrate with your AI backend to get a response
            # For now, we'll use a simple mock response
            bot_responses = [
                "Based on your symptoms, chamomile tea might help. It has anti-inflammatory properties and can help with relaxation.",
                "I'd recommend trying ginger for that. It's effective for nausea and has anti-inflammatory benefits.",
                "Lavender essential oil could be beneficial here. It's known for its calming effects and can help with sleep issues.",
                "Peppermint might be worth trying. It's excellent for digestive issues and can help with headaches too.",
                "Turmeric with black pepper could help with those inflammation symptoms. It's a powerful natural anti-inflammatory."
            ]
            import random
            bot_message = random.choice(bot_responses)
            
            # Save bot response
            bot_response = Message.objects.create(
                conversation=conversation,
                sender='bot',
                content=bot_message
            )
            
            return JsonResponse({
                'status': 'success',
                'conversation_id': conversation.id,
                'bot_response': bot_message,
                'timestamp': bot_response.timestamp.strftime('%H:%M')
            })
            
        except Exception as e:
            import traceback
            print(f"Error in send_message: {str(e)}")
            print(traceback.format_exc())
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST method is allowed'}, status=405)

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

