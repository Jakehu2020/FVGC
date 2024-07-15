if (!localStorage["plandata"]) {
    localStorage['plandata'] = 'e30=';
}
let updates = 0;
const options = {
    game: {
        icon: 'game-controller-outline',
        timemin: 5,
        timemax: 15,
        desc: "Game: Play a Simple & Fun Word Game",
        params: {
            "Rounds": { type: "number" },
            "Type": { type: "select", select: ["Linxicon", "One Word", "Telephone", "20 Questions", "Contexto", "Spelling Bee", "Wordle"] }
        }
    },
    intro: {
        icon: 'chatbubble-ellipses-outline',
        timemin: 10,
        timemax: 30,
        desc: "Simple Introduction: 1 per person",
        params: {
            "Advice?": { type: "checkbox" },
        }
    },
    speech: {
        icon: 'chatbubble-ellipses-outline',
        timemin: 5,
        timemax: 15,
        desc: "Simple Speech",
        params: {
            "Advice?": { type: "checkbox" },
            "Amount of People": { type: "number" },
        }
    },
    wordoftheday: {
        icon: 'information-outline',
        timemin: 5,
        timemax: 15,
        desc: "Word of the Day",
        params: { "None": { type: "none" } }
    },
    roleannouncement: {
        icon: 'star-outline',
        timemin: 5,
        timemax: 15,
        desc: "Announce Roles",
        params: { "None": { type: "none" } }
    },
    daycompetition: {
        icon: 'trophy-outline',
        timemin: 45,
        timemax: 60,
        desc: "Speech Competition",
        params: {
            "Type": { type: "select", select: [""] }
        }
    },
    impromptusituation: {
        icon: 'flash-outline',
        timemin: 45,
        timemax: 60,
        desc: "Impromptu Situation: A random scenario for thinking fast",
        params: {
            "Rounds": { type: "number" }
        }
    },
    meetingconclusion: {
        icon: 'play-skip-forward-outline',
        timemin: 45,
        timemax: 60,
        desc: "Meeting closing",
        params: { "None": { type: "none" } }
    }
}

Object.getOwnPropertyNames(options).forEach(x => {
    const obj = options[x];
    const template = document.querySelector(".hidden").cloneNode(true);

    template.classList.remove("hidden"); template.classList.add("plan_opt"); template.setAttribute("draggable", "true"); template.setAttribute("data-title", x);
    template.querySelector(".plan_text_1234").innerText = template.querySelector(".plan_text_1234").innerText.replace("{{ text }}", obj.desc);
    template.querySelector(".planparams").innerText = template.querySelector(".planparams").innerText.replace("{{ params }}", Object.getOwnPropertyNames(obj.params).join(", "));
    template.querySelector(".plan_ionicon_frame_1234").innerHTML = `<ion-icon name="${obj.icon}" class="plan_icon"></ion-icon>`
    document.querySelector(".options").appendChild(template);

    template.addEventListener("dragstart", (e) => {
        dragged = e.target;
    });
});

let dragged = null;

document.querySelector(".plans_workarea").addEventListener("dragover", (e) => {
    e.preventDefault();
});

