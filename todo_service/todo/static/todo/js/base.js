'use strict';

const uri_api = 'api/v1/todo';

const FILTER_DIV_GROUP = ".todo__body__filter";
const CSS_CLASS_FILTER_SELECTED = "filter__selected";
const ID_FILTER_BUTTON_ALL = "filter_button_all";
const ID_FILTER_BUTTON_ACTIVE = "filter_button_active";
const ID_FILTER_BUTTON_COMPLITED = "filter_button_complited";

const CSS_CLASS_PREVIEW_MODE = ".preview__mode";
const CSS_CLASS_ADVANCED_MODE = ".advanced__mode";
const CSS_CLASS_EDIT_MODE = ".edit__mode";

const CSS_CLASS_COMPLETED_TASK = 'completed_task';

const TAG_TASKS = '#tasks_list';

let tasksList = [];
let FILTER_SELECTED = ID_FILTER_BUTTON_ACTIVE ; // DEFAULT

function addTaskInnerHTML(itemTask,filterIdSelected=ID_FILTER_BUTTON_ACTIVE) {
    if (filterIdSelected == ID_FILTER_BUTTON_ALL)
        document.querySelector(TAG_TASKS).innerHTML += buildTaskPreviewMode(itemTask);
    if (filterIdSelected == ID_FILTER_BUTTON_ACTIVE && !itemTask.is_completed)
        document.querySelector(TAG_TASKS).innerHTML += buildTaskPreviewMode(itemTask);
    if (filterIdSelected == ID_FILTER_BUTTON_COMPLITED && itemTask.is_completed)
        document.querySelector(TAG_TASKS).innerHTML += buildTaskPreviewMode(itemTask);
}

function displayItems(data,filterIdSelected=ID_FILTER_BUTTON_ACTIVE) {
    document.querySelector(TAG_TASKS).innerHTML = "";
    tasksList = data;
    // data[0].forEach((itemTask) => addTaskInnerHTML(itemTask,filterIdSelected));
    if(data.length)
        // data[0].map( (itemTask) => () => addTaskInnerHTML(itemTask,filterIdSelected));
        data[0].forEach((itemTask) => addTaskInnerHTML(itemTask,filterIdSelected));
}


function getGroups(filterIdSelected=FILTER_SELECTED) {
    fetch(uri_api)
        .then(response => response.json())
        .then(data => displayItems(data,filterIdSelected))
        .catch(error => console.error('Unable to get items.', error));
}

function buildTaskEditMode(itemTask) {
    return `
    <div id=${itemTask.id}>
        <div class="edit__mode">
            <div class="task_data"> 
                <input class="${itemTask.is_completed ? CSS_CLASS_COMPLETED_TASK : ''}" type="text" value="${itemTask.title}">
            </div>
            <div class="task_buttons">
                <div class="task__button__cancel" >
                    <button onclick="button_cancel_EDITMODE(${itemTask.id})">X</button>
                </div>
                <div class="task__button__accept">
                    <button onclick="button_accept_EDITMODE(${itemTask.id})">OK</button>
                </div>
            </div>
        </div> 
    </div> 
    `;
}


function buildTaskPreviewMode(itemTask) {
    return `
    
    <div id=${itemTask.id}>
        <div class="preview__mode">
            <button class="${itemTask.is_completed ? CSS_CLASS_COMPLETED_TASK : ''}" onclick="button_PREVIEWMODE(${itemTask.id})">${itemTask.title}</button>
        </div>
    </div>
    `;
}
/* <button class="back_button__advanced__mode${itemTask.is_completed ? ' '+CSS_CLASS_COMPLETED_TASK : ''}" onclick="button_cancel_ADVANCEDMODE(${itemTask.id})">${itemTask.title}</button> */
/* <span class="${itemTask.is_completed ? ' '+CSS_CLASS_COMPLETED_TASK : ''}" onclick="button_cancel_ADVANCEDMODE(${itemTask.id})">${itemTask.title}</span> */
{/* <button class="back_button__advanced__mode${itemTask.is_completed ? ' '+CSS_CLASS_COMPLETED_TASK : ''}" 
                    onclick="button_cancel_ADVANCEDMODE(${itemTask.id})">
                    ${itemTask.title}
                </button> */}
