from django.http import HttpResponse
from django.shortcuts import render
import os
import torch
from django.core.mail import EmailMessage
from asgiref.sync import async_to_sync
from .models import UserImage, GeneratedImage
from .styletransfer import generate_style_transfer_image
from django.conf import settings
from torchvision.utils import save_image
import torchvision.models as models
import torch.optim as optim
from django.conf import settings

# 이미지 모델 저장 비동기 함수
async def save_user_image(content_image, style_image):
    user_image = UserImage(content_image=content_image, style_image=style_image)
    user_image.save()
    return user_image

# 이미지 생성 및 이메일 전송 비동기 함수
async def process_image_and_send_email(user_image, email_address):
    generated_image = generate_style_transfer_image(user_image.content_image.path, user_image.style_image.path)
    if generated_image is not None:
        generated_image_path = os.path.join(settings.MEDIA_ROOT, f'generated_images/output_{user_image.id}.png')
        save_image(generated_image.cpu().detach()[0], generated_image_path)
        generated_image_model = GeneratedImage(user_image=user_image, generated_image=f'generated_images/output_{user_image.id}.png')
        generated_image_model.save()
        email = EmailMessage(
            'Style Transfer Completed',
            'Your style transfer is complete. Please find the result attached.',
            settings.EMAIL_HOST_USER,
            [email_address],
        )
        email.attach_file(generated_image_path)
        email.send()

# 비동기 이미지 처리 뷰
@async_to_sync
async def upload_image(request):
    device = torch.device('mps:0' if torch.backends.mps.is_available() else 'cpu')
    if request.method == 'POST':
        content_image = request.FILES['content_image']
        style_image = request.FILES['style_image']

        #폼 데이터에서 이메일 주소
        email_address = request.POST.get('email')

        # 이미지 저장 비동기 함수를 직접 await로 호출
        user_image = await save_user_image(content_image, style_image)

        # 비동기로 이미지 생성 및 이메일 전송 작업 실행
        await process_image_and_send_email(user_image, email_address)

        # 생성된 이미지 모델 가져오기
        try:
            generated_image_model = GeneratedImage.objects.get(user_image=user_image)
        except GeneratedImage.DoesNotExist:
            pass  # 생성된 이미지 모델이 없을 경우 처리

        return render(request, 'styletransfer.html', {'generated_image_model': generated_image_model})

    return render(request, 'styletransfer.html')
