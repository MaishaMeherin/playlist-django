# playlist/serializers.py
from rest_framework import serializers
from .models import Track, PlaylistTrack
from django.contrib.auth.models import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password']
#         extra_kwargs = {'password': {"write_only": True}}
        
#     def create(self, validated_data):
#         user = User.objects.create_user(**validated_data)
#         return user
    
class TrackSerializer(serializers.ModelSerializer):
    """
    Converts Track model to/from JSON.
    Equivalent to manually building JSON objects in Express.
    """
    class Meta:
        model = Track
        fields = ['id', 'title', 'artist', 'album', 'duration_seconds', 'genre', 'cover_url']
        # Alternative: fields = '__all__'  # Include all model fields


class PlaylistTrackSerializer(serializers.ModelSerializer):
    """
    Converts PlaylistTrack model to/from JSON.
    Includes nested Track data.
    """
    # Nested serializer - includes full track details
    track = TrackSerializer(read_only=True)
    
    # For write operations, we accept track_id
    track_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = PlaylistTrack
        fields = [
            'id', 
            'track',      # Read: full track object
            'track_id',   # Write: just the ID
            #'position', 
            'votes',  
            'added_at', 
            'is_playing', 
            'played_at'
        ]