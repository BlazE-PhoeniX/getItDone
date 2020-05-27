let database;


function tasks(name){
    this.name=name;
}

function completedTasks(name){
    this.name=name;
    this.date=getDate();
}

let defaultSuccess = function() {};
let defaultError = function() {};

window.onload = function() {
    let req = window.indexedDB.open("GetItDone", 1);

    req.onupgradeneeded = function(){
        database=req.result;
        let objs=database.createObjectStore("tasks", {keyPath: "id", autoIncrement: true});
        let objs2=database.createObjectStore("completedTasks", {keyPath: "id", autoIncrement: true});
    }
    req.onsuccess = function(){
        database=req.result;
        updateTasks();
        updateTheme(readData("theme"));
    }
    req.onerror = function(event){
        console.log("There was an error while opening the database");
    }
}

function addTask(task, store, success = defaultSuccess, error = defaultError) {
    let transaction = database.transaction(store, "readwrite");
    let objs = transaction.objectStore(store);
    let req = objs.add(task);

    req.onsuccess = success;
    req.error = error;
}

function readOneTask(id, store, success = defaultSuccess, error = defaultError) {
    let transaction = database.transaction(store, "readonly");
    let objs = transaction.objectStore(store);
    let req = objs.get(id);

    req.onsuccess = function(e){
        success(req.result);
    }

    req.error = error;
}

function readAllTasks(store, success= defaultSuccess, error = defaultError) {
    let transaction = database.transaction(store, "readonly");
    let objs = transaction.objectStore(store);
    let req = objs.openCursor();
    let tasks=[];

    req.onsuccess = function(){
        let cursor=req.result;
        if(cursor){
            tasks.push(cursor.value);
            cursor.continue();
        }
        else {
            success(tasks);
        }
    };

    req.error = error;
}

function deleteOneTask(id, store, success = defaultSuccess, error = defaultError) {
    let transaction = database.transaction(store, "readwrite");
    let objs = transaction.objectStore(store);
    let req = objs.delete(id);
    req.onsuccess = success;
    req.error = error;
}

function deleteAllTasks(store, success = defaultSuccess, error = defaultError) {
    let transaction = database.transaction(store, "readwrite");
    let objs = transaction.objectStore(store);
    let req = objs.clear();

    req.onsuccess = success;
    req.error = error;
}
