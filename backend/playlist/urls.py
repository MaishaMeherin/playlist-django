#playlist/urls.py
from django.urls import path
from . import views


urlpatterns = [   
    path('user/me/', views.CurrentUserView.as_view()),
    # tracks library
    #path('tracks/', views.TrackListCreate.as_view(),name="track-list"),
    # path('tracks/', views.get_tracks, name='get_tracks'),
    path('tracks/', views.TrackListView.as_view()),

    
    #playlist CRUD
    # path('playlist/', views.PlaylistTrackListCreate.as_view(), name='playlist-list'),
    # path('playlist/delete/<int:pk>', views.PlaylistTrackDeleteView.as_view()),
    path('playlist/', views.PlaylistListCreateView.as_view()),
    path('playlist/delete/<int:pk>/', views.PlaylistDetailView.as_view()),
    path('playlist/upvote/<int:pk>/', views.PlaylistUpvoteView.as_view()),
    path('playlist/downvote/<int:pk>/', views.PlaylistDownvoteView.as_view()), 
    
    path('history/', views.HistoryListCreateView.as_view()),
    
    # path('playlist/', views.get_playlist, name="get_playlist"),
    # path('playlist/add/', views.add_to_playlist, name='add_to_playlist'),
    # path('playlist/delete/<int:pk>/', views.delete_from_playlist, name='delete_playlist'),
    # path('playlist/upvote/<int:pk>/', views.upvote_on_track, name="upvote_track"),
    # path('playlist/downvote/<int:pk>/', views.downvote_on_track, name="downvote_track"),
    # path('playlist/<int:pk>/', views.update_playlist_item),
    # path('playlist/<int:pk>/vote', views.vote_on_track),
    #path('playlist/<int:pk>/reorder', views.reorder_playlist_item)
]