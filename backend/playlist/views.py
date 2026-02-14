from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from .models import Track, PlaylistTrack, Vote
from django.db.models import Exists, OuterRef
from django.contrib.auth.models import User
from .serializers import UserSerializer, TrackSerializer, PlaylistTrackSerializer
from .utils import calculate_position

# ####AUTH
# POST /api/user/register
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes= [AllowAny] 

class TrackListView(APIView):
    def get(self, request, format=None):
        permission_classes=[IsAuthenticated]
        tracks = Track.objects.all()
        serializer = TrackSerializer(tracks, many=True)
        return Response(serializer.data)
    
    
class PlaylistListCreateView(APIView):
    def get(self, request, format=None):
        permission_classes=[IsAuthenticated]
        playlist = PlaylistTrack.objects.select_related('track').annotate(
            has_voted=Exists(
                Vote.objects.filter(user=request.user, playlist_track=OuterRef('pk'))
            )
        )
        serializer = PlaylistTrackSerializer(playlist, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        permission_classes=[IsAuthenticated]
        track_id = request.data.get('track_id')
        track = Track.objects.get(id=track_id)
        if PlaylistTrack.objects.filter(track_id=track_id).exists():
            return Response({"error": "track already in playlist"})
        
        playlist_item = PlaylistTrack.objects.create(track=track, user=request.user)
        serializer = PlaylistTrackSerializer(playlist_item)
        return Response(serializer.data)
    
class PlaylistDetailView(APIView):    
    def delete(self, reqeust, pk):
        permission_classes=[IsAuthenticated]
        playlist_item = PlaylistTrack.objects.get(id=pk)
        playlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PlaylistUpvoteView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        #playlist_item = PlaylistTrack.objects.get(id=pk)
        playlist_item = PlaylistTrack.objects.annotate(
            has_voted=Exists(Vote.objects.filter(user=request.user, playlist_track=OuterRef('pk')))
        ).get(id=pk)



        if Vote.objects.filter(user=request.user, playlist_track=playlist_item).exists():
            return Response({"error": "already liked by user"}, status=status.HTTP_400_BAD_REQUEST)
        

        vote_item = Vote.objects.create(user=request.user, playlist_track=playlist_item)
        playlist_item.votes += 1
        playlist_item.save()
        serializer = PlaylistTrackSerializer(playlist_item)
        
        return Response(serializer.data)

class PlaylistDownvoteView(APIView):
    permission_classes=[IsAuthenticated]
    
    def put(self, request, pk):
        #playlist_item = PlaylistTrack.objects.get(id=pk)
        playlist_item = PlaylistTrack.objects.annotate(
            has_voted=Exists(Vote.objects.filter(user=request.user, playlist_track=OuterRef('pk')))
        ).get(id=pk)
        
        if Vote.objects.filter(user=request.user, playlist_track=playlist_item).exists():
            return Response({"error": "already liked by user"}, status=status.HTTP_400_BAD_REQUEST)

        vote_item = Vote.objects.create(user=request.user, playlist_track=playlist_item)
        playlist_item.votes -= 1
        playlist_item.save()
        serializer = PlaylistTrackSerializer(playlist_item)
        return Response(serializer.data)

        
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_tracks(request):
#     tracks = Track.objects.all()
#     serializer = TrackSerializer(tracks, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_playlist(request):
#     """Get current playlist"""
#     # select_related('track') = SQL JOIN (prevents N+1 queries)
#     playlist = PlaylistTrack.objects.select_related('track').all()
#     serializer = PlaylistTrackSerializer(playlist, many=True)
#     return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_to_playlist(request):
#     track_id = request.data.get('track_id')
#     track = Track.objects.get(id=track_id)
#     # user_id = request.data.get('user_id')
#     # user = User.objects.get(id=user_id)
#     if PlaylistTrack.objects.filter(track_id=track_id).exists():
#         return Response({"error": "Track already in playlist"})
    
#     playlist_item = PlaylistTrack.objects.create(track=track, user=request.user)
#     serializer = PlaylistTrackSerializer(playlist_item)
#     return Response(serializer.data)

# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def delete_from_playlist(request, pk):
#     playlist_item = PlaylistTrack.objects.get(id=pk)
#     playlist_item.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def upvote_on_track(request, pk):
#     playlist_item = PlaylistTrack.objects.get(id=pk)
#     playlist_item.votes += 1
#     playlist_item.save()
#     serializer = PlaylistTrackSerializer(playlist_item)
#     return Response(serializer.data)

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def downvote_on_track(request, pk):
#     playlist_item = PlaylistTrack.objects.get(id=pk)
#     playlist_item.votes -= 1
#     playlist_item.save()
#     serializer = PlaylistTrackSerializer(playlist_item)
#     return Response(serializer.data)

    
# @api_view(['POST'])
# def add_to_playlist(request):
#     """
#     Add track to playlist.
#     Prisma equivalent: prisma.playlistTrack.create({ data: {...} })
#     """
#     track_id = request.data.get('track_id')
#     added_by = request.data.get('added_by', 'Anonymous')
    
#     # Validation
#     if not track_id:
#         return Response(
#             {"error": "track_id is required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Check if track exists
#     try:
#         track = Track.objects.get(id=track_id)
#     except Track.DoesNotExist:
#         return Response(
#             {"error": "Track not found"},
#             status=status.HTTP_404_NOT_FOUND
#         )
    
#     # Check if already in playlist
#     if PlaylistTrack.objects.filter(track_id=track_id).exists():
#         return Response(
#             {"error": "Track already in playlist"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Calculate position (add to end)
#     last_item = PlaylistTrack.objects.order_by('position').first()
#     new_position = (last_item.position + 1) if last_item else 1.0
    
#     # Create playlist item
#     playlist_item = PlaylistTrack.objects.create(
#         track=track,
#         position=new_position,
#         added_by=added_by
#     )
    
#     serializer = PlaylistTrackSerializer(playlist_item)
#     return Response(serializer.data, status=status.HTTP_201_CREATED)

# @api_view(['PATCH'])
# def update_playlist_item(request, pk):
#     """
#     update playlist item postion or playing status
#     express:
#     app.patch('/api/playlist/:id', async (req,res) => {
#         const item = await prisma.playlistTrack.update({
#             where: { id: req.params.id },
#             data: req.body
#         });
#     })
#     """
#     try:
#         item = PlaylistTrack.objects.get(pk=pk)
#     except PlaylistTrack.DoesNotExist:
#         return Response(
#             {"error": "Playlist item not found"},
#             status=status.HTTP_404_NOT_FOUND
#         )
        
#     #update position for drag and drop
#     if 'position' in request.data:
#         new_position = float(request.data['position'])
#         item.position = new_position
#         item.save()
        
#     # Update playing status
#     if 'is_playing' in request.data:
#         is_playing = request.data['is_playing']
        
#         if is_playing:
#             # Ensure only one track is playing
#             with transaction.atomic():
#                 PlaylistTrack.objects.filter(is_playing=True).update(is_playing=False)
#                 item.is_playing = True
#                 item.save()
#         else:
#             item.is_playing = False
#             item.save()
    
#     serializer = PlaylistTrackSerializer(item)
#     return Response(serializer.data) 

# @api_view(['POST'])
# def vote_on_track(request, pk):
#     try:
#         item = PlaylistTrack.objects.get(pk=pk)
#     except PlaylistTrack.DoesNotExist:
#         return Response(
#             {"error": "Playlist item not found"},
#             status=status.HTTP_404_NOT_FOUND
#         )
        
#     direction = request.data.get('direction')
#     if direction not in ['up', 'down']:
#         return Response(
#             {"error": "direction must be 'up' or 'down'"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
        
#     #update vote count
#     if direction == 'up':
#         item.votes += 1
#     else:
#         item.votes -= 1
        
#     item.save()
#     serializer = PlaylistTrackSerializer(item)
#     return Response(serializer.data)

# @api_view(['DELETE'])
# def delete_track(request, pk):
#     try:
#         item = PlaylistTrack.objects.get(pk=pk)
        
#     except PlaylistTrack.DoesNotExist:
#         return Response(
#             {"error": "Playlist Track Not Found"},
#             status = status.HTTP_400_BAD_REQUEST 
#         )
        
#     item.delete()
#     return Response(status= status.HTTP_204_NO_CONTENT)

# @api_view(['POST'])
# def reorder_playlist_item(request, pk):
#     try:
#         item = PlaylistTrack.objects.get(pk=pk)
#     except PlaylistTrack.DoesNotExist:
#         return Response(
#             {"error": "Playlist Track Not Found"},
#             status = status.HTTP_400_BAD_REQUEST
#         )
        
#     target_index = request.data.get(target_index)
#     if target_index is None:
#         return Response(
#             {"error": "Playlist track_index not found"},
#             status = status.HTTP_400_BAD_REQUEST
#         )
#     #exclude item id from that track of the playlist
#     playlist = list(
#         PlaylistTrack.objects
#         .exclude(pk=pk)
#         .order_by('position')
#         .values_list('id', 'position')
#     )
#     if target_index == 0:
#         prev_pos = None
#         next_pos = playlist[0][1] 

      
# ####TRACKS
# #list and create tracks
# ##GET /tracks/ => return the tracks of the entire database
# class TrackListCreate(generics.ListCreateAPIView):
#     queryset = Track.objects.all()
#     serializer_class = TrackSerializer
#     permission_classes = [AllowAny]
    
# ####PLAYLIST
# #add to playlist
# ## GET /api/playlist = list's users playlist
# ## POST /api/playlist = Add track to users playlist
# class PlaylistTrackListCreate(generics.ListCreateAPIView):
#     serializer_class = PlaylistTrackSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         #filter query by user
#         user = self.request.user
#         return PlaylistTrack.objects.filter(user=user)

#     def perform_create(self, serializer):
#         if serializer.is_valid():
#             serializer.save(user=self.request.user)
#         else:
#             print(serializer.errors) 
        
# #PATCH /playlist/<id>
# class PlaylistTrackUpdateView(generics.UpdateAPIView):
#     serializer_class = PlaylistTrackSerializer
#     permission_classes = [IsAuthenticated]
    
#     #users can only update their own playlist
#     def get_queryset(self):
#         user = self.request.user
#         return PlaylistTrack.objects.filter(user=user)

    
# #DELETE /playlist/<id>
# class PlaylistTrackDeleteView(generics.DestroyAPIView):
#     serializer_class = PlaylistTrackSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         user = self.request.user
#         return PlaylistTrack.objects.filter(user=user)
    