document.querySelector(".plans_workarea").addEventListener("drop", (e) => {
    e.preventDefault();
    const template = document.querySelector(".workarea_hid").cloneNode(true);
    const obj = options[dragged.getAttribute("data-title")];

    template.setAttribute("data-title", dragged.getAttribute("data-title"))
    template.classList.remove("hidden"); template.classList.add("planned_opt"); template.setAttribute("draggable", "true");
    template.innerHTML = template.innerHTML.replace("{{ icon }}", `<ion-icon name="${obj.icon}" class="plan_icon"></ion-icon>`).replace("{{ text }}", `<h4 class='subheader'>${obj.desc}</h4>`)

    const params = [];
    Object.getOwnPropertyNames(obj.params).forEach(paramname => {
        let param = obj.params[paramname]
        if (param.type == "number") { params.push(`<input type="number" class="plannumber planchoose" placeholder="${paramname}" name="${paramname}">`); }
        if (param.type == "select") { params.push(`<select class="planselect planchoose" name="${paramname}"><option value="" selected disabled hidden>${paramname}</option>${param.select.map(x => `<option value="${x}" name="${x}">${x}</option>`).join("<br>")}</select>`); }
        if (param.type == "checkbox") { params.push(`<input type="checkbox" class="plancheckbox planchoose" name="${paramname}"><label name="${paramname}">${paramname}</label>`); }
    });
    template.innerHTML = template.innerHTML.replace("{{ params }}", params.join(""));

    template.addEventListener("dragover", (e) => { e.preventDefault(); dragged = template; })
    document.querySelector(".plans_workarea").appendChild(template);
    dragged = null;

    template.querySelector(".toprightbin").addEventListener("click", (e) => {
        template.remove(); updates = 1;
    });
    updates = 1;
    document.querySelectorAll(".planchoose").addEventListener("change", (e) => {
        updates = 1;
    })
});

document.querySelector(".options").addEventListener("drop", (e) => {
    e.preventDefault();
});

document.querySelector(".saveplans").addEventListener('click', (e) => {
    if (!document.querySelector(".inputName").value) {
        return Swal.fire({ icon: 'error', title: 'You need a meeting plan name before saving' })
    }
    const eles = document.querySelectorAll(".planned_opt");
    let plan = [];
    eles.forEach((ele, i) => {
        let params = {};
        Array.from(ele.querySelector(".plan_parameters").children).forEach(x => {
            if (x.type == "checkbox") { params[x.name] = x.checked }
            if (x.type == "number") { params[x.name] = x.value }
            if (x.type == "select-one") { params[x.name] = x.value }
        })
        plan.push({
            name: ele.getAttribute("data-title"),
            innerHTML: ele.innerHTML,
            params
        })
    });
    let x = JSON.parse(atob(localStorage.plandata));
    x[document.querySelector(".inputName").value] = plan;
    localStorage['plandata'] = btoa(JSON.stringify(x));
    updates = 0;
});

let plan_inputs = Object.getOwnPropertyNames(JSON.parse(atob(localStorage.plandata)))
Swal.fire({
    icon: 'info',
    title: "What plan are you editing?",
    input: "select",
    inputOptions: plan_inputs,
    customClass: { input: "planstartselect" },
    confirmButtonText: "Select",
    cancelButtonText: "No, I'm starting a new plan",
    showCancelButton: true,
    showCloseButton: true
}).then(result => {
    window.PLANNAME = plan_inputs[result.value];
    let plan = JSON.parse(atob(localStorage.plandata))[plan_inputs[result.value]];
    document.querySelector(".inputName").value = plan_inputs[result.value] || "";
    plan.forEach(val => {
        const template = document.querySelector(".workarea_hid").cloneNode(true);
        const obj = options[val.name];

        template.setAttribute("data-title", val.name);
        template.classList.remove("hidden"); template.classList.add("planned_opt"); template.setAttribute("draggable", "true");
        template.innerHTML = val.innerHTML;
        template.addEventListener("dragover", (e) => { e.preventDefault(); dragged = template; })

        Object.getOwnPropertyNames(val.params).forEach(param => {
            template.querySelector(`[name="${param}"]`).value = val.params[param];
            template.querySelector(`[name="${param}"]`).checked = val.params[param];
        })

        document.querySelector(".plans_workarea").appendChild(template);

        template.querySelector(".toprightbin").addEventListener("click", (e) => {
            template.remove();
        });
    })
})

window.addEventListener('beforeunload', function (e) {
    if (updates) { e.preventDefault(); return ""; }
});

document.querySelector(".deleteplans").addEventListener("click", (e) => {
    let plans = JSON.parse(atob(localStorage.plandata));
    delete plans[window.PLANNAME];
    console.log(plans);
    localStorage.plandata = btoa(JSON.stringify(plans));
    // location.reload();
})