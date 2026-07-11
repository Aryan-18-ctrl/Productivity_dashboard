
let dashboard=document.querySelector("#dashboard")
let quote=document.querySelector(".quote")
let pomodoro=document.querySelector(".pomodoro")
let todoSection=document.querySelector(".todoSection")
let plannerSection=document.querySelector(".plannerSection")
let plannerInput=document.querySelectorAll(".plannerdiv input ")
let sectionGoal=document.querySelector(".sectionGoal")
let todoForm=document.querySelector("form")
let tasklistContainer=document.querySelector(".tasklist-container")
const allFeatures = document.querySelector(".allfeatures");
let backToDash=document.querySelector(".icon-back")
let currTime=document.querySelector(".time-box h1");
let currDate=document.querySelector(".time-box p");
let wetherBox=document.querySelector(".weather-box img")
let wetherHead=document.querySelector(".weather-box span")
let wetherMood=document.querySelector(".weather-box  p")
let wetherCity=document.querySelector(".weather-box  #city")
let wetherHumidity=document.querySelector(".weather-box  #humidity")
let weatherWind=document.querySelector(".weather-box  #wind")
let goalInp=document.querySelector(".goal-div input")
let addGoalBtn=document.querySelector(".goal-div button")
const goalList = document.querySelector(".goal-list");
let quotes=document.querySelector(".quote h3");
let author=document.querySelector(".quote p");
let mainBtn=document.querySelector(".quote .mainBtn");
let startBtn=document.querySelector(".pomodoro .start");
let pauseBtn=document.querySelector(".pomodoro .pause");
let resetBtn=document.querySelector(".pomodoro .reset");
let pomoTimer=document.querySelector(".pomodoro h2");
let pomoSessions=document.querySelector(".pomodoro span");
let sessionType=document.querySelector(".pomodoro h3");
let audioPomo=document.querySelector(".audio");
const completedGoalCount = document.querySelector(".goal-progress span:first-child");
const totalGoalCount = document.querySelector(".goal-progress span:last-child");

const themeBtn = document.querySelector(".fa-sun");


//** ------- date time-------


function currDateTime(){
let date=new Date();

currTime.textContent=date.toLocaleTimeString();
currDate.textContent=date.toDateString();

}

currDateTime();
setInterval(currDateTime, 1000);

//*--- am pm---------------

function ampm(){
    let hours=new Date().getHours()

let ampm=hours>=12?"PM":"AM"
if (ampm === "AM") {
    document.body.style.backgroundImage = 'url("./assets/anders-jilden-cYrMQA7a3Wc-unsplash.jpg")';

} else {
const video = document.createElement("video");

video.src = "./assets/nightvid.mp4";
video.autoplay = true;
video.loop = true;
video.muted = true;
video.playsInline = true;
video.id = "bgVideo";

document.body.prepend(video);
}
}
ampm()


//**-----weather fetch------


async function fetchWeatherData() {

  try {

     const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

       let response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=49cb31a900354f5c939195821260507&q=${lat},${lon}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    let data = await response.json();
    // console.log(data)
    wetherBox.src = "https:" + data.current.condition.icon;
    wetherHead.textContent = `${data.current.temp_c}`;
    wetherMood.textContent = data.current.condition.text;
wetherCity.textContent=data.location.name;
weatherWind.textContent=data.current.wind_kph +" km/hr";
wetherHumidity.textContent=data.current.humidity+" %";
  } catch (error) {
    console.error("Error fetching weather:", error);

    wetherHead.textContent = "--";
    wetherMood.textContent = "Unable to fetch weather...";
    wetherCity.textContent="- -";
weatherWind.textContent="_km/hr";
wetherHumidity.textContent="_%";
  }
}
fetchWeatherData();




//**--------- todo  all logic-------



let taskListArr=JSON.parse(localStorage.getItem("todoData")) || []

 function noTask(){
  if(taskListArr.length==0){
    tasklistContainer.innerHTML = `
<div class="task-div">
    <img class="no-task-img" src="./assets/no-task.png" alt="No Task">
    <h3>No Tasks Yet</h3>
    <p>You're all caught up. Add your first task to get started.</p>
</div>
`;
} 

}
noTask()

function addTaskContainer(){
   tasklistContainer.innerHTML=""

taskListArr.forEach((elem)=>{

    tasklistContainer.innerHTML+=`<div class="task-list"  >
      ${elem.markImportant?'<div class="imp-badge">imp</div>':""}  

     <p class="task-text">${elem.task}</p>
    <p class="task-description">${elem.description}</p>
    <div class="btn-div">
  
${!elem.isCompleted?`<button class="completed" data-task-id="${elem.id}">Mark Complete</button>`:`<button class="undo" data-task-id="${elem.id}">Undo complete</button>`}
        <button class="del" data-task-id="${elem.id}">Delete</button>
    </div>
   </div>`
  })
  
noTask()

}
  addTaskContainer();




