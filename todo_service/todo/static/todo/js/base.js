'use strict';

/* This scripts contain auto-comments */

/* Defining constants. */
const uri_api = 'api/v1/todo';

const FILTER_DIV_GROUP = ".todo_body__filter";
const CSS_CLASS_FILTER_SELECTED = "todo_body__filter__selected";

const ID_FILTER_BUTTON_ALL = "todo_body__filter_button__all";
const ID_FILTER_BUTTON_ACTIVE = "todo_body__filter_button__active";
const ID_FILTER_BUTTON_COMPLITED = "todo_body__filter_button__complited";

const CSS_CLASS_PREVIEW_MODE = ".task__preview_mode";
const CSS_CLASS_ADVANCED_MODE = ".task__advanced_mode";
const CSS_CLASS_EDIT_MODE = ".task__edit_mode";

const CSS_CLASS_COMPLETED_TASK = 'completed_task';

const TAG_TASKS = '#tasks_list';


let tasksList = [];
let FILTER_SELECTED = ID_FILTER_BUTTON_ACTIVE; // DEFAULT

/**
 * If the filter is all, add the task to the list. If the filter is active and the task is not
 * completed, add the task to the list. If the filter is completed and the task is completed, add the
 * task to the list.
 * @param itemTask - the object that contains the task data
 * @param [filterIdSelected] - the id of the filter button that was clicked
 */
function addTaskInnerHTML(itemTask, filterIdSelected = ID_FILTER_BUTTON_ACTIVE) {
    if (filterIdSelected == ID_FILTER_BUTTON_ALL)
        document.querySelector(TAG_TASKS).innerHTML += buildTaskPreviewMode(itemTask);
    if (filterIdSelected == ID_FILTER_BUTTON_ACTIVE && !itemTask.is_completed)
        document.querySelector(TAG_TASKS).innerHTML += buildTaskPreviewMode(itemTask);
    if (filterIdSelected == ID_FILTER_BUTTON_COMPLITED && itemTask.is_completed)
        document.querySelector(TAG_TASKS).innerHTML += buildTaskPreviewMode(itemTask);
}

/**
 * If the data array has a length, then for each item in the first element of the data array, add the
 * task to the inner HTML of the tasks element.
 * @param data - is an array of arrays, each array contains the tasks of a specific category.
 * @param [filterIdSelected] - the id of the filter button that was clicked.
 */
function displayItems(data, filterIdSelected = ID_FILTER_BUTTON_ACTIVE) {
    document.querySelector(TAG_TASKS).innerHTML = "";
    tasksList = data;
    if (data.length)
        data[0].forEach((itemTask) => addTaskInnerHTML(itemTask, filterIdSelected));
}


/**
 * Get the data from the API, then display the items, then catch any errors.
 * @param [filterIdSelected] - the id of the filter selected
 */
function getGroups(filterIdSelected = FILTER_SELECTED) {
    fetch(uri_api)
        .then(response => response.json())
        .then(data => displayItems(data, filterIdSelected))
        .catch(error => console.error('Unable to get items.', error));
}

/**
 * It takes an object as an argument and returns a string of HTML.
 * @param itemTask - {
 * @returns A string of HTML code.
 */
function buildTaskEditMode(itemTask) {
    return `
    <div id=${itemTask.id}>
        <div class="task__edit_mode">
            <div class="task__data"> 
                <input class="${itemTask.is_completed ? CSS_CLASS_COMPLETED_TASK : ''}" type="text" value="${itemTask.title}">
            </div>
            <div class="task__buttons">
                <div class="task__edit_mode__button_cancel" >
                    <button onclick="button_cancel_EDITMODE(${itemTask.id})">X</button>
                </div>
                <div class="task__edit_mode__button_accept">
                    <button onclick="button_accept_EDITMODE(${itemTask.id})">OK</button>
                </div>
            </div>
    </div> 
    `;
}


/**
 * This function takes in an object and returns a string of HTML that represents a task in preview
 * mode.
 * @param itemTask - {
 * @returns A string of HTML code.
 */
