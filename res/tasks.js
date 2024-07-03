const taskForm = document.querySelector('.task-form');
function createTask(text, finished, tasked){
    const def = document.querySelector(".task-item").cloneNode(1);
    def.classList.remove("hidden");
    def.innerHTML = def.innerHTML.replace("{text}", tasked?`<b>${text}</b>`:text);
    if(finished){
        def.children[0].innerHTML = `<ion-icon name="${def.children[0].classList.contains("checked")?"ellipse-outline":"checkmark-circle-outline"}" style="width: 30px; height: 30px" role="img" class="md hydrated"></ion-icon>`;
        def.children[0].classList.add("checked");
    }
    document.querySelector(".task-list").appendChild(def);
    def.children[0].addEventListener('click',(e) => {
        def.children[0].innerHTML = `<ion-icon name="${def.children[0].classList.contains("checked")?"ellipse-outline":"checkmark-circle-outline"}" style="width: 30px; height: 30px" role="img" class="md hydrated"></ion-icon>`;
        if(def.children[0].classList.contains("checked")){
            def.children[0].classList.remove("checked");
        } else {
            def.children[0].classList.add("checked")
        }
        post("/tasks",{
            request: "toggle",
            task: text
        })
    });
    def.children[def.children.length-1].addEventListener('click', () => {
        if(tasked){ return notify("You can't delete assigned tasks."); }
        def.remove();
        post("/tasks",{
            request: "delete",
            task: text
        })
    });
    def.setAttribute("testdata",[text,finished,tasked]);
}
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    post("/tasks",{
        request: "create",
        text: document.querySelector(".task-input").value
    })
    createTask(document.querySelector(".task-input").value, false, false);
    document.querySelector(".task-input").value = '';
});

tasks.forEach(x => {
    createTask.apply(null, x);
})