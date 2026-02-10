# playlist/models.py
from django.db import models
from django.contrib.auth.models import User

class Track(models.Model):
    """
    Library of available tracks.
    """
    # id is auto-created by Django (auto-incrementing integer)
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    album = models.CharField(max_length=200, blank=True)
    duration_seconds = models.IntegerField()
    genre = models.CharField(max_length=50)
    cover_url = models.URLField(blank=True, null=True)
    
    # Created/updated timestamps (optional but useful)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['title']  # Default sort by title
        
    def __str__(self):
        """String representation (useful in admin and debugging)"""
        return f"{self.title} - {self.artist}"
    
class PlaylistTrack(models.Model):
    """
    Tracks currently in the playlist.
    Equivalent to your Prisma PlaylistTrack model.
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, related_name='playlist_names'
    )
    # Relationship to Track
    track = models.ForeignKey(
        Track, 
        on_delete=models.CASCADE,  # Delete playlist items if track is deleted
        related_name='playlist_items'
    )
    
    # Ordering and voting
    #position = models.FloatField()
    votes = models.IntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    is_playing = models.BooleanField(default=False)
    played_at = models.DateTimeField(null=True, blank=True)
    
#     class Meta:
#         ordering = ['position']  # Auto-sort by position
#         #unique_togther = ['user', 'track'] #prevent duplicate tracks per user
        
    def __str__(self):
        return f"{self.track.title} (added by {self.user.username})"