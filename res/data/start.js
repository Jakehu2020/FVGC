document.fullscreenElement = document.querySelector(".startcont");
document.querySelector(".fullscreen").addEventListener("click", (e) => {
    document.querySelector(".startcont").requestFullscreen();
})

let plan_inputs = Object.getOwnPropertyNames(JSON.parse(atob(localStorage.plandata).substring(4, (atob(localStorage.plandata)).length - 7)))
Swal.fire({
    icon: "question",
    title: 'What meeting are you starting?',
    input: "select",
    inputOptions: plan_inputs,
    customClass: { input: "planstartselect" },
    confirmButtonText: "Select",
    allowOutsideClick: false,
}).then(result => {
    let plan = JSON.parse(atob(localStorage.plandata).substring(4, (atob(localStorage.plandata)).length - 7))[plan_inputs[result.value]];
})