// <span class="${itemTask.is_completed ? CSS_CLASS_COMPLETED_TASK : ''}">${itemTask.title}</span>
function buildTaskAdvancedMode(itemTask) {
    return `
    <div id=${itemTask.id}>
        <div class="advanced__mode">
            <div class="task_data"> 
                <span class="${itemTask.is_completed ? ' '+CSS_CLASS_COMPLETED_TASK : ''}" 
                    onclick="button_cancel_ADVANCEDMODE(${itemTask.id})">
                    ${itemTask.title}
                </span> 
            </div>
            <div class="task_buttons">
                <div class="task__button__del" >
                    <button onclick="button_delete_ADVANCEDMODE(${itemTask.id})">DEL</button>
                </div>
                <div class="task__button__edit">
                    <button onclick="button_edit_ADVANCEDMODE(${itemTask.id})">EDIT</button>
                </div>
                <div class="task__button__done">
                    <button onclick="${itemTask.is_completed ? 'button_undone_ADVANCEDMODE' : 'button_done_ADVANCEDMODE'}(${itemTask.id})">
                    ${itemTask.is_completed ? 'X' : 'DONE'}
                    </button>
                </div>
            </div>
        </div>
    </div> 
    `;
}

function buildButtonFilterAll(filterId) {
    return `
    <div id="${ID_FILTER_BUTTON_ALL}" class="${filterId == ID_FILTER_BUTTON_ALL ? CSS_CLASS_FILTER_SELECTED : ''}">
        <button onclick="buildButtonsFilters(${ID_FILTER_BUTTON_ALL})">All</button>
    </div>
    `;
}

function buildButtonFilterActive(filterId) {
    return `
    <div id="${ID_FILTER_BUTTON_ACTIVE}" class="${filterId == ID_FILTER_BUTTON_ACTIVE ? CSS_CLASS_FILTER_SELECTED : ''}">
        <button onclick="buildButtonsFilters(${ID_FILTER_BUTTON_ACTIVE})" class="filter.center">Active</button>
    </div>
    `;
}

function buildButtonFilterCompleted(filterId) {
    return `
    <div id="${ID_FILTER_BUTTON_COMPLITED}" class="${filterId == ID_FILTER_BUTTON_COMPLITED ? CSS_CLASS_FILTER_SELECTED : ''}">
        <button onclick="buildButtonsFilters(${ID_FILTER_BUTTON_COMPLITED})">Completed</button>
    </div>
    `;
}


// ID_FILTER_BUTTON_ALL
// ID_FILTER_BUTTON_ACTIVE
// ID_FILTER_BUTTON_COMPLITED
function buildButtonsFilters(filterIdSelected=FILTER_SELECTED){
    if(filterIdSelected.id != undefined) filterIdSelected = filterIdSelected.id;
    document.querySelector(FILTER_DIV_GROUP).innerHTML = "";
    document.querySelector(FILTER_DIV_GROUP).innerHTML += buildButtonFilterActive(filterIdSelected);
    document.querySelector(FILTER_DIV_GROUP).innerHTML += buildButtonFilterCompleted(filterIdSelected);
    document.querySelector(FILTER_DIV_GROUP).innerHTML += buildButtonFilterAll(filterIdSelected);
    displayItems(tasksList,filterIdSelected);
    FILTER_SELECTED=filterIdSelected;
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
            .then(() => getGroups())
            // .then(data => item[0].id = data)
            // .then(addTaskInnerHTML(item))
            .catch(error => console.error('Unable to add item.', error))
           
    }
    
    newTaskTitle.value = "";
}


