// frontend/js/calendar.js
import {
    postAssessment,
    getAssessmentsByClass,
    getSubjects
}
from "./api.js";

let currentDate = new Date();

const monthTitle=document.getElementById("monthTitle");
const form = document.getElementById("assForm");
const daysContainer = document.getElementById("days");
const filterGrade = document.getElementById("filterGrade");
const filterClass = document.getElementById("filterClass");
const gradeSelect = document.getElementById("grade");
const classSelect = document.getElementById("class");
const gradeInput = document.getElementById("grade");
const classInput = document.getElementById("class");
const subjectSelect = document.getElementById("subject");

function reloadCalendar(){

    loadList(

        parseInt(filterGrade.value),

        parseInt(filterClass.value)

    );

}

filterGrade.addEventListener("change", reloadCalendar);
filterClass.addEventListener("change", reloadCalendar);

function createCalendar(){

    daysContainer.innerHTML="";

    const year=currentDate.getFullYear();

    const month=currentDate.getMonth();

    monthTitle.textContent=
        `${year}년 ${month+1}월`;

    const firstDay=
        new Date(year,month,1).getDay();

    const lastDate=
        new Date(year,month+1,0).getDate();

    const prevLastDate=
        new Date(year,month,0).getDate();

    const today=new Date();

    // 총 42칸 생성
    for(let i=0;i<42;i++){

        const day=document.createElement("div");

        day.className="day";

        let number;

        let isCurrentMonth=true;

        if(i<firstDay){

            number=
                prevLastDate-firstDay+i+1;

            isCurrentMonth=false;

        }
        else if(i>=firstDay+lastDate){

            number=
                i-(firstDay+lastDate)+1;

            isCurrentMonth=false;

        }
        else{

            number=i-firstDay+1;

        }

        if(!isCurrentMonth){

            day.classList.add("other-month");

        }

        if(

            isCurrentMonth &&

            number===today.getDate() &&

            month===today.getMonth() &&

            year===today.getFullYear()

        ){

            day.classList.add("today");

        }

        day.dataset.day=number;

        day.dataset.current=isCurrentMonth;

        day.innerHTML=`
            <div class="date">${number}</div>
            <div class="events"></div>
        `;

        daysContainer.appendChild(day);

    }

}

async function loadList(grade, classNum) {
  // API 호출 후 결과를 목록에 표시
  daysContainer.innerHTML = "";
  try {
    const items = await getAssessmentsByClass(grade, classNum);
    if (items.length === 0) {
      daysContainer.innerHTML = "<p>조회된 일정이 없습니다.</p><br>";
      return;
    }
    createCalendar();

items.forEach(item=>{

    const itemDate=new Date(item.date);

    if(

        itemDate.getMonth()!==currentDate.getMonth()

        ||

        itemDate.getFullYear()!==currentDate.getFullYear()

    ){

        return;

    }

    const day=itemDate.getDate();

    const boxes=
        document.querySelectorAll(".day");

    boxes.forEach(box=>{

        if(

            box.dataset.current==="true"

            &&

            parseInt(box.dataset.day)===day

        ){

            const event=document.createElement("div");

            event.className="event";

            event.textContent=
                `${item.subject} ${item.title}`;

            box.querySelector(".events")
                .appendChild(event);

        }

    });

});
  } catch (error) {
    daysContainer.innerHTML = `<p>오류: ${error.message}</p>`;
  }
}

// 폼 제출 처리
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // 입력값 수집
  const assData = {
    grade: parseInt(document.getElementById("grade").value),
    class_num: parseInt(document.getElementById("class").value),
    subject: document.getElementById("subject").value,
    title: document.getElementById("title").value,
    date: document.getElementById("date").value,
    description: document.getElementById("description").value,
  };
  try {
    const result = await postAssessment(assData);
    alert("등록 성공: " + result.title);
    form.reset();
    // 등록 후 최신 리스트 로드
    loadList(assData.grade, assData.class_num);
  } catch (err) {
    alert(err);
  }
});

// 조회 버튼 처리
function loadCurrent(){

    const grade=filterGrade.value;

    const classNum=filterClass.value;

    loadList(grade,classNum);

}

filterGrade.addEventListener("change",loadCurrent);

filterClass.addEventListener("change",loadCurrent);

// 이전, 다음 달 버튼 처리
document.getElementById("prevMonth")
.addEventListener("click",()=>{

    currentDate.setMonth(currentDate.getMonth()-1);

    reloadCalendar();

});

document.getElementById("nextMonth")
.addEventListener("click",()=>{

    currentDate.setMonth(currentDate.getMonth()+1);

    reloadCalendar();

});

//오늘 버튼
document
.getElementById("todayBtn")
.addEventListener("click",()=>{

    currentDate=new Date();

    reloadCalendar();

});

//과목 자동 생성
async function loadSubjects(){

    const grade =
        document.getElementById("grade").value;

    const classNum =document.getElementById("class").value.replace("반","");

    const select =
        document.getElementById("subject");

    const subjects =
        await getSubjects(grade,classNum);

    select.innerHTML="";

    subjects.forEach(s=>{

        const option =
            document.createElement("option");

        option.value=s.subject;

        option.textContent=s.subject;

        option.dataset.color=s.color;

        select.appendChild(option);

    });

}

gradeSelect.addEventListener("change", loadSubjects);

classSelect.addEventListener("change", loadSubjects);



// 초기 목록 로드
reloadCalendar();
loadSubjects();