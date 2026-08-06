from pathlib import Path
from dotenv import load_dotenv
import os
from supabase import create_client, Client

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL과 SUPABASE_KEY를 .env에 설정하세요")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)