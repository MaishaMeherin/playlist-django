# playlist/management/commands/seed_tracks.py
import requests
import time
from django.core.management.base import BaseCommand
from playlist.models import Track

JAMENDO_CLIENT_ID = "fbc12aa7"  # Get from https://developer.jamendo.com/v3.0

# Tracks from Jamendo community page
TRACK_NAMES = [
    ("All In My Mind", "Aled Edwards"),
    ("Host", "Color Out"),
    ("Do I", "Zara Arshakian"),
    ("Sake Bomb", "Tab"),
    ("Alone", "Color Out"),
    ("You'll Be Fine", "ErickFill"),
    ("Tantalizing Youth", "Social Square"),
    ("Molotov Heart", "Radio Nowhere"),
    ("Criminal", "Axl & Arth"),
    ("Chocolate", "Alfonso Lugo"),
    ("Blind girl", "Zero-Project"),
    ("The Deep", "Anitek"),
    ("Find A Way", "The DLX"),
    ("No Rest Or Endless Rest", "Lisofv"),
    ("Work N' Play", "Samie Bower"),
    ("B U R N", "Bessonn&Sa"),
    ("Blood", "All My Friends Hate Me"),
    ("Confession", "Quesabe"),
    ("Limes", "Little Suspicions"),
    ("In My Mind", "Laminar"),
    ("Tiptoe", "Rivers And Leaves"),
    ("Monday 8am", "Kinematic"),
    ("Who Called Who", "Samie Bower"),
    ("A Moment in Time", "Graham Coe"),
    ("Time Bomb", "The Spin Wires"),
    ("Fire", "Seth Power"),
    ("Polaris", "So Far As I Know"),
    ("What Do You Know", "Explosive Ear Candy"),
    ("hipnotised", "Nayah"),
    ("Strong", "Jekk"),
    ("Crazy Glue", "Melanie Ungar"),
    ("Out of Air", "Sydney Leigh"),
    ("Flowers Of September", "The Tangerine Club"),
    ("Last Song", "The Jaygles"),
    ("Survive", "Jekk"),
    ("Talk a Little", "Samie Bower"),
    ("Roses", "Jekk"),
    ("Around The Corner", "Infraction"),
    ("No Prayers", "Pokki DJ"),
    ("Give Yourself Away", "Mickey Blue"),
    ("Fallen Star", "AJC & The Envelope Pushers"),
    ("Constellate", "Fleurie"),
    ("The Heat", "Sam Garbett"),
    ("Give U My Name", "Jyant"),
    ("Two Kids", "The DLX"),
    ("Lemon Pop", "The Verandas"),
    ("Flame Up", "ilyab"),
    ("Falcon 69", "The Easton Ellises"),
    ("Lover", "Square A Saw"),
    ("Stay Up", "All My Friends Hate Me"),
]


class Command(BaseCommand):
    help = 'Seed the database with tracks from Jamendo API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--client-id',
            type=str,
            help='Jamendo API client ID (overrides the one in the script)',
        )

    def handle(self, *args, **kwargs):
        client_id = kwargs.get('client_id') or JAMENDO_CLIENT_ID

        if client_id == "your_client_id_here":
            self.stdout.write(self.style.ERROR(
                'Set your Jamendo client ID!\n'
                'Get one free at: https://developer.jamendo.com/v3.0\n'
                'Then either:\n'
                '  1. Edit JAMENDO_CLIENT_ID in this file, or\n'
                '  2. Run: python manage.py seed_tracks --client-id YOUR_ID'
            ))
            return

        Track.objects.all().delete()
        self.stdout.write('Cleared existing tracks')

        created = 0
        for title, artist in TRACK_NAMES:
            track_data = self.fetch_from_jamendo(title, artist, client_id)
            if track_data:
                Track.objects.create(**track_data)
                created += 1
                self.stdout.write(f'  Added: {track_data["title"]} - {track_data["artist"]}')
            else:
                self.stdout.write(self.style.WARNING(f'  Not found: {title} - {artist}'))

            time.sleep(0.5)  # Rate limit: don't spam the API

        self.stdout.write(self.style.SUCCESS(f'\nDone! Created {created}/{len(TRACK_NAMES)} tracks.'))

    def fetch_from_jamendo(self, title, artist, client_id):
        try:
            res = requests.get('https://api.jamendo.com/v3.0/tracks/', params={
                'client_id': client_id,
                'format': 'json',
                'limit': 1,
                'search': f'{title} {artist}',
                'include': 'musicinfo',
            })
            data = res.json()
            results = data.get('results', [])

            if not results:
                return None

            track = results[0]
            tags = track.get('musicinfo', {}).get('tags', {})
            genre = (tags.get('genres', [None]) or [None])[0] or 'Unknown'

            return {
                'title': track['name'],
                'artist': track['artist_name'],
                'album': track.get('album_name', ''),
                'duration_seconds': int(track['duration']),
                'genre': genre.capitalize(),
                'audio_url': track['audio'],
                'cover_url': track['album_image'],
            }
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  API error for {title}: {e}'))
            return None
