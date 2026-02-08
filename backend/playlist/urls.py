#playlist/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # tracks library
    #path('tracks/', views.TrackListCreate.as_view(),name="track-list"),
    path('tracks/', views.get_tracks, name='get_tracks'),
    
    #playlist CRUD
    # path('playlist/', views.PlaylistTrackListCreate.as_view(), name='playlist-list'),
    # path('playlist/delete/<int:pk>', views.PlaylistTrackDeleteView.as_view()),
    
    path('playlist/', views.get_playlist, name="get_playlist"),
    path('playlist/add/', views.add_to_playlist, name='add_to_playlist'),
    # path('playlist/<int:pk>/', views.update_playlist_item),
    # path('playlist/<int:pk>/vote', views.vote_on_track),
    # path('playlist/<int:pk>/delete', views.delete_track),
    #path('playlist/<int:pk>/reorder', views.reorder_playlist_item)
]