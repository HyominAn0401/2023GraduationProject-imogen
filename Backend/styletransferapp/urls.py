from django.urls import path
from . import views

# app_name = 'styletransferapp'

urlpatterns = [
    #path('upload/', views.upload_image, name='upload_image'),
    #path('stylegen/', views.stylegen, name='stylegen'),
    #path('upload_image/', views.UploadImageView.as_view(), name='upload_image')
    path('stylegen/', views.upload_image, name='stylegen'),
    path('text2img/', views.text2imagen, name='text2img'),
    path('imageEdit/', views.image_edit, name='imageEdit'),
    path('index/', views.index, name="index"),

    path('emailResultImage/', views.emailResultImage, name='emailResultImage'),
    # 다른 URL 패턴들을 여기에 추가할 수 있습니다.
]