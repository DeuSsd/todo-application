'use strict';

const uri_api = 'api/v1/todo';
let taskGroups = [];

function addTaskInnerHTML(item,tag='#tasks_list') {
    document.querySelector(tag).innerHTML += buildTaskPreviewMode(item);
}

function displayItems(data) {
    data.forEach(item => addTaskInnerHTML(item));
    taskGroups = data;
}


function getGroups() {
    fetch(uri_api)
        .then(response => response.json())
        .then(data => displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

// function buildTasks(itemTask) {
//     return `
//     <div id=${itemTask.id}>
//         <li>${itemTask.title}</li> 
//     </div>
//     `;
// }

function buildTaskEditMode(itemTask) {
    return `
    <div id=${itemTask.id} class="edit__mode">
        <div class="task_data"> 
            <input type="text" value="${itemTask.title}">
        </div>
        <div class="task_buttons">
            <div class="task__button__cancel" >
                <button >X</button>
            </div>
            <div class="task__button__agree">
                <button >OK</button>
            </div>
        </div>
    </div> 
    `;
}


function buildTaskPreviewMode(itemTask) {
    return `
    <div id=${itemTask.id} class="preview_mode">
        <button>${itemTask.title}</button>
    </div>
    `;
}

function buildTaskAdvancedMode(itemTask) {
    return `
    <div id=${itemTask.id} class="advanced__mode">
        <div class="task_data"> 
            <span>${itemTask.title}</span>
        </div>
        <div class="task_buttons">
            <div class="task__button__del" >
                <button >DEL</button>
            </div>
            <div class="task__button__edit">
                <button >EDIT</button>
            </div>
            <div class="task__button__done">
                <button >OK</button>
            </div>
        </div>
    </div> 
    `;
}








function addTask() {
    const newTaskTitle = document.getElementById('#newtask_title');


    const item = {
        id: 0,
        title: newTaskTitle.value.trim()
    };
    if (item.title){
        fetch(uri_api, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => response.json())
            .then(data => item.id = data)
            .then(() => addTaskInnerHTML(item))
            .catch(error => console.error('Unable to add item.', error));
    }
    newTaskTitle.value = "";
}
