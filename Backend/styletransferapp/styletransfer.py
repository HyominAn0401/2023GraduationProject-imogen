import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.models as models
import PIL
import matplotlib.pyplot as plt
import copy
import os
from torchvision.utils import save_image
import logging

logger = logging.getLogger(__name__)

device = torch.device('mps:0' if torch.backends.mps.is_available() else 'cpu') #
cnn_normalization_mean = torch.tensor([0.485, 0.456, 0.406]).to(device)
cnn_normalization_std = torch.tensor([0.229, 0.224, 0.225]).to(device)

content_layers = ['conv_4']
style_layers = ['conv_1', 'conv_3', 'conv_5', 'conv_7', 'conv_9']

# 이미지 다운 받아 tensor객체로 변환
def image_loader(img_path, imsize):
  loader = transforms.Compose([
      transforms.Resize(imsize),  #이미지 크기 변경경
      transforms.ToTensor() #torch.Tensor 형식으로 변경[0,255] -> [0,1]
  ])
  image = PIL.Image.open(img_path)
  #네트워크 입력에 들어갈 이미지에 배치 목적의 차원(dimension) 추가
  image = loader(image).unsqueeze(0)
  return image.to(device, torch.float) #GPU에 올리기

class Normalization(nn.Module):
  def __init__(self, mean, std):
    super(Normalization, self).__init__()
    self.mean = mean.clone().view(-1, 1, 1)
    self.std = std.clone().view(-1,1,1)

  def forward(self, img):
    return(img - self.mean)/self.std

def gram_matrix(input):
  # a는 배치 크기, b는 특징 맵개수, (c,d)는 특징 맵의 차원 의미
  a,b,c,d = input.size()
  # 논문에서는 i = 특징 맵 개수, j = 각위치(position)
  features = input.view(a*b, c*d)
  #행렬 곱으로 한번에 Gram 내적 계산 가능
  G = torch.mm(features, features.t())
  #Normalize 목적으로 값 나누기
  return G.div(a*b*c*d)

  #스타일 loss 계산을 위한 클래스 정의
class StyleLoss(nn.Module):
  def __init__(self, target_feature):
      super(StyleLoss, self).__init__()
      self.target = gram_matrix(target_feature).detach()

  def forward(self, input):
      G = gram_matrix(input)
      self.loss = F.mse_loss(G, self.target)
      return input

# 콘텐츠 손실(content loss) 계산을 위한 클래스 정의
class ContentLoss(nn.Module):
    def __init__(self, target,):
        super(ContentLoss, self).__init__()
        self.target = target.detach()

    def forward(self, input):
        self.loss = F.mse_loss(input, self.target)
        return input

# Style Transfer 손실(loss)을 계산하는 함수
def get_losses(cnn, content_img, style_img, noise_image):
    cnn = copy.deepcopy(cnn)
    normalization = Normalization(cnn_normalization_mean, cnn_normalization_std).to(device)
    content_losses = []
    style_losses = []

    # 가장 먼저 입력 이미지가 입력 정규화(input normalization)를 수행하도록
    model = nn.Sequential(normalization)

    # 현재 CNN 모델에 포함되어 있는 모든 레이어를 확인하며
    i = 0
    for layer in cnn.children():
        if isinstance(layer, nn.Conv2d):
            i += 1
            name = 'conv_{}'.format(i)
        elif isinstance(layer, nn.ReLU):
            name = 'relu_{}'.format(i)
            layer = nn.ReLU(inplace=False)
        elif isinstance(layer, nn.MaxPool2d):
            name = 'pool_{}'.format(i)
        elif isinstance(layer, nn.BatchNorm2d):
            name = 'bn_{}'.format(i)
        else:
            raise RuntimeError('Unrecognized layer: {}'.format(layer.__class__.__name__))

        model.add_module(name, layer)

        # 설정한 content layer까지의 결과를 이용해 content loss를 계산
        if name in content_layers:
            target_feature = model(content_img).detach()
            content_loss = ContentLoss(target_feature)
            model.add_module("content_loss_{}".format(i), content_loss)
            content_losses.append(content_loss)

        # 설정한 style layer까지의 결과를 이용해 style loss를 계산
        if name in style_layers:
            target_feature = model(style_img).detach()
            style_loss = StyleLoss(target_feature)
            model.add_module("style_loss_{}".format(i), style_loss)
            style_losses.append(style_loss)

    # 마지막 loss 이후의 레이어는 사용하지 않도록
    for i in range(len(model) - 1, -1, -1):
        if isinstance(model[i], ContentLoss) or isinstance(model[i], StyleLoss):
            break

    model = model[:(i + 1)]
    return model, content_losses, style_losses


def style_transfer(cnn, content_img, style_img, input_img, iters):
    model, content_losses, style_losses = get_losses(cnn, content_img, style_img, input_img)
    optimizer = optim.LBFGS([input_img.requires_grad_()])

    print("[ Start ]")

    # 하나의 값만 이용하기 위해 배열 형태로 사용
    run = [0]
    while run[0] <= iters:

        def closure():
            input_img.data.clamp_(0, 1)

            optimizer.zero_grad()
            model(input_img)
            content_score = 0
            style_score = 0

            for cl in content_losses:
                content_score += cl.loss
            for sl in style_losses:
                style_score += sl.loss

            style_score *= 1e5
            loss = content_score + style_score
            loss.backward()

            run[0] += 1
            if run[0] % 100 == 0:
                print(f"[ Step: {run[0]} / Content loss: {content_score.item()} / Style loss: {style_score.item()}]")

            return content_score + style_score

        optimizer.step(closure)

    # 결과적으로 이미지의 각 픽셀의 값이 [0, 1] 사이의 값이 되도록 자르기
    input_img.data.clamp_(0, 1)

    return input_img
    

def generate_style_transfer_image(content_img_path, style_img_path): # 콘텐츠 이미지 path / 스타일 이미지 path  iters=300, content_losses=None, style_losse=None 
    print("start")
    try:

        content_img = image_loader(content_img_path, (512,640))
        style_img = image_loader(style_img_path, (512,640))
        input_img = torch.empty_like(content_img).uniform_(0,1).to(device)

        cnn = models.vgg19(pretrained=True).features.to(device).eval()

        # style transfer 수행
        output = style_transfer(cnn, content_img=content_img, style_img=style_img, input_img=input_img, iters = 300)

        return output
    
    except Exception as e:
        logger.error('Style transfer failed: {str(e)}')
        print(f'Error: {str(e)}')
        return None