function buildTaskPreviewMode(itemTask) {
    return `
    
    <div id=${itemTask.id}>
        <div class="task__preview_mode">
            <button 
            class="${itemTask.is_completed ? CSS_CLASS_COMPLETED_TASK : ''} 
            " onclick="button_PREVIEWMODE(${itemTask.id})">
                ${itemTask.title}
            </button>
        </div>
    </div>
    `;
}


/**
 * It takes an object as an argument and returns a string of HTML.
 * @param itemTask - {
 * @returns A string of HTML code.
 */
function buildTaskAdvancedMode(itemTask) {
    return `
    <div id=${itemTask.id}>
        <div class="task__advanced_mode">
            <div class="task__data"> 
                <span class="${itemTask.is_completed ? ' '+CSS_CLASS_COMPLETED_TASK : ''}" 
                onclick="button_cancel_ADVANCEDMODE(${itemTask.id})">
                    ${itemTask.title}
                </span> 
            </div>
            <div class="task__buttons">
                <div class="task__advanced_mode_button_del" >
                    <button onclick="button_delete_ADVANCEDMODE(${itemTask.id})">DEL</button>
                </div>
                <div class="task__advanced_mode_button_edit">
                    <button onclick="button_edit_ADVANCEDMODE(${itemTask.id})">EDIT</button>
                </div>
                <div class="task__advanced_mode_button_done">
                    <button onclick="${itemTask.is_completed ? 'button_undone_ADVANCEDMODE' : 'button_done_ADVANCEDMODE'}(${itemTask.id})">
                        ${itemTask.is_completed ? 'X' : 'DONE'}
                    </button>
                </div>
            </div>
        </div>
    </div> 
    `;
}

/**
 * It returns a string that contains a div element with an id and a class, and a button element with an
 * onclick event.
 * @param filterId - the id of the filter button that was clicked
 * @returns A string of HTML code.
 */
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


/**
 * It builds the buttons for the filters, and then displays the items based on the filter selected.
 * @param [filterIdSelected] - the id of the filter selected
 */
function buildButtonsFilters(filterIdSelected = FILTER_SELECTED) {
    if (filterIdSelected.id != undefined) filterIdSelected = filterIdSelected.id;
    document.querySelector(FILTER_DIV_GROUP).innerHTML = "";
    document.querySelector(FILTER_DIV_GROUP).innerHTML += buildButtonFilterActive(filterIdSelected);
    document.querySelector(FILTER_DIV_GROUP).innerHTML += buildButtonFilterCompleted(filterIdSelected);
    document.querySelector(FILTER_DIV_GROUP).innerHTML += buildButtonFilterAll(filterIdSelected);
    displayItems(tasksList, filterIdSelected);
    FILTER_SELECTED = filterIdSelected;
}

/**
 * When the user clicks the Add button, the addTask function is called. The function gets the value of
 * the text box and creates a new item object. If the title is not empty, the function uses the fetch
 * API to call the API's add method. The function then calls the getGroups function to update the page
 * with the new list.
 */
function addTask() {
    const newTaskTitle = document.getElementById('#newtask_title');
    const item = {
        id: 0,
        title: newTaskTitle.value.trim()
    };

    if (item.title) {
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
            .then(() => newTaskTitle.value = "")
            .catch(error => console.error('Unable to add item.', error))
    }
}

function getTaskAttributes(id, viewMode) {
    const divTask = document.getElementById(id + '');
    if (Boolean(divTask.querySelector(viewMode))) {
        const itemTask = {
            id: id,
        }
        itemTask['is_completed'] = Boolean(divTask.querySelector('.' + CSS_CLASS_COMPLETED_TASK));
        if (viewMode == CSS_CLASS_ADVANCED_MODE)
            itemTask['title'] = divTask.childNodes[1].childNodes[1].childNodes[1].textContent.trim();
        if (viewMode == CSS_CLASS_EDIT_MODE)
            itemTask['title'] = divTask.childNodes[1].childNodes[1].childNodes[1].childNodes[1].value.trim();
        if (viewMode == CSS_CLASS_PREVIEW_MODE)
            itemTask['title'] = divTask.childNodes[1].textContent.trim();
        return itemTask;
    } else return null;
}



