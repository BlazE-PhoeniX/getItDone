

readData("total") || saveData("total", 0);
readData("completed") || saveData("completed", 0);
readData("theme") || saveData("theme", "light");



$("#task-input").on("keydown", function(e){
    if(e.keyCode==13){
        if($("#task-input").val()=="")
            return;
        else {
            if(readData("total")<15){
                let task = new tasks($("#task-input").val());
                addTask(task, "tasks", updateTasks);
                saveData("total", Number(readData("total"))+1);
                $("#total").html(readData("total"));
                $("#task-input").val("");
            }
            else {
                alert("Maximum no of tasks exceeded, Complete some before adding new tasks");
                $("#task-input").val("");
            }
        }
    }
})


function updateTasks(){
    let tasks = readAllTasks("tasks", function(tasks) {
        let list = $("#tasklist");
        let html = "";
        for(i=0;i<tasks.length;i++){
            html+=`<li data-id='${tasks[i].id}' onclick='deleteOnClick(this)'>${tasks[i].name}</li>`;
        }
        list.html(html);
        $("#total").html(readData("total"));
    } );

    tasks = readAllTasks("completedTasks", function(tasks) {
        let list = $("#recent-tasks");
        let html = "";
        tasks.reverse();
        for(i=0;i<Math.min(tasks.length,4);i++){
            html+="<li class='invert'>"+tasks[i].name+": "+tasks[i].date+"</li>";
        }
        list.html(html);
        $("#completed").html(readData("completed"));
    } );

}


function deleteOnClick(elem) {
    readOneTask(Number(elem.dataset.id),"tasks",function(task){
        let completedTask = new completedTasks(task.name);
        addTask(completedTask,"completedTasks",function(){
            elem.classList.add("exit");
            elem.addEventListener("animationend",function(){
                deleteOneTask(Number(elem.dataset.id), "tasks", function(){
                    saveData("total",Number(readData("total"))-1);
                    saveData("completed",Number(readData("completed"))+1);
                    $("#total").html(readData("total"));
                    $("#completed").html(readData("completed"));
                    updateTasks();
                });
            });
        });
    });
}


function updateTheme(theme) {
    let bgcolor = theme=="light" ? "255, 255, 255" : "19, 19, 19" ;
    let textcolor = theme=="light"? "12, 12, 12": "255, 255, 255";
    let shadow = theme=="light"? "0, 0, 0": "255, 255, 255";
    let grad1 = theme=="light"? "108, 29, 103": "34, 208, 163";
    let grad2 = theme=="light"? "100, 25, 148": "32, 173, 211";
    let side1 = theme=="light"? "255, 255, 255": "35, 35, 35";
    let side2 = theme=="light"? "251, 247, 247": "46, 46, 46";

    let root = document.documentElement;

    root.style.setProperty("--bg-color",bgcolor);
    root.style.setProperty("--text-color",textcolor);
    root.style.setProperty("--shadow-color",shadow);
    root.style.setProperty("--gradient-1",grad1);
    root.style.setProperty("--gradient-2",grad2);
    root.style.setProperty("--sidebar-gradient-1",side1);
    root.style.setProperty("--sidebar-gradient-2",side2);

    if(theme=="light"){
       document.getElementById('light').classList.add("current-theme");
       document.getElementById('dark').classList.remove("current-theme");
   }
   else {
       document.getElementById('dark').classList.add("current-theme");
       document.getElementById('light').classList.remove("current-theme");
   }

   saveData("theme",theme);

   let invert = theme=="light"? "0": "100";
   let icon=document.getElementsByClassName('icon');
   for(i=0; i<icon.length;i++){
       icon[i].style.filter=`invert(${invert})`;
   }
}


function attemtReset(){
    modal.showModal();
}


function closeModal() {
    modal.close();
}

function reset(){
    saveData("total",0);
    saveData("completed",0);
    deleteAllTasks("tasks");
    deleteAllTasks("completedTasks");
    updateTasks();
}
