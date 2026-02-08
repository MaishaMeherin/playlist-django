collaborative-playlist/
├── backend/                    # Express API
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── package.json
├── frontend/                   # Next.js/React
│   ├── src/
│   ├── pages/
│   └── package.json
└── docker-compose.yml

playlist-django/
├── backend/                    # Django API    
│   ├── manage.py
│   ├── playlist_backend/      # Project config
│   ├── playlist/              # App (feature module)
│   ├── requirements.txt
│   └── venv/
├── frontend/                   # React (your existing knowledge)
│   ├── src/
│   └── package.json
└── docker-compose.yml

# PHASE 1: Environment Setup
### 1. Install Python & verify: python3 --version
### 2. Create isolated environment
python3 -m venv venv
source venv/bin/activate 

- Mental model:
venv = your node_modules folder
Activating = making Python use local packages only
pip = npm

### 3. Install Django:
// Express: node_modules is local to project
npm install express  // installs to ./node_modules

// Django: venv is local to project
pip install django  // installs to ./venv/lib/python3.x/site-packages

pip install django djangorestframework django-cors-headers channels channels-redis

#### Save dependencies (like package.json)
pip freeze > requirements.txt

- Comparison:
requirements.txt = your package.json
But it's auto-generated, not hand-written

- Why this matters:
venv = isolated package space (like node_modules)
Without activation, Python uses global packages
Each project gets its own dependency sandbox


### 4. Create Project Structure
django-admin startproject playlist_backend .
*The dot (.) means "create in current directory"

**What this creates:**
backend/
├── db.sqlite3                 # Database file (like Prisma's dev.db)
├── manage.py                    # CLI tool (like npm scripts)
└── playlist_backend/            # Project config package
    ├── __init__.py              # Makes it a Python package
    ├── settings.py              # All configuration (env, db, apps)
    ├── urls.py                  # Root URL router
    ├── asgi.py                  # Async server (for WebSocket)
    └── wsgi.py                  # Standard server (for HTTP)
├── requirements.txt           # ✓ Dependencies saved
└── venv/                      # ✓ Active virtual environment

### 5. Set up playlist_backend/settings.py
 
### 6. First run: python manage.py runserver

### 7. Apply Initial Migration: python manage.py migrate
*Create database tables for Django's built-in apps
python manage.py migrate

#### open SQLite Shell: python manage.py dbshell
#### List tables: sqlite> .tables

## Django Commands:
python manage.py runserver     # npm run dev
python manage.py migrate        # npx prisma migrate dev
python manage.py makemigrations # npx prisma migrate dev --name
python manage.py test           # npm test
python manage.py shell          # node (REPL)

## Key Concepts:
- Enviroment: venv + pip
- Start server: python manage.py runserver
- Configuration: (.env)
    - settings.py
- Routing: app.use('/api', router)
    - urlpatterns in urls.py = list of routes
    - path() = route definitions
- Database: Prisma schema
    - Django model
- Middleware: app.use(middleware)
    - middleware in settings


# PHASE-2: FIRST DJANGO APP & API ENDPOINT
### Django Pattern:
playlist_backend/           # PROJECT (global config)
├── settings.py             # What apps exist?
├── urls.py                 # Where do requests go?
└── asgi.py

playlist/                   # APP (feature module)
├── models.py               # Database models
├── views.py                # Request handlers
├── urls.py                 # App-specific routes
└── serializers.py          # JSON conversion

### Step 1: Generate the App
python manage.oy startapp playlist

backend/
├── playlist/                    # ← NEW APP
│   ├── __init__.py              # Makes it a Python package
│   ├── admin.py                 # Admin panel config (Phase 4)
│   ├── apps.py                  # App configuration
│   ├── models.py                # Database models (Phase 3)
│   ├── tests.py                 # Tests (Phase 9)
│   ├── views.py                 # Request handlers ← WE'LL USE THIS NOW
│   └── migrations/              # Database migrations
│       └── __init__.py
├── playlist_backend/            # Project config
└── manage.py

### Step-2: Register the app in playlist_backend/settings.py in INSTALLED_APPS

### Step-3: First View: playlist/views.py
- router.get('/', ...) |  @api_view(['GET']) | Restrict to GET requests
- (req, res) => | def get_tracks(request):  |  Handler function
- res.json(data)  | return Response(data) | Return JSON response

