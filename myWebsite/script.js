
//new add tasks function, checkbox appends before task 
function addTask() {
    var taskInput = document.getElementById('taskInput');  // get the user text input 
    var taskList = document.getElementById('taskList'); // get the list
    var maxNum = 6; //maximum number of tasks

    if (taskInput.value.trim() !== '' && taskList.children.length < maxNum) {  //If the input is not empty and tasks do not exceed max value, add task to list
        
        var li = document.createElement('li'); //create a new list item

        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkboxContainer'; //class for checkboxdiv
        var checkbox = document.createElement('input'); //create input 
        checkbox.type = 'checkbox'; //set input type to checkbox
        checkbox.className = 'taskCheckbox'; 

        checkboxDiv.appendChild(checkbox); //append checckbox
        var taskTextSpan = document.createElement('span'); //span element to hold tasks 
        taskTextSpan.className = 'taskText'; 
        taskTextSpan.textContent = taskInput.value; //whatever has been written into the input
        li.appendChild(checkboxDiv);
        li.appendChild(taskTextSpan);
        taskList.appendChild(li);
        taskInput.value = ''; //clear the input box after task is added 

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                li.style.textDecoration = 'line-through'; //use css linethrough to cross out task
                setTimeout(function() {
                    li.remove(); //remove task ..... 
                }, 300);  // ..after 3 milliseconds
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

//event listener for save click on tasks, used to set "type"
document.getElementById('taskSave').addEventListener('click', function() {
saveData('tasks');
});

//event listener for save click on notes, used to set "type"
document.getElementById('saveNotes').addEventListener('click', function() {
saveData('notes'); 
});

//New Save Data function for flexible use: 
//Get the data from taskList OR NoteList, Type is set by event listeners and passed to function
function saveData(type){
    alert(`saveData called with type: ${type}`); // checking data type for error debugging 

    //set empty array for use
    var jsonData = []; 

    var jsonDataType;

    var downloadConfirm = confirm("Do you want to proceed with downloading your " + type + "?"); //js alert asking if they want to download notes/tasks


    //conditional logic for if the data is gathered from tasks or notes 
if (downloadConfirm){ //if user confirms download, continue inner function if not do nothing


    if (type === "tasks"){
    jsonDataType = document.getElementById('taskList'); //if the type is tasks then gather data from "tasksList" and store 


      for (var i = 0; i <jsonDataType.children.length; i++){ //itterate through task list as long as i is less than task list
         var currentData = jsonDataType.children[i]; //get the current task item and store in currentData
                jsonData.push(currentData.textContent); //push collected task(s) to jsondata array to be used in download 
      }

    } 
   
    if (type === "notes") { //if the type is notes then gather data from notes list

        jsonDataType = document.getElementById('notesList').value; //get entire value of the text area(notesList) defined in html

        if (jsonDataType=="") { //if empty return (no download) 

            alert('Error: Notes are empty.'); //error message as js alert
             return;

        }

        jsonData.push(jsonDataType); //push to jsonData array to be used later, in download

     }

     if (jsonData.length == 0) { //if empty return (no download) 

        alert('Error: Tasks are empty.'); //error message as js alert
        return;

    }
}
 
 var dataJSON = JSON.stringify({ [type]: jsonData }); //convert data to json string and format 
 var blob = new Blob([dataJSON], { type: "application/json" }); //create blob
 var link = document.createElement("a"); //create anchor to be used in download
 var url = URL.createObjectURL(blob); //generate url from the blob
 link.setAttribute("href", url); //set href 
 link.setAttribute("download", type + ".json");  //specifcy download and file type
 document.body.appendChild(link); //temporarily store link 
 link.click(); //download trigger
 document.body.removeChild(link);  //remove link for efficiency 

}

// Attach change event listener to file input for handling file uploads
document.getElementById('fileInput').addEventListener('change', function() {
    var file = fileInput.files[0]; //get the first file from the file input

    if (file) { //if a file has been selected 
        var reader = new FileReader(); //create a file reader object 
        reader.onload = function(loadEvent) { //onload event listener to check when the file has been read 
            var content = loadEvent.target.result; // retreives the contents of the file 
            try {
                var uploads = JSON.parse(content); //parse json file 

                if (uploads.tasks) { //if the upload is tasks, determined via content structure/formatting

                    displayTasks(uploads.tasks); //call display tasks function to display tasks 
                }
                if (uploads.notes) { //if the upload is tasks, determined via content structure/formatting
                    displayNotes(uploads.notes); //call displayNotes function to display notes 
                }
            } catch (error) {
                console.error("Error parsing JSON:", error); //if the preceeding failed throw an error 
                alert('Error parsing uploaded file.'); //error message as js alert 
            }
        };
        reader.readAsText(file); //start reading file as text string
    } else {
        alert('Please select a file first!'); // if no file was selected show message using js alert 
    }
});



document.getElementById('taskUpload').addEventListener('click', function() { //event listener for taksk upload button
    document.getElementById('fileInput').click(); 
});
 
document.getElementById('notesUpload').addEventListener('click', function() { //event listener for notesupload button
    document.getElementById('fileInput').click();
});


function displayTasks(tasks) { //function with tasks passed to it
    const taskList = document.getElementById('taskList'); //get the task list 
    taskList.innerHTML = ''; //clear task list 

    tasks.forEach(task => { //for each task extracted do the following
        const li = document.createElement('li'); //create list element
        const checkbox = document.createElement('input'); //create input
        checkbox.type = 'checkbox';  // set input to checkbox type
        checkbox.className = 'taskCheckbox'; //class for styling checkbox

        const textSpan = document.createElement('span'); //span element
        textSpan.textContent = task; //span element holds task(s)

        checkbox.addEventListener('change', function() { //detect change in input state (checked or unchecked box)
            if (checkbox.checked) { //if the box is checked ..
                li.classList.add('linethrough'); //add line through, css (cross out)
                setTimeout(function() {
                    li.remove(); // remove task.. after 3milliseconds, for smoothness 
                }, 300);
            }
        });

        li.appendChild(checkbox); 
        li.appendChild(textSpan); 

        taskList.appendChild(li); 
    });
}

function displayNotes(notes) { //function with notes from file passed to it

    const notesList = document.getElementById('notesList'); //get the notes list element where the notes will be uploaded and displaued 
    const allNotes = notes; //add all elements of notes (array) into one string called "allNotes"
    notesList.value = allNotes; //overwrite notesList value with the elements that have been added to allNotes 
}

// Working with the countdown timer 
let currentTime = null; // current time in seconds
let interval = null; //initalise interval for counting down timer 
let timerRunning = false;

const timerElement = document.getElementById('timer'); ///get the timer display 
const tenButton = document.getElementById('ten'); //get 10 min button
const twentyButton = document.getElementById('twenty'); //get 20 min button
const thirtyButton = document.getElementById('thirty'); // get 30mnin button
const startButton =document.getElementById('start'); //get start
const stopButton = document.getElementById('stop'); //get stop button 
const resetButton = document.getElementById('reset') //get reset button

var timerEndSound = new Audio("520672__funzerker__birds.wav"); 

function updateTimer(time) {
    const minutes = Math.floor(time / 60); //calculate the minutes
    const seconds = time % 60; //calculate the seconds 
    const formattedTime = timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; //formatting to show 00:00

    //If the modal is open, update timer there too 
    var modalTimerDisplay = document.getElementById('modalTimerDisplay');//get modal timer 
    if (modalTimerDisplay) {
        modalTimerDisplay.textContent = formattedTime; //update the time with "formattedTime"
    }
}

tenButton.addEventListener('click', function() { //event listener for 10 min button
    currentTime = 0.05 * 60; //set current time to 10 mins
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
    timerRunning = true; 
});

function countDown() {  //function for counting down 
    if(interval){ //check if an interval is already running
        clearInterval(interval); // if an interval is already running clear it 
    }

    interval = setInterval(() => {  //set interval 
        currentTime -= 1; // -1 second to current time 
        if (currentTime <=0){ //if the time is less than or equal to 0 
            clearInterval(interval) //clear the interval
            countReset() //call function to set timer back to 00:00 
            timerEndSound.play();
            var endSession = alert("Time's up! Please reset the timer if you wish to continue studying") //js pop up awaiting user confirmation
        }
 
            timerEndSound.pause(); //pause sound
            timerEndSound.currentTime = 0; //reset sound to 0 (start of sound)

        updateTimer(currentTime); //update the time being displayed
    }, 1000); // repeat this function every second 
}

stopButton.addEventListener('click', countPause); //when the stop button is clicked pause the timer

function countPause() { 
    if (interval) { 
        clearInterval(interval); //clear the interval 
        interval = null; //reset the interval
    }
}

function countReset () { //function to reset count to 00:00
    
        clearInterval(interval); //clear the interval (to stop counting)
        interval = null; //reset the interval 
        currentTime = 0; // Set current time to 0
        updateTimer(currentTime);//update timer
    
}
resetButton.addEventListener('click', countReset); //call function to reset timer to 00:00 when reset button is clicked 

//**********************MODAL STUFF***********************************************/ 

var modal = document.getElementById("myModal"); //get the modal
var btn = document.getElementById("listButton"); //get the button that triggers the opening of the modal
var webContent =document.getElementById("mainContent"); //this contains all the content on the website beside the modal
var span = document.getElementsByClassName("close")[0];  //close button 

btn.onclick = function() {
    
    var taskList = document.getElementById('timer'); 
    var modalContentContainer = document.getElementById('modalContentContainer');
    modal.style.display = "block"; 
    mainContent.classList.add("blurred"); //when the modal is open blur the MainContent of the website behind it  
}
// when the close button is clicked
span.onclick = function() {
  modal.style.display = "none"; //don't display the modal
  webContent.classList.remove("blurred"); //remove the blurred effect from the maincontent of the website behind it 
}

//when anywhere other than the modal is clicked
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none"; //don't display the modal
    webContent.classList.remove("blurred"); //remove the blurred effect from the maincontent of the website behind it
  }
} 


btn.onclick = function() {
    //the modal timer display is updated when the modal opens
    updateTimer(currentTime);
    modal.style.display = "block";
    webContent.classList.add("blurred");
};






