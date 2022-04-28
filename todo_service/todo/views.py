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
        
        tasks_queryset = Task.objects.all()
        return Response(tasks_queryset.values())
    
    
    
    def post(self, request):
        task_new = Task.objects.create(
            title=request.data['title']
        )
        
        return Response({'post': model_to_dict(task_new)})
    
    ...
# class TodoAPIView(generics.ListAPIView):
#     queryset = Task.objects.all()
    
#     serializer_class = TaskSerializer
#     ...