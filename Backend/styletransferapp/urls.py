from django.urls import path
from . import views

# app_name = 'styletransferapp'

urlpatterns = [
    #path('upload/', views.upload_image, name='upload_image'),
    #path('stylegen/', views.stylegen, name='stylegen'),
    #path('upload_image/', views.UploadImageView.as_view(), name='upload_image')
    path('stylegen/', views.upload_image, name='stylegen')
]