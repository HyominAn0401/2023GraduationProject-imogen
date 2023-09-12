from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from django.core.asgi import get_asgi_application

application = ProtocolTypeRouter({
    "websocket": "",
    "http": get_asgi_application(),
})
    
