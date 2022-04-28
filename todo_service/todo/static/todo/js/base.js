'use strict';

const uri_api = 'api/v1/todo';
let taskGroups = [];

function addTaskInnerHTML(item,tag='#tasks_list') {
    document.querySelector(tag).innerHTML += buildTasks(item);
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

function buildTasks(itemTask) {
    return `
    <div>
        <li id=${itemTask.id}>${itemTask.title}</li> 
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
