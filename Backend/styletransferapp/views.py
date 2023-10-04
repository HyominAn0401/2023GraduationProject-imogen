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
from django.http import JsonResponse
import urllib.request
from django.views.decorators.csrf import csrf_exempt
import ssl
import base64


# 결과 이미지 보내는 함수 (styleTransfer)
def emailResultImage(request):
    a = request.POST.get('generatedImage','')
    a = a[1:]
    generated_image_path1 = os.path.join(settings.BASE_DIR, a)
    print(generated_image_path1)
    
    email_address= request.POST.get('email2','')
    print(email_address)

    email = EmailMessage(
        'StyleTransfer 완료',
        '첨부된 이미지를 확인해주세요.',
        settings.EMAIL_HOST_USER,
        [email_address],
    )
    print("Succeed email2")
    email.attach_file(generated_image_path1)
    print("Suceed attaching the image")
    email.send()

    response_data ={
        'message': f'{email_address}로 이메일 전송 완료'
    }
    return JsonResponse(response_data)

# 이미지 url 받아와서 이메일 전송하는 함수(text2image)
def emailText2Img(request):
    path = request.POST.get('generatedImage','')
    print(path)
    # a = a[1:]
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    ssl_context.verify_mode = ssl.CERT_NONE
    try:
        response = urllib.request.urlopen(path,context=ssl_context)
        image_data = response.read()
        
        email_address= request.POST.get('email2','')
        print(email_address)

        email = EmailMessage(
            'StyleTransfer 완료',
            '첨부된 이미지를 확인해주세요.',
            settings.EMAIL_HOST_USER,
            [email_address],
        )
        print("Succeed email2")
        email.attach('image.jpg', image_data, 'image/jpeg')
        # email.attach_file(generated_image_path1)
        print("Suceed attaching the image")
        email.send()

        response_data ={
            'message': f'{email_address}로 이메일 전송 완료'
        }
        return JsonResponse(response_data)
    except Exception as e:
        return HttpResponse(f'오류 발생: {str(e)}', status=500)

# 편집된 이미지 이메일 보내기 (imageEditor.html)
def emailEditedImage(request):
    print(request)
    email_address= request.POST.get('email2','')
    print(email_address)
    # a = a[1:]
    # ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    # ssl_context.verify_mode = ssl.CERT_NONE
    imageData = request.POST.get('imageData', "")
    print('이건 이미지데이터', image_data)
    # 이미지 데이터 디코딩
    image_data = base64.b64decode(imageData).split(",")[1]
    

    email = EmailMessage(
        'StyleTransfer 완료',
        '첨부된 이미지를 확인해주세요.',
        settings.EMAIL_HOST_USER,
        [email_address],
    )
    print("Succeed email2")
    email.attach('image.jpg', image_data, 'image/jpeg')
    # email.attach_file(generated_image_path1)
    print("Suceed attaching the image")
    email.send()

    response_data ={
        'message': f'{email_address}로 이메일 전송 완료'
    }
    return JsonResponse(response_data)



# 이미지 모델 저장 비동기 함수
async def save_user_image(content_image, style_image, content_selected_image_path, style_selected_image_path):
    user_image = UserImage(content_image=content_image, style_image=style_image, content_selected_image=content_selected_image_path, style_selected_image=style_selected_image_path)
    print(5)
    user_image.save()
    return user_image

async def send_email_with_image(email_address, generated_image_path):
    email = EmailMessage(
        'StyleTransfer 완료',
        'Style Transfer가 완료되었습니다. 첨부파일을 확인해주세요.',
        settings.EMAIL_HOST_USER,
        [email_address],
    )
    email.attach_file(generated_image_path)
    email.send()

# 이미지 생성 및 이메일 전송 비동기 함수
async def process_image_and_send_email(user_image, email_address):
    print(7)
    print(user_image.style_selected_image)
    print(user_image.content_selected_image)
    # 1. content_image 업로드 & style_image 업로드
    if user_image.content_image and user_image.style_image :
        generated_image = generate_style_transfer_image(user_image.content_image.path, user_image.style_image.path)
    # 2. content_image 업로드 & style_image 샘플
    elif user_image.content_image and user_image.style_selected_image:
        generated_image = generate_style_transfer_image(user_image.content_image.path, user_image.style_selected_image)
    # 3. content_image 샘플 & style_image 업로드
    elif user_image.content_selected_image and user_image.style_image:
        generated_image = generate_style_transfer_image(user_image.style_selected_image, user_image.style_image.path)
    # 4. content_image 샘플 & style_image 샘플
    elif user_image.content_selected_image is not None and user_image.style_selected_image is not None:
        print(10)
        generated_image = generate_style_transfer_image(user_image.content_selected_image, user_image.style_selected_image)
    
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
        
        await send_email_with_image(email_address, generated_image_path)

# 비동기 이미지 처리 뷰
@async_to_sync
async def upload_image(request):
    device = torch.device('mps:0' if torch.backends.mps.is_available() else 'cpu')
    if request.method == 'POST':
        content_image = request.FILES.get('content_image',None)
        style_image = request.FILES.get('style_image',None)
        print(f'content, style image: {content_image}, {type(content_image)}')
        content_selected_image = request.POST.get('content_selected_image',None)
        style_selected_image = request.POST.get('style_selected_image',None)
        content_selected_image_path = os.path.join(settings.STATICFILES_DIRS[0], 'img', content_selected_image)
        style_selected_image_path = os.path.join(settings.STATICFILES_DIRS[0], 'img', style_selected_image)
        print(4)

        #폼 데이터에서 이메일 주소
        email_address = request.POST.get('email')
        print(email_address)

        # 이미지 저장 비동기 함수를 직접 await로 호출
        user_image = await save_user_image(content_image, style_image,content_selected_image_path, style_selected_image_path)
        print(6)
        print(user_image)
        print(user_image.content_selected_image)

        # 비동기로 이미지 생성 및 이메일 전송 작업 실행
        await process_image_and_send_email(user_image, email_address)

        # 생성된 이미지 모델 가져오기
        try:
            generated_image_model = GeneratedImage.objects.get(user_image=user_image)
        except GeneratedImage.DoesNotExist:
            pass  # 생성된 이미지 모델이 없을 경우 처리

        return render(request, 'styletransfer.html', {'generated_image_model': generated_image_model})

    return render(request, 'styletransfer.html')

#text2imgen
def text2imagen(request):
    return render(request, 'text2img.html')

#ImageEdit
def image_edit(request):
    return render(request, 'imageEdit.html')

#index
def index(request):
    return render(request, 'index.html')