function getTaskAttributes_PREVIEWMODE(id){
    const divTask = document.getElementById(id);
    if(Boolean(divTask.querySelector(CSS_CLASS_PREVIEW_MODE))){
        const itemTask = {
            id: id,
        }
        itemTask['title'] = divTask.childNodes[1].textContent.trim();
        itemTask['is_completed'] = Boolean(divTask.querySelector('.'+CSS_CLASS_COMPLETED_TASK));
        return itemTask;
    } else return null;  
}

function getTaskAttributes_EDITMODE(id){
    const divTask = document.getElementById(id+'');
    if(Boolean(divTask.querySelector(CSS_CLASS_EDIT_MODE))){
        const itemTask = {
            id: id,
        }
        itemTask['title'] = divTask.childNodes[1].childNodes[1].childNodes[1].childNodes[1].value.trim();
        itemTask['is_completed'] = Boolean(divTask.querySelector('.'+CSS_CLASS_COMPLETED_TASK));
        return itemTask;
    } else return null;  
}


function getTaskAttributes_ADVANCEDMODE(id){
    const divTask = document.getElementById(id+'');
    if(Boolean(divTask.querySelector(CSS_CLASS_ADVANCED_MODE))){
        const itemTask = {
            id: id,
        }
        itemTask['title'] = divTask.childNodes[1].childNodes[1].childNodes[1].textContent.trim();
        itemTask['is_completed'] = Boolean(divTask.querySelector('.'+CSS_CLASS_COMPLETED_TASK));
        return itemTask;
    } else return null;  
}


function button_done_ADVANCEDMODE(id) {
    id = id+''
    const divTask = document.getElementById(id);
    if(divTask)
    {
        task_completed_changestatus(id)
    } 
}

function button_undone_ADVANCEDMODE(id) {
    id = id+''
    const divTask = document.getElementById(id);
    if(divTask)
    {
        task_completed_changestatus(id, false)
    } 
}

function button_edit_ADVANCEDMODE(id) {
    id = id+''
    let itemTask = {}
    const divTask = document.getElementById(id);
    if(divTask)
    {
        itemTask = getTaskAttributes_ADVANCEDMODE(id);
        divTask.innerHTML = buildTaskEditMode(itemTask)
    } 
}

function button_cancel_ADVANCEDMODE(id) {
    id = id+''
    let itemTask = {}
    const divTask = document.getElementById(id);
    if(divTask)
    {
        itemTask = getTaskAttributes_ADVANCEDMODE(id);
        divTask.innerHTML = buildTaskPreviewMode(itemTask)
    } 
}

function button_cancel_EDITMODE(id) {
    id = id+''
    let itemTask = {}
    const divTask = document.getElementById(id);
    if(divTask) {
        itemTask = getTaskAttributes_EDITMODE(id);
        divTask.innerHTML = buildTaskPreviewMode(itemTask)
    }
}


function button_PREVIEWMODE(id) {
    id = id+''
    let itemTask = {}
    const divTask = document.getElementById(id);
    if(divTask) {
        itemTask = getTaskAttributes_PREVIEWMODE(id);
        divTask.innerHTML = buildTaskAdvancedMode(itemTask)
    } 
}

function button_delete_ADVANCEDMODE(id) {
    const divTask = document.getElementById(id);
    fetch(`${uri_api}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(() => getGroups())
    .then(() => divTask.outerHTML = "")
    .catch(error => console.error(`Unable to delete file ${id}`, error))
}

    




function button_accept_EDITMODE(id) {
    id=id+'';
    let itemTask = getTaskAttributes_EDITMODE(id);

    if (itemTask.title){
        fetch(uri_api+`/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemTask)
        })
            .then(response => response.json())
            .then(() => getGroups())
            .catch(error => console.error('Unable to add item.', error));
    }
}


function task_completed_changestatus(id,taskStatus = true) {
    id=id+'';
    let itemTask = getTaskAttributes_ADVANCEDMODE(id);
    itemTask["is_completed"] = taskStatus;

    if (itemTask.title){
        fetch(uri_api+`/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemTask)
        })
            .then(response => response.json())
            .then(() => getGroups())
            .catch(error => console.error('Unable to add item.', error));
    }
}

