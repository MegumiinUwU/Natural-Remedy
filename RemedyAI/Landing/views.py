from django.shortcuts import render

def home(request):
    """
    Landing page view that introduces Natural Remedy platform to users.
    Includes information about the app, its features, and login/register options.
    """
    context = {
        'title': 'Natural Remedy - Holistic Health Solutions',
        'hero_title': 'Discover Nature\'s Remedies',
        'hero_subtitle': 'AI-Powered Guidance for Natural Health Solutions',
        
        'about_title': 'About Natural Remedy',
        'about_description': """
            Natural Remedy is a web-based platform that connects you with natural, 
            non-chemical remedies based on your health concerns. Our AI-powered chatbot provides 
            personalized recommendations for herbs, natural treatments, and holistic practices 
            tailored to your unique needs.
        """,
        
        'features': [
            {
                'title': 'AI Health Assistant',
                'description': 'Describe your symptoms in natural language and receive personalized natural remedy suggestions.',
                'icon': 'chat-dots',
            },
            {
                'title': 'Herb Encyclopedia',
                'description': 'Browse our comprehensive database of herbs, their benefits, and traditional uses.',
                'icon': 'book',
            },
            {
                'title': 'Wellness Knowledge',
                'description': 'Explore general health practices like cold therapy, mindfulness, and herbal teas.',
                'icon': 'lightbulb',
            },
            {
                'title': 'Holistic Approach',
                'description': 'Combining traditional wisdom with modern technology for complete wellness.',
                'icon': 'tree',
            },
        ],
        
        'how_it_works_title': 'How It Works',
        'how_it_works_steps': [
            {
                'number': '1',
                'title': 'Describe Your Concern',
                'description': 'Tell our AI chatbot about your symptoms or health questions in everyday language.',
            },
            {
                'number': '2',
                'title': 'Get Personalized Suggestions',
                'description': 'Receive tailored recommendations for natural remedies and practices.',
            },
            {
                'number': '3',
                'title': 'Explore Detailed Information',
                'description': 'Learn more about suggested remedies from our comprehensive database.',
            },
        ],
        
        'cta_title': 'Start Your Natural Health Journey Today',
        'cta_description': 'Join thousands of users who have discovered the power of natural remedies.',
    }
    
    return render(request, 'Landing/home.html', context)

def about(request):
    """About page view that provides more information about Natural Remedy."""
    context = {
        'title': 'About - Natural Remedy',
    }
    return render(request, 'Landing/about.html', context)

def services(request):
    """Services page view that explains the features and offerings of the platform."""
    context = {
        'title': 'Services - Natural Remedy',
    }
    return render(request, 'Landing/services.html', context)

def contact(request):
    """Contact page view that provides ways to get in touch with the team."""
    context = {
        'title': 'Contact Us - Natural Remedy',
    }
    return render(request, 'Landing/contact.html', context)
