# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.assessment import router as assessment_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정: 프런트엔드(로컬)에서도 호출 가능하도록 Origin 허용
origins = [
    "http://127.0.0.1:8001",
    "http://localhost:8001",
    "http://localhost:8001/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 라우터 등록
app.include_router(assessment_router)

# 기본 라우트(테스트용)
@app.get("/")
def root():
    return {"message": "Server is running"}
