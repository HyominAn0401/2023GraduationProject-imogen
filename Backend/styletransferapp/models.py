from django.db import models

# Create your models here.
class UserImage(models.Model):
    print("hihi")
    content_image = models.ImageField(upload_to='image/content/')
    style_image = models.ImageField(upload_to='image/style/')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'UserImage ${self.id}'
    
class GeneratedImage(models.Model):
    user_image = models.ForeignKey(UserImage, on_delete=models.CASCADE)
    generated_image = models.ImageField(upload_to='generated_images/')
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'GeneratedImage #{self.id} for UserImage #{self.user_image.id}'