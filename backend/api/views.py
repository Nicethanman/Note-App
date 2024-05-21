from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): #override the get_queryset. Either override this or set it like in CreateUserView
        user = self.request.user #gives us the user
        return Note.objects.filter(author=user) #filters all the notes written by specific user
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user) #serializer has author as read only so this part of the code manually sets the author
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):

    #need these to set up a view - check the django rest framework documentation
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]