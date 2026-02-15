from django.contrib import admin
from .models import Track, PlaylistTrack, Vote, History

# # Register your models here.
admin.site.register(Track)
# class TrackAdmin(admin.ModelAdmin):
#     """
#         Configure how Track appears in admin panel.Like building a custom admin UI, but Django does it for you!
#         # Columns to display in list view
#         list_display = ['title', 'artist', 'album', 'genre', 'duration_seconds']
        
#         # Add filters in sidebar
#         list_filter = ['genre', 'created_at']
        
#         # Add search functionality
#         search_fields = ['title', 'artist', 'album']
        
#         # Fields to show when editing
#         fields = ['title', 'artist', 'album', 'duration_seconds', 'genre', 'cover_url']
        
#         # How many items per page
#         list_per_page = 50
#     """
    
admin.site.register(PlaylistTrack)
admin.site.register(Vote)
admin.site.register(History)
# class PlaylistTrackAdmin(admin.ModelAdmin):
#     """
#         Configure how PlaylistTrack appears in admin panel.
#     """
#     # Columns to display
#     list_display = ['get_track_title', 'position', 'votes', 'is_playing', 'added_by', 'added_at']
    
#     # Make these editable directly in list view
#     list_editable = ['position', 'votes', 'is_playing']
    
#     # Filters
#     list_filter = ['is_playing', 'added_at']
    
#     # Sort by position by default
#     ordering = ['position']
    
#     # Custom method to display track title
#     def get_track_title(self, obj):
#         return obj.track.title
#     get_track_title.short_description = 'Track'  # Column header name