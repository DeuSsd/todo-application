from email.policy import default
from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(default="",max_length=255)
    is_completed = serializers.BooleanField(default=False)
    time_create = serializers.DateTimeField(read_only=True)
    time_update = serializers.DateTimeField(read_only=True)
    
    
    def create(self, validated_data):
        return Task.objects.create(**validated_data)
    
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.is_completed = validated_data.get("is_completed", instance.is_completed)
        instance.time_update = validated_data.get("time_update", instance.time_update)
        instance.save()
        return instance
        
    