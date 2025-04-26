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
import sys
import os
import importlib.util
from dotenv import load_dotenv

# Set up logger
logger = logging.getLogger(__name__)

# Load environment variables from .env file
dotenv_path = os.path.join("f:\\coding\\Hackathon ALX\\app", ".env")
load_dotenv(dotenv_path)
logger.info(f"Loaded environment variables from {dotenv_path}")
logger.info(f"GROQ_API_KEY is {'set' if os.environ.get('GROQ_API_KEY') else 'not set'}")

# Add the correct absolute path to the parent directory containing RAG.py
app_dir = "f:\\coding\\Hackathon ALX\\app"
if app_dir not in sys.path:
    sys.path.append(app_dir)
    logger.info(f"Added {app_dir} to Python path")

# Define paths to important files
rag_path = os.path.join(app_dir, "RAG.py")
retriever_path = os.path.join(app_dir, "retriever.py")

# Helper function to load the AI modules
def load_ai_modules():
    try:
        # Check if files exist
        if not os.path.exists(rag_path) or not os.path.exists(retriever_path):
            if not os.path.exists(rag_path):
                logger.error(f"RAG.py not found at {rag_path}")
            if not os.path.exists(retriever_path):
                logger.error(f"retriever.py not found at {retriever_path}")
            return None, None
            
        # Import retriever.py first since RAG depends on it
        spec = importlib.util.spec_from_file_location("retriever", retriever_path)
        retriever_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(retriever_module)
        knowledge_base_class = retriever_module.KnowledgeBase
        logger.info("Successfully imported KnowledgeBase class")
        
        # Instead of importing the entire RAG.py which has code that runs at import time,
        # we'll create a modified version of the AI_respond function
        
        from langchain_groq import ChatGroq
        from langchain_core.prompts import ChatPromptTemplate
        
        # Create the LLM instance
        llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        
        # Initialize the KnowledgeBase with the existing collection
        # This will connect to the existing database instead of trying to load files
        kb_instance = knowledge_base_class(collection_name="herbal_books_chunks")
        logger.info("Successfully initialized KnowledgeBase with existing collection")
        
        # Define the AI_respond function directly from the original without importing it
        def ai_respond(human_prompt, kb, history=None, top_k=3):
            """
            RAG-based response system.
            
            Args:
                human_prompt: The user's question.
                kb: Your KnowledgeBase instance.
                top_k: How many chunks to retrieve.

            Returns:
                The AI's response string.
            """
            # Ensure history is a list
            if history is None:
                history = []

            system_message = """
                You are a helpful RAG System that Recommends Herbs and general health advices.
                Answer based only on the provided context chunks: {retrieved_chunks}.
                Important: If the user's conditions make a herb or recommendation risky, kindly mention it.
                If you don't find the answer in the context, say "I don't know based on the given information."
            """

            full_chat = [("system", system_message)]

            for past_human, past_ai in history:
                full_chat.append(("human", past_human))
                full_chat.append(("ai", past_ai))

            # Add the new incoming human question
            full_chat.append(("human", "{human_question}"))

            # Create ChatPromptTemplate
            prompt = ChatPromptTemplate.from_messages(full_chat)

            # Retrieve top-k similar chunks
            results = kb.query_similar_chunks(human_prompt, n_results=top_k)

            # Combine retrieved context
            chunks_texts = []
            for metadata in results["metadatas"][0]:
                chunks_texts.append(metadata["content"])

            combined_chunks = "\n\n".join(chunks_texts)

            # Build the chain and invoke
            chain = prompt | llm

            response = chain.invoke(
                {
                    "retrieved_chunks": combined_chunks,
                    "human_question": human_prompt,
                }
            )

            return response.content
        
        logger.info("Successfully created AI_respond function")
        return ai_respond, kb_instance
        
    except Exception as e:
        logger.error(f"Failed to import RAG modules: {str(e)}")
        logger.error(traceback.format_exc())
        return None, None

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
            # Load AI modules
            AI_respond, kb = load_ai_modules()
            if not AI_respond or not kb:
                logger.error("AI modules could not be loaded")
                bot_message = "I apologize, but I encountered an issue with the AI system. Please try again later."
            else:
                # Get conversation history for AI_respond
                history = []
                if conversation_id:
                    # Get previous messages for this conversation
                    previous_messages = Message.objects.filter(conversation=conversation).order_by('timestamp')
                    
                    # Format messages as (human, ai) tuples for history
                    for i in range(0, len(previous_messages) - 1, 2):
                        if i+1 < len(previous_messages):
                            if previous_messages[i].sender == 'user' and previous_messages[i+1].sender == 'bot':
                                history.append((previous_messages[i].content, previous_messages[i+1].content))
                
                logger.debug(f"Collected {len(history)} historical message pairs")
                
                # If user has preferences, we can add those to the user's query
                preferences_text = ""
                try:
                    preferences = request.user.preferences
                    if preferences:
                        if preferences.age_group:
                            age_mapping_reverse = {
                                "under_18": "Under 18",
                                "18_35": "18-35",
                                "36_50": "36-50", 
                                "51_plus": "51+"
                            }
                            preferences_text += f" Age group: {age_mapping_reverse.get(preferences.age_group, 'Not specified')}."
                        
                        if preferences.wellness_goal:
                            goal_mapping_reverse = {
                                "stress_relief": "Stress Relief",
                                "better_sleep": "Better Sleep",
                                "digestive_health": "Digestive Health",
                                "pain_relief": "Pain Relief",
                                "other": "Other"
                            }
                            preferences_text += f" Goal: {goal_mapping_reverse.get(preferences.wellness_goal, 'Not specified')}."
                        
                        if preferences.allergies:
                            allergy_mapping_reverse = {
                                "none": "None",
                                "pollen": "Pollen",
                                "nuts": "Nuts",
                                "other": "Other"
                            }
                            allergies_text = allergy_mapping_reverse.get(preferences.allergies, 'Not specified')
                            if allergies_text == "Other" and preferences.other_allergies:
                                allergies_text += f": {preferences.other_allergies}"
                            preferences_text += f" Allergies: {allergies_text}."
                            
                        logger.info(f"Added user preferences to query: {preferences_text}")
                except Exception as e:
                    logger.warning(f"Could not get preferences for user: {str(e)}")
                
                try:
                    # Call the AI_respond function with context-enhanced query
                    enhanced_query = user_message
                    if preferences_text:
                        enhanced_query += f"\n\nUser information: {preferences_text}"
                    
                    logger.info(f"Sending enhanced query to AI_respond: {enhanced_query[:100]}...")
                    bot_message = AI_respond(
                        human_prompt=enhanced_query,
                        kb=kb,
                        history=history,
                        top_k=3  # You can adjust this parameter
                    )
                    logger.info(f"Received response from AI_respond: {bot_message[:100]}...")
                except Exception as e:
                    logger.error(f"Error calling AI_respond: {str(e)}")
                    logger.error(traceback.format_exc())
                    bot_message = "I apologize, but I encountered an issue generating a response. Please try again."
            
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

@login_required
def delete_chat(request, chat_id):
    """Delete a conversation/chat"""
    try:
        conversation = get_object_or_404(Conversation, id=chat_id, user=request.user)
        title = conversation.title
        conversation.delete()
        messages.success(request, f'Chat "{title}" has been deleted successfully.')
    except Exception as e:
        logger.error(f"Error deleting conversation {chat_id}: {str(e)}")
        messages.error(request, 'An error occurred while trying to delete the chat.')
    
    return redirect('Core:dashboard')

