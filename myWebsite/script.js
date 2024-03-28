function addTask() { // adds a user's task to the task-list if existing tasks does not exceed limit
    var taskInput = document.getElementById('taskInput'); // get the user text input 
    var taskList = document.getElementById('taskList'); // get the list
    var maxNum = 6; //maximum number of tasks

    if (taskInput.value.trim() !== ''&& taskList.children.length < maxNum) { //If the input is not empty and tasks do not exceed max value, add task to list
        //create a new list item
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(taskInput.value));

        taskInput.value = ''; // clear the input box after a task is added
        
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; //define input as check box 
        checkbox.className = 'taskCheckbox'; //check box class 
        li.appendChild(checkbox); //append checkbox to task

        taskList.appendChild(li); // add new task to the list 

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                li.classList.add('linethrough'); // when the check box is ticked, cross out the task using css class
                setTimeout(function() {
                    li.remove();  // remove task.. after 3milliseconds
                }, 300); 
            }
        });
        
}
}


function clearTasks() {
  // Show confirmation pop up to warn the user
  var confirmClear = confirm("You are about to erase all tasks, are you sure you want to do this?"); //js pop up warning message
  // Check if the user clicked ok, if so continue function 
  if (confirmClear) {
  var taskList = document.getElementById('taskList') //get list 
  taskList.innerHTML = ''; //replace the list with '' to clear it 
}
}

function saveTasks(){
var confirmsave= confirm("You are about to save your to-do list to your desktop, are you sure you want to do this?"); //js pop up warning message
var taskList = document.getElementById('taskList'); //get task list
var tasks = [];  //empty array 
for (var i = 0; i <taskList.children.length; i++){ //itterate through task list as long as i is less than task list
  var currentTask = taskList.children[i] //get the current task item
  tasks.push(currentTask.textContent) //push collected task(s) to task array
  
}

var tasksJSON = JSON.stringify({ tasks: tasks }); //create object tasks and convert to json string format 
var blob = new Blob([tasksJSON], { type: "application/json" }); //create blob to hold json data/ tasks
var link = document.createElement("a"); //anchor for creating link 
var url = URL.createObjectURL(blob);   //create url for blob
link.setAttribute("href", url); //set href 
link.setAttribute("download", "tasks.json");// set the file name for the download
document.body.appendChild(link); //append link so it's clickable
link.click(); //download trigger
}


// for uploading old tasks - **** needs more case handeling **** /file size/.json extension/format of file/check for exe 
document.addEventListener('DOMContentLoaded', function() { //check dom has loaded before executing function
    document.getElementById('uploadButton').addEventListener('click', function() { //event listener; when upload button is clicked, trigger function
        var fileInput = document.getElementById('fileInput'); //retrieve the file by its ID
        var file = fileInput.files[0]; //retrieve the first file chosen by user

        if (file) { 
            var reader = new FileReader(); //file reader object, for reading content/tasks of the selected file
            reader.onload = function(e) {
                var content = e.target.result;
                var tasks = JSON.parse(content).tasks; // extract the tasks array


                displayTasks(tasks); //call function to add each task to the dom 
            };
            reader.readAsText(file); //read the file 
        } else {
            alert('Please select a file first!');
        }
    });

    function displayTasks(tasksArray) { // call displaytasks function
        const taskList = document.getElementById('taskList'); //get task list
        taskList.innerHTML = ''; // clear existing tasks list before replacing with uploaded/old
        tasksArray.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task; 

            var checkbox = document.createElement('input'); //create an input for check box
            checkbox.type = 'checkbox'; //define input type as check box
            checkbox.className = 'taskCheckbox';
            li.appendChild(checkbox);  //append checkbox to each task
            taskList.appendChild(li); 
        });
    }
});

// Working with the countdown timer 
let currentTime = 0; // current time in seconds
let interval = 0; //initalise interval for counting down timer 

const timerElement = document.getElementById('timer'); ///get the timer display 
const tenButton = document.getElementById('ten'); //get 10 min button
const twentyButton = document.getElementById('twenty'); //get 20 min button
const thirtyButton = document.getElementById('thirty'); // get 30mnin button
const startButton =document.getElementById('start'); //get start

function updateTimer(time) {
    const minutes = Math.floor(time / 60); //calculate the minutes
    const seconds = time % 60; //calculate the seconds 
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; //formatting to display in 00:00
}

tenButton.addEventListener('click', function() { //event listener for 10 min button
    currentTime = 10 * 60; //set current time to 10 mins
    updateTimer(currentTime); //update the current time

});

twentyButton.addEventListener('click',function(){ //event listener for 20min button
    currentTime = 20*60; //set current time to 20 mins
    updateTimer(currentTime); //update the current time
});

thirtyButton.addEventListener('click', function(){ //event listener for 30min button
    currentTime = 30*60; //set current time to 30mins
    updateTimer(currentTime); //update current time

});

startButton.addEventListener('click', function(){
    countDown(); //call countdown function when the start button is clicked 
});

function countDown() { //function for counting down seconds
    setInterval(function() {
            currentTime -= 1; //update current time by -1 
            updateTimer(currentTime); //display new time by using updateTimer function
    }, 1000); 
}

