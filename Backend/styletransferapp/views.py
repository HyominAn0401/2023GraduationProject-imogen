from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import UserImage, GeneratedImage
from .styletransfer import generate_style_transfer_image
from django.conf import settings
import os
import torch
from torchvision.utils import save_image
import torchvision.models as models
import torch.optim as optim

# Device 설정: MPS 지원 GPU가 있는 경우 GPU를 사용하고, 그렇지 않으면 CPU를 사용


# # Neural Network model 불러오기
# cnn = models.vgg19(pretrained=True).features.to(device).eval()

# # 입력 정규화(Normalization)을 위한 초기화
# cnn_normalization_mean = torch.tensor([0.485, 0.456, 0.406]).to(device)
# cnn_normalization_std = torch.tensor([0.229, 0.224, 0.225]).to(device)

# 사용자가 이미지 업로드 페이지에 접근할 때
def upload_image(request):
    
    device = torch.device('mps:0' if torch.backends.mps.is_available() else 'cpu')

    if request.method == 'POST':
        # 사용자가 업로드한 이미지 파일 가져오기
        content_image = request.FILES['content_image']
        style_image = request.FILES['style_image']

        # UserImage 모델에 이미지 저장
        user_image = UserImage(content_image=content_image, style_image=style_image)
        user_image.save()

        # UserImage의 ID를 이용해 스타일 전이 수행
        generated_image = generate_style_transfer_image(user_image.content_image.path, user_image.style_image.path)

        if generated_image is not None:
            # 생성된 이미지 저장
            generated_image_path = os.path.join(settings.MEDIA_ROOT, f'generated_images/output_{user_image.id}.png')
            save_image(generated_image.cpu().detach()[0], generated_image_path)

            # GeneratedImage 모델에 결과 이미지 저장
            generated_image_model = GeneratedImage(user_image=user_image, generated_image=f'generated_images/output_{user_image.id}.png')
            generated_image_model.save()

            return HttpResponse(f'Style transfer completed. <a href="{generated_image_model.generated_image.url}">View Result</a>')

    return render(request, 'upload_image.html')

def stylegen(request):
    return render(request, 'styletransfer.html')

