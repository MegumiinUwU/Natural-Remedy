from django.urls import path
from . import views

app_name = 'Core'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('chat/', views.chat, name='new_chat'),
    path('chat/<int:chat_id>/', views.chat, name='chat'),
    path('chat/send/', views.send_message, name='send_message'),
    path('profile/', views.profile, name='profile'),
    path('encyclopedia/', views.encyclopedia, name='encyclopedia'),
    path('herb/<int:herb_id>/', views.herb_detail, name='herb_detail'),
]