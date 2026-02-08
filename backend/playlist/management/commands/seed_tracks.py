# playlist/management/commands/seed_tracks.py
from django.core.management.base import BaseCommand
from playlist.models import Track

class Command(BaseCommand):
    help = 'Seed the database with sample tracks'

    def handle(self, *args, **kwargs):
        # Clear existing tracks
        Track.objects.all().delete()
        self.stdout.write('Cleared existing tracks')

        # Sample track data (30 tracks)
        tracks_data = [
            # Rock
            {"title": "Bohemian Rhapsody", "artist": "Queen", "album": "A Night at the Opera", "duration_seconds": 355, "genre": "Rock"},
            {"title": "Stairway to Heaven", "artist": "Led Zeppelin", "album": "Led Zeppelin IV", "duration_seconds": 482, "genre": "Rock"},
            {"title": "Hotel California", "artist": "Eagles", "album": "Hotel California", "duration_seconds": 391, "genre": "Rock"},
            {"title": "Sweet Child O' Mine", "artist": "Guns N' Roses", "album": "Appetite for Destruction", "duration_seconds": 356, "genre": "Rock"},
            {"title": "Imagine", "artist": "John Lennon", "album": "Imagine", "duration_seconds": 183, "genre": "Rock"},
            
            # Pop
            {"title": "Billie Jean", "artist": "Michael Jackson", "album": "Thriller", "duration_seconds": 294, "genre": "Pop"},
            {"title": "Like a Prayer", "artist": "Madonna", "album": "Like a Prayer", "duration_seconds": 340, "genre": "Pop"},
            {"title": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars", "album": "Uptown Special", "duration_seconds": 269, "genre": "Pop"},
            {"title": "Shape of You", "artist": "Ed Sheeran", "album": "÷", "duration_seconds": 234, "genre": "Pop"},
            {"title": "Blinding Lights", "artist": "The Weeknd", "album": "After Hours", "duration_seconds": 200, "genre": "Pop"},
            
            # Electronic
            {"title": "One More Time", "artist": "Daft Punk", "album": "Discovery", "duration_seconds": 320, "genre": "Electronic"},
            {"title": "Strobe", "artist": "deadmau5", "album": "For Lack of a Better Name", "duration_seconds": 625, "genre": "Electronic"},
            {"title": "Levels", "artist": "Avicii", "album": "Levels", "duration_seconds": 203, "genre": "Electronic"},
            {"title": "Animals", "artist": "Martin Garrix", "album": "Animals", "duration_seconds": 305, "genre": "Electronic"},
            {"title": "Titanium", "artist": "David Guetta ft. Sia", "album": "Nothing but the Beat", "duration_seconds": 245, "genre": "Electronic"},
            
            # Jazz
            {"title": "Take Five", "artist": "Dave Brubeck", "album": "Time Out", "duration_seconds": 324, "genre": "Jazz"},
            {"title": "So What", "artist": "Miles Davis", "album": "Kind of Blue", "duration_seconds": 563, "genre": "Jazz"},
            {"title": "Fly Me to the Moon", "artist": "Frank Sinatra", "album": "It Might as Well Be Swing", "duration_seconds": 148, "genre": "Jazz"},
            {"title": "Summertime", "artist": "Ella Fitzgerald", "album": "Porgy and Bess", "duration_seconds": 253, "genre": "Jazz"},
            {"title": "Round Midnight", "artist": "Thelonious Monk", "album": "Genius of Modern Music", "duration_seconds": 188, "genre": "Jazz"},
            
            # Classical
            {"title": "Moonlight Sonata", "artist": "Ludwig van Beethoven", "album": "Piano Sonata No. 14", "duration_seconds": 360, "genre": "Classical"},
            {"title": "Four Seasons - Spring", "artist": "Antonio Vivaldi", "album": "The Four Seasons", "duration_seconds": 186, "genre": "Classical"},
            {"title": "Canon in D", "artist": "Johann Pachelbel", "album": "Canon and Gigue", "duration_seconds": 303, "genre": "Classical"},
            {"title": "Für Elise", "artist": "Ludwig van Beethoven", "album": "Bagatelle No. 25", "duration_seconds": 165, "genre": "Classical"},
            {"title": "Ride of the Valkyries", "artist": "Richard Wagner", "album": "Die Walküre", "duration_seconds": 315, "genre": "Classical"},
            
            # Hip Hop
            {"title": "Lose Yourself", "artist": "Eminem", "album": "8 Mile Soundtrack", "duration_seconds": 326, "genre": "Hip Hop"},
            {"title": "HUMBLE.", "artist": "Kendrick Lamar", "album": "DAMN.", "duration_seconds": 177, "genre": "Hip Hop"},
            {"title": "Juicy", "artist": "The Notorious B.I.G.", "album": "Ready to Die", "duration_seconds": 305, "genre": "Hip Hop"},
            {"title": "In Da Club", "artist": "50 Cent", "album": "Get Rich or Die Tryin'", "duration_seconds": 253, "genre": "Hip Hop"},
            {"title": "Sicko Mode", "artist": "Travis Scott", "album": "Astroworld", "duration_seconds": 312, "genre": "Hip Hop"},
            
            # Alternative/Indie
            {"title": "Mr. Brightside", "artist": "The Killers", "album": "Hot Fuss", "duration_seconds": 222, "genre": "Alternative"},
            {"title": "Radioactive", "artist": "Imagine Dragons", "album": "Night Visions", "duration_seconds": 187, "genre": "Alternative"},
            {"title": "Seven Nation Army", "artist": "The White Stripes", "album": "Elephant", "duration_seconds": 231, "genre": "Alternative"},
            {"title": "Do I Wanna Know?", "artist": "Arctic Monkeys", "album": "AM", "duration_seconds": 272, "genre": "Alternative"},
            {"title": "Boulevard of Broken Dreams", "artist": "Green Day", "album": "American Idiot", "duration_seconds": 261, "genre": "Alternative"},
        ]

        # Bulk create tracks
        tracks = [Track(**data) for data in tracks_data]
        Track.objects.bulk_create(tracks)

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(tracks)} tracks!')
        )