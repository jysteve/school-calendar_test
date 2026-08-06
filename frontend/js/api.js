// frontend/js/api.js

const BASE_URL = "http://localhost:8000"; // FastAPI 서버 주소

// 수행평가 등록 (POST)
// assData: { title, subject, grade, class_num, date, description }
export async function postAssessment(assData) {
  const res = await fetch(`${BASE_URL}/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assData),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`등록 실패: ${err}`);
  }
  return await res.json();
}

// 특정 학년/반 수행평가 조회 (GET)
// grade, classNum: 정수
export async function getAssessmentsByClass(grade, classNum) {
  const res = await fetch(`${BASE_URL}/assessments/${grade}/${classNum}`);
  if (!res.ok) {
    throw new Error(`조회 실패: ${res.status}`);
  }
  return await res.json(); // JSON 배열 반환
}

// 전체 수행평가 조회 (선택적)
export async function getAllAssessments() {
  const res = await fetch(`${BASE_URL}/assessments`);
  if (!res.ok) {
    throw new Error(`전체 조회 실패: ${res.status}`);
  }
  return await res.json();
}

export async function getSubjects(grade, classNum) {
    const res = await fetch(`${BASE_URL}/subjects/${grade}/${classNum}`);

    if (!res.ok) {
        throw new Error(`과목 조회 실패: ${res.status}`);
    }

    return await res.json();
}