function handleSublit(e){
  e.preventDefault();


  let task=e.target[0].value;
    let description=e.target[1].value
    let markImportant=e.target[2].checked;

if(task.trim()==="" || description.trim()===""){
  alert("Fields can't be empty");
  return  ;
}



taskListArr.push({
  id:Date.now(),
  task,
  description,
  markImportant,
  isCompleted:false,

})



localStorage.setItem("todoData",JSON.stringify(taskListArr))

addTaskContainer();
showToast("Task Added successfully ✅","#15b371")
todoForm.reset();

}


todoForm.addEventListener("submit",handleSublit)



function handleDelete(e){
let id = Number(e.target.dataset.taskId);
 taskListArr=taskListArr.filter((elem)=>{
  return elem.id!=id
})
localStorage.setItem("todoData",JSON.stringify(taskListArr))

showToast("Task Deleted 🗑️","#C5172E");
addTaskContainer()

}

function handleComplete(e,isComp){
let ids = Number(e.target.dataset.taskId);
let task = taskListArr.find((elem) => elem.id === ids);
    if (!task) return;   

task.isCompleted=isComp
addTaskContainer()

localStorage.setItem("todoData",JSON.stringify(taskListArr));


}



tasklistContainer.addEventListener("click", (e) => {

    if (e.target.classList.contains("del")) {
handleDelete(e)

    }

    if (e.target.classList.contains("completed")) {

handleComplete(e,true)
showToast("Marked as complete ✅","#15b371")


    }

    if (e.target.classList.contains("undo")) {

    handleComplete(e,false)
    showToast("undo complete ✅","#21c1cf")


}



});

//** show toast---------------

let intervalIds;
function showToast(msg,color){
  clearTimeout(intervalIds)
    document.querySelector(".toast").textContent=msg
    document.querySelector(".toast").style.backgroundColor=color
  document.querySelector(".toast").classList.add("show")
     intervalIds=   setTimeout(()=>{
        document.querySelector(".toast").classList.remove("show")

        },1000)
}

// ***---------- planner ----

let plannerData =JSON.parse(localStorage.getItem("allPlnnerData")) || [];
  let timer;
function saveInput(e,elems){

  let plan=e.target.value;
  let timeId=e.target.dataset.time

  clearTimeout(timer);
timer= setTimeout(()=>{

 let existed= plannerData.find((elem)=>elem.timeId ==timeId)
 showToast("Plan Autosaved ✅","#15b371");
if(plan.trim() === ""){
    plannerData = plannerData.filter(
        item => item.timeId !== timeId
    );
}else{
    let existed = plannerData.find(
        item => item.timeId === timeId
    );
        
    if(existed){
        existed.plan = plan;
    }else{
        plannerData.push({ plan, timeId });
    }



}

localStorage.setItem("allPlnnerData",JSON.stringify(plannerData))
},1000)



}

// **show planner data from localStorage--



function showPlan(elem){

 let savedPlan= plannerData.find((item)=>
    item.timeId===elem.dataset.time
  )
if(savedPlan){
  elem.value=savedPlan.plan
}

}

plannerInput.forEach((elem)=>{

  showPlan(elem)

  elem.addEventListener("input",(e)=>{
    saveInput(e,elem)
  })

})

// **-------------goal--------
let goalDataArr=JSON.parse(localStorage.getItem("goalData") ) || []

function renderGoals() {
    goalList.innerHTML = "";

    goalDataArr.forEach((elem) => {
        goalList.innerHTML += `
        <div class="goal-item">
            <p>${elem.goal}</p>

            <div class="goal-btns">

              ${
    elem.isComp
    ? `<button class="goal-undo" data-goal-id="${elem.id}">
            Undo
       </button>`
    : `<button class="goal-complete" data-goal-id="${elem.id}">
            Complete
       </button>`

}

                <i class="fa-solid fa-trash goal-delete"
                   data-goal-id="${elem.id}"></i>

            </div>
        </div>`;
    });


  if(goalDataArr.length==0){
    goalList.innerHTML = `
<div class="task-div">
    <img class="no-task-img" src="./assets/no-task.png" alt="No Task">
<h3>Ready to Set a Goal?</h3>
<p>Your journey starts with one goal. Create it now!</p></div>
`
      }
    }
renderGoals()


function addGoalToList(){


  let goal=goalInp.value;
let id=Date.now()
if(goal.trim()===""){
  alert("Field can't be empty");
  return ;
}
goalDataArr.push({
    goal,
    id,
    isComp: false
})

localStorage.setItem("goalData",JSON.stringify(goalDataArr))
renderGoals()
        updateGoalProgress()
    showToast("Goal addes successfully","#06D001")

goalInp.value=""
}


addGoalBtn.addEventListener("click",addGoalToList)


function handleGoalDelete(e){
let id=Number(e.target.dataset.goalId);
 goalDataArr= goalDataArr.filter((elem)=>elem.id!==id
)

localStorage.setItem("goalData",JSON.stringify(goalDataArr))

renderGoals()
    showToast("Goal deleted  🗑️","#F5004F")
 
}


// Handle Goal Complate


