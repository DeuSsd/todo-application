from django.http import HttpResponse
from django.shortcuts import render

from todo.models import Task

# Create your views here.

menu = ["TODO","О сайте"]


def index(request):
    tasks = Task.objects.all()
    return render(request, 'todo/index.html', {'tasks': tasks,'title': 'Главгая страница', 'menu': menu})


def about(request):
    return render(request, 'todo/about.html')

