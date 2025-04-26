from django.urls import path
from . import views

app_name = 'GuestChat'

urlpatterns = [
    path('', views.guest_chat, name='guest_chat'),
    path('send_message/', views.send_message, name='send_message'),
]