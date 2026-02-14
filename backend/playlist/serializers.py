# playlist/serializers.py
from rest_framework import serializers
from .models import Track, PlaylistTrack, Vote
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {"write_only": True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
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
    
    # # For write operations, we accept track_id
    # track_id = serializers.IntegerField(write_only=True)

    
    user = UserSerializer(read_only=True)
        
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    has_voted = serializers.BooleanField(read_only=True, default=False)
    
    class Meta:
        model = PlaylistTrack
        fields = [
            'id', 
            'user',
            'user_id',
            'user_username',
            'track',      # Read: full track object
            'track_id',   # Write: just the ID
            #'position', 
            'votes',  
            'has_voted',
            'added_at', 
            'is_playing', 
            'played_at'
        ]
    
        
    
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'