from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Note(models.Model):
    songName = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.IntegerField(default=50)
    albumPic = models.CharField(max_length=255, blank=True, null=True)
    year = models.CharField(max_length=100, blank=True, null=True)
    artist = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.songName