/**
 * If the div exists, get the task attributes and build the HTML.
 * @param id - the id of the div that contains the task
 * @param viewMode - css class of task's view
 * @param buildHTMLFunction - This is a function that returns the HTML that you want to insert into the
 * div.
 */
function buttonTemplateAction(params) {
    let id = params.id;
    let viewMode = params.viewMode;
    let buildHTMLFunction = params.buildHTMLFunction;

    id = id + ''
    let itemTask = {}
    const divTask = document.getElementById(id);
    if (divTask) {
        itemTask = getTaskAttributes(id, viewMode);
        divTask.innerHTML = buildHTMLFunction(itemTask)
    }
}


/**
 * If the divTask exists, then change the status of the task to completed.
 * @param id - the id of the task
 */
function button_done_ADVANCEDMODE(id) {
    id = id + ''
    const divTask = document.getElementById(id);
    if (divTask) {
        task_completed_changestatus(id)
    }
}


/**
 * If the divTask exists, then change the status of the task to false.
 * @param id - the id of the task
 */
function button_undone_ADVANCEDMODE(id) {
    id = id + ''
    const divTask = document.getElementById(id);
    if (divTask) {
        task_completed_changestatus(id, false)
    }
}


/**
 * This function takes an id, a viewMode, and a buildHTMLFunction, and then calls the
 * buttonTemplateAction function with those parameters.
 * @param id - the id of the task
 */
function button_edit_ADVANCEDMODE(id) {
    buttonTemplateAction({
        id: id,
        viewMode: CSS_CLASS_ADVANCED_MODE,
        buildHTMLFunction: buildTaskEditMode
    })
}




/**
 * When the user clicks the cancel button, the task is displayed in preview mode.
 * @param id - the id of the task
 */
function button_cancel_ADVANCEDMODE(id) {
    buttonTemplateAction({
        id: id,
        viewMode: CSS_CLASS_ADVANCED_MODE,
        buildHTMLFunction: buildTaskPreviewMode
    })
}



/**
 * When the user clicks the cancel button, the task is reverted back to its original state.
 * @param id - the id of the task
 */
function button_cancel_EDITMODE(id) {
    buttonTemplateAction({
        id: id,
        viewMode: CSS_CLASS_EDIT_MODE,
        buildHTMLFunction: buildTaskPreviewMode
    })
}


/**
 * When the user clicks the button, the function will call the buttonTemplateAction function, passing
 * in the id of the button, the viewMode, and the buildHTMLFunction.
 * @param id - the id of the button that was clicked
 */
function button_PREVIEWMODE(id) {
    buttonTemplateAction({
        id: id,
        viewMode: CSS_CLASS_PREVIEW_MODE,
        buildHTMLFunction: buildTaskAdvancedMode
    })
}


/**
 * When the button is clicked, the function will delete the task from the database and then remove the
 * task from the DOM.
 * @param id - the id of the task
 */
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



/**
 * It takes the id of the task, gets the attributes of the task, and then sends a PUT request to the
 * API to update the task.
 * @param id - the id of the task
 */
function button_accept_EDITMODE(id) {
    id = id + '';
    let itemTask = getTaskAttributes(id, CSS_CLASS_EDIT_MODE);

    if (itemTask.title) {
        fetch(uri_api + `/${id}`, {
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


/**
 * It takes the id of a task and a boolean value (true or false) and updates the task's status to the
 * boolean value.
 * @param id - the id of the task
 * @param [taskStatus=true] - true or false
 */

function task_completed_changestatus(id, taskStatus = true) {
    id = id + '';
    let itemTask = getTaskAttributes(id, CSS_CLASS_ADVANCED_MODE);
    itemTask["is_completed"] = taskStatus;

    if (itemTask.title) {
        fetch(uri_api + `/${id}`, {
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