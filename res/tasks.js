const taskForm = document.querySelector('.task-form');
let updates = !1;
function createTask(text, finished, tasked){
    updates = !0;
    const def = document.querySelector(".task-item").cloneNode(1);
    def.classList.remove("hidden");
    def.innerHTML = def.innerHTML.replace("{text}", tasked?`<b>${text}</b>`:text);
    if(finished){
        def.children[0].innerHTML = `<ion-icon name="${def.children[0].classList.contains("checked")?"ellipse-outline":"checkmark-circle-outline"}" style="width: 30px; height: 30px" role="img" class="md hydrated"></ion-icon>`;
        def.children[0].classList.add("checked");
    }
    document.querySelector(".task-list").appendChild(def);
    def.children[0].addEventListener('click',(e) => {
        updates = !0;
        def.children[0].innerHTML = `<ion-icon name="${def.children[0].classList.contains("checked")?"ellipse-outline":"checkmark-circle-outline"}" style="width: 30px; height: 30px" role="img" class="md hydrated"></ion-icon>`;
        if(def.children[0].classList.contains("checked")){
            def.children[0].classList.remove("checked");
        } else {
            def.children[0].classList.add("checked")
        }
        tasks[text][0] = !tasks[text][0]
        // post("/tasks",{
        //     request: "toggle",
        //     task: text
        // })
    });
    def.children[def.children.length-1].addEventListener('click', () => {
        updates = !0;
        if(tasked){ return notify("You can't delete assigned tasks."); }
        def.remove();
        delete tasks[text];
    });
    def.setAttribute("testdata",[text,finished,tasked]);
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updates = !0;
    tasks[document.querySelector(".task-input").value] = [false, false];
    createTask(document.querySelector(".task-input").value, false, false);
    document.querySelector(".task-input").value = '';
});

let tasks = {};
tasks_dat.forEach(x => {
    tasks[x[0]] = [x[1], x[2]];
    createTask.apply(null, x);
})

function save(){
    updates = !1;
    let data = [];
    Object.getOwnPropertyNames(tasks).forEach(n => {
        data.push([n, tasks[n][0], tasks[n][1]])
    })
    post('/tasks', {
        user,
        data
    })
}

document.querySelector(".save").addEventListener("click", save);

window.addEventListener("beforeunload", (e) => {
    if(updates){ e.preventDefault(); return ""; }
})

setInterval(save, 5000);