function handleGoalComplete(e, status) {

    let id = Number(e.target.dataset.goalId);

    let goal = goalDataArr.find(elem => elem.id === id);

    if (goal) {
        goal.isComp = status;
    }

    localStorage.setItem("goalData", JSON.stringify(goalDataArr));
    renderGoals();
}



goalList.addEventListener("click", (e) => {

    if (e.target.classList.contains("goal-complete")) {
        handleGoalComplete(e, true);
        updateGoalProgress()

    }

    if (e.target.classList.contains("goal-undo")) {
        handleGoalComplete(e, false);
        updateGoalProgress()

    }

    if (e.target.classList.contains("goal-delete")) {
        handleGoalDelete(e);
        updateGoalProgress()

    }

});

// *----- progress -------

function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 200,
        origin: { y: 0.6 }
    });
}

function updateGoalProgress() {

    let completed = goalDataArr.filter(elem => elem.isComp).length;

    completedGoalCount.textContent = completed;
    totalGoalCount.textContent = goalDataArr.length;

   if (goalDataArr.length > 0 && completed === goalDataArr.length) {
        showConfetti();
    }

}



updateGoalProgress()
//**---- fetching quotes-----

const API_KEY="GTQf/JINg/AhnftR+dZRww==9UY3V6jcocTf88CY";
let isLoading=false;
let fetchQuoteData=async ()=>{
  if(isLoading) return 
  try{
     isLoading = true;
quotes.innerHTML = '<div class="loader"></div>';    author.textContent = "";
    let response=await fetch("https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom",{
    method:"GET",
     headers: {
          "X-Api-Key": API_KEY
        }

  });

  let data=await response.json();
  
  quotes.textContent=data[0].quote;
  author.textContent=`— ${data[0].author}`
  }
  catch(error){
        console.error("Error fetching  quote:", error);

      quotes.textContent="unable to fetch quote...";
  author.textContent=`not getting author`

  }
  finally{
      isLoading = false;

}
}
mainBtn.addEventListener("click",fetchQuoteData)


// **---pomodoro---------------

let minute = 25;
let seconds = 0;
let sessions = 0;
let intervalId;
let isWorkSession = true;


function updateDisplay() {
  pomoTimer.textContent =
    `${String(minute).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {

  clearInterval(intervalId);

  intervalId = setInterval(() => {

    updateDisplay();
        sessionType.textContent = "🍅 Work Session";

    if (minute === 0 && seconds === 0) {

            audioPomo.play();



      if (isWorkSession) {

        sessions++;
        pomoSessions.textContent = sessions + " 🍅";

        isWorkSession = false;

        minute = 5;
        seconds = 0;

        sessionType.textContent = "☕ Break Session";

      } else {

        isWorkSession = true;

        minute = 25;
        seconds = 0;

        sessionType.textContent = "🍅 Work Session";
clearInterval(intervalId)
      }

      updateDisplay(); 
      return;
    }

    else if (seconds === 0) {

      minute--;
      seconds = 59;

    }

    else {

      seconds--;

    }

  }, 1000);

}


function pauseTimer() {

  clearInterval(intervalId);

}

function resetTimer() {

  clearInterval(intervalId);

  minute = 25;
  seconds = 0;

  isWorkSession = true;
sessions = 0
  sessionType.textContent = "🍅 Work Session";
    pomoSessions.textContent = "0 🍅";
  updateDisplay();

}

updateDisplay();

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);






//  SPA  part------------------


function  showSection(show=dashboard){
    dashboard.classList.add("hidden");
  todoSection.classList.add("hidden");
plannerSection.classList.add("hidden");
sectionGoal.classList.add("hidden")
  quote.classList.add("hidden");
    pomodoro.classList.add("hidden");

    show.classList.remove("hidden");

}


allFeatures.addEventListener("click", (e) => {
    if (e.target.closest(".todo")) {
        showSection(todoSection);
        document.title="todo"
    }
    else if (e.target.closest(".planner")) {
        showSection(plannerSection);
                document.title="Daily planner"

    }
    else if (e.target.closest(".dailygoals")) {
        showSection(sectionGoal);
                document.title="Daily Goals"

    }
    else if (e.target.closest(".pomodorocard")) {
        showSection(pomodoro);
    }
    else if (e.target.closest(".quotess")) {
        showSection(quote);
                document.title="Motivational quotes"

    }

});



document.addEventListener("click", (e) => {
    if (e.target.closest(".icon-back")) {
        showSection(dashboard);
    }
});



// mode 

let savedTheme =localStorage.getItem("theme") || "";

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.classList.remove("fa-sun");
    themeBtn.classList.add("fa-moon");

} else {
    document.body.classList.remove("dark");
    themeBtn.classList.remove("fa-moon");
    themeBtn.classList.add("fa-sun");
}


themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
   if (document.body.classList.contains("dark")) {
    themeBtn.classList.remove("fa-sun")
        themeBtn.classList.add("fa-moon")

        localStorage.setItem("theme", "dark");
    } else {
          themeBtn.classList.remove("fa-moon")
        themeBtn.classList.add("fa-sun")
        localStorage.setItem("theme", "light");
    }


})