### Step-4: URL Routing
#### 4.1: create app level urls: playlist/urls.py
```
urlpatterns = [
    path('tracks/', views.get_tracks),  # Relative to include point
]
```
#### 4.2: connect to project urls: playlist_backend/urls.py 
```urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('playlist.urls')),  # ← ADD THIS LINE
]
```

- The complete URL FLOW:
User visits: http://localhost:8000/api/tracks/

1. Django receives request
   ↓
2. Checks playlist_backend/urls.py
   → Finds: path('api/', include('playlist.urls'))
   → Remaining path: 'tracks/'
   ↓
3. Checks playlist/urls.py
   → Finds: path('tracks/', views.get_tracks)
   → Match! Execute views.get_tracks
   ↓
4. views.get_tracks runs
   → Returns Response(tracks_data)
   ↓
5. Django converts to JSON HTTP response
   → Client receives: [{"id": "track-1", ...}]

- Working endpoints:
1. GET /api/tracks/ - Returns track library
2. GET /api/playlist/ - Returns empty playlist (for now)
3. POST /api/playlist/add/ - Mock add to playlist

# PHASE-3: DATABASE MODELS
### Step-1: create models Track and Playlist in playlist/models.py
- ForeignKeyCreates relationship to Track (like Prisma @relation)
- on_delete=CASCADEIf Track deleted → delete PlaylistTrack too
- related_nameReverse lookup: track.playlist_items.all()
- class MetaModel configuration (ordering, indexes, etc.)
- __str__()How object appears in admin/debug (like toString())

### Step-2: Create and run Migrations
python manage.py makemigrations

### Step-3: Inspect migrations
cat playlist/migrations/0001_initial.py

### Step-4: Apply Migrations
python manage.py migrate

### Step-5: verify database tables
python manage.py dbshell

in SQLite Shell:
.tables
-- You should see: playlist_track, playlist_playlisttrack

.schema playlist_track
-- Shows the CREATE TABLE statement

.quit

- Concept of Migration Workflow:
In Express:                                                                                                              
    1. Edit schema.prisma
    2. Generate migration
    npx prisma migrate dev --name add_votes

    3. Migration auto-applies
    4. Regenerate Prisma Client
    npx prisma generate

In Django:
1. Edit models.py
2. Generate migration
python manage.py makemigrations

3. Apply migration (separate step!)
python manage.py migrate

4. No "generate client" step - Django ORM is always ready

backend/
├── playlist/
│   ├── models.py              # ✓ Track and PlaylistTrack defined
│   ├── migrations/
│   │   └── 0001_initial.py    # ✓ Database schema created
│   └── views.py
├── db.sqlite3                 # ✓ Database file with tables
└── manage.py

# PHASE-4: Django Admin, Serializers & Real Database Queries
### Step-1: Create Admin User
python manage.py createsuperuser

alternative:
python manage.py shell
```
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Delete old admin if exists
    User.objects.filter(username='admin').delete()

    # Create new superuser
    user = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='password123'
    )
    print(f"Created superuser: {user.username}")
    exit()
```

### Step-2: Register Models in Admin in playlist/admin.py

### Step-3: Start server and access admin
python manage.py runserver

### Step-4: Seed data
#Create directories
mkdir -p playlist/management/commands

#Create __init__.py files (makes them Python packages)
touch playlist/management/__init__.py
touch playlist/management/commands/__init__.py

#### 4.1: create a seed command: playlist/management/commands/seed_tracks.py

#### 4.2: run the seed:
python manage.py seed_tracks

### Step-5: Create DRF Serializers in playlist/serializers.py
- it handles Model -> JSON conversion
- JSON -> Model conversion (validation)
- Nested relationships
- Custom field transformation
#### 5.1: create serializer in playlist/serializers.py
#### 5.2: update with real database queries in Views playlist/views.py
```
@api_view(['GET'])
def get_tracks(request):
    """
    Get all available tracks from database.
    Prisma equivalent: prisma.track.findMany()
    """
    tracks = Track.objects.all()
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)
```

### Step-6: Start server: python manage.py runserver
#### 6.1: Test GET /api/tracks/


 