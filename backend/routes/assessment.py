# backend/routes/assessment.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from backend.database import supabase

router = APIRouter()

# Pydantic 모델 정의
class AssessmentCreate(BaseModel):
    title: str
    subject: str
    grade: int
    class_num: int
    date: date
    description: Optional[str] = None

class Assessment(BaseModel):
    id: int
    title: str
    subject: str
    grade: int
    class_num: int
    date: date
    description: Optional[str] = None

# **조회:** 전체 또는 학년/반별 조회
@router.get("/assessments", response_model=List[Assessment])
def get_all_assessments():
    # 전체 일정 조회 (날짜 오름차순 정렬)
    response = supabase.table("assessments") \
                        .select("*") \
                        .order("date") \
                        .execute()
    return response.data

@router.get("/assessments/{grade}/{class_num}", response_model=List[Assessment])
def get_assessments_by_class(grade: int, class_num: int):
    # 특정 학년/반 일정 조회
    response = supabase.table("assessments") \
                        .select("*") \
                        .eq("grade", grade) \
                        .eq("class_num", class_num) \
                        .order("date") \
                        .execute()
    return response.data

@router.post("/assessments", response_model=Assessment)
def create_assessment(ass: AssessmentCreate):
    data = ass.model_dump()

    if data.get("date"):
        data["date"] = data["date"].isoformat()

    try:
        response = supabase.table("assessments") \
                            .insert(data) \
                            .select("id, title, subject, grade, class_num, date, description") \
                            .execute()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return response.data[0]

@router.get("/subjects/{grade}/{class_num}")
def get_subjects(grade: int, class_num: int):

    response = (
        supabase
        .table("subjects")
        .select("*")
        .eq("grade", grade)
        .eq("class_num", class_num)
        .order("subject")
        .execute()
    )

    return response.data