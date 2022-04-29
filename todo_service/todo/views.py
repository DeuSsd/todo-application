from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from django.shortcuts import render

from .serializers import TaskSerializer

from .models import Task

# Create your views here.

menu = ["TODO","О сайте"]


def index(request):
    tasks = Task.objects.all()
    return render(request, 'todo/todo.html', {'tasks': tasks,'title': 'Главгая страница', 'menu': menu})


def about(request):
    return render(request, 'todo/about.html')


class TodoAPIView(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        return Response({
            tasks.values()
        })  
        
        
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'post': serializer.data,
            })
        
        
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({
                "error": "Method PUT not allowed"
            })
        try:
            instance = Task.objects.get(pk = pk)
        except:
            return Response({
                "error": "Object does not exists"
            })

        serializer = TaskSerializer(data=request.data,instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'post': serializer.data,
            })
        
        
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({
                "error": "Method DELETE not allowed"
            })
        
        try:
            instance = Task.objects.get(pk = pk)
            instance.delete()
        except:
            return Response({
                "error": "Object does not exists"
            })
            
        return Response({
            'post': f"delete task {pk}"
        })