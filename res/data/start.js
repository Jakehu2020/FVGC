// Learned: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }

let shuffleArray = (a) => {for(const i of Array.from({length:5},(v,i)=>i).reverse()){let j=Math.floor(Math.random()*(1+i));[a[i],a[j]]=[a[j],a[i]]}}

document.fullscreenElement = document.querySelector(".startcont");
document.querySelector(".fullscreen").addEventListener("click", async (e) => {
    document.querySelector(".startcont").requestFullscreen();
})

let plan_inputs = Object.getOwnPropertyNames(JSON.parse(atob(localStorage.plandata)))
Swal.fire({
    icon: "question",
    title: 'What meeting are you starting?',
    input: "select",
    inputOptions: plan_inputs,
    customClass: { input: "planstartselect" },
    inputAttributes: {
        "aria-label": "Selected Meeting"
    },
    confirmButtonText: "Select",
    allowOutsideClick: false,
}).then(async result => {
    window.plan = JSON.parse(atob(localStorage.plandata))[plan_inputs[result.value]];
    await start();
    confetti({
        particleCount: 100,
        spread: 400,
        origin: { y: 0.6 },
    });
})

async function start() {
    document.querySelector(".menu").style.display = "block";
    let people = await (await post("/people/first")).json();
    for (var i = 0; i < window.plan.length; i++) {
        let piece = window.plan[i];
        await pieces[piece.name](piece.params, people);
        document.querySelector(".content").remove();
    }
}

function exit() {
    document.exitFullscreen();
}

const pieces = {
    game(params) {
        return new Promise((resolve) => {
            let div = document.createElement("div");
            div.classList.add("content");
            let round = 0;
            let html = `<h2>Round ${round}</h2><div class="center subheader"><br><h1 class="subheader">Game: ${params.Type}</h1><br><button class='btn btn-success gamenext'>Next</button> &nbsp; `;
            if (["Contexto", "Linxicon"].includes(params.Type)) {
                html += `<button class='btn btn-secondary gameopen'><ion-icon name="open-outline"></ion-icon>Open</button>`;
            }
            html += "</div>";
            div.innerHTML = html;
            function next(e) {
                if (round >= params.Rounds) { return resolve(); }
                round++;
                div.querySelector("h2").innerText = "Round " + round;
            }
            div.querySelector(".gamenext").addEventListener("click", next);
            document.querySelector(".startcont").appendChild(div);

            if (document.querySelector(".gameopen")) {
                document.querySelector(".gameopen").addEventListener("click", (e) => {
                    let id = ["Contexto", "Linxicon"].indexOf(params.Type);
                    let links = ["contexto.me", "linxicon.com/game/practice"];
                    open("https://" + links[id]);
                });
            }
        });
    },
    intro(params, people) {
        return new Promise((resolve) => {
            let div = document.createElement("div");
            div.classList.add("content");

            shuffleArray(people);
            let i = 0;
            html = `<div class="center subheader"><h1 class="subheader">Introduce Yourself!</h1><br><h3>${people[Math.floor(i)]}</h3><br><button class='btn btn-success intronext'>Next</button></div>`;
            div.innerHTML = html;
            function next(e) {
                if (params["Advice?"]) {
                    if (!people[Math.floor(i / 2)]) {
                        return resolve();
                    }
                    div.querySelector("h1.subheader").innerHTML = i % 2 == 0 ? "Introduce Yourself!" : "Advice!";
                    div.querySelector("h3").innerText = people[Math.floor(i / 2)];
                } else {
                    if (!people[Math.floor(i)]) {
                        return resolve();
                    }
                    div.querySelector("h3").innerText = people[Math.floor(i)];
                }
                i++;
            }
            document.querySelector(".startcont").appendChild(div);
            next();
            document.querySelector(".intronext").addEventListener("click", next);
        })
    },
    speech(params, people) {
        return new Promise((resolve) => {
            let div = document.createElement("div");
            div.classList.add("content");

            shuffleArray(people);
            let round = 0;
            html = `<h2>Round ${round + 1}</h2><div class="center subheader"><div class="sideflex"><div><br><h1 class="subheader">Simple Speech</h1><br><h3>${people[Math.floor(round)]}</h3><br><button class='btn btn-success intronext'>Next</button></div><div><iframe src="/apps/random-speech-prompt" width="500" height="300" class="frame"></iframe></div></div></div>`;
            div.innerHTML = html;
            function next(e) {
                if (params["Amount of People"] <= round || !people[Math.floor(round)]) {
                    return resolve();
                }
                div.querySelector("h3").innerText = people[Math.floor(round)];
                round++;
            }
            document.querySelector(".startcont").appendChild(div);
            next();
            document.querySelector(".intronext").addEventListener("click", next);
        })
    },
    wordoftheday() {
        return new Promise((resolve) => {
            let div = document.createElement("div");
            div.classList.add("content");

            html = `<div class="center subheader"><h1 class="subheader">Word of the Day:</h1><br><h3>{{ word }}</h3><br><p>{{2}}</p><p>{{3}}</p><p>{{4}}</p><button class='btn btn-success intronext'>Next</button></div>`;
            post("/wotd", {}).then(x => x.text()).then(res_ => {
                let res = JSON.parse(res_);

                html = html.replace("{{ word }}", res[0]).replace("{{2}}", res[1]).replace("{{3}}", res[2]).replace("{{4}}", res[3]);
                div.innerHTML = html;
                document.querySelector(".startcont").appendChild(div);
                document.querySelector(".intronext").addEventListener("click", resolve);
            })
        })
    },
    roleannouncement() {
        return new Promise((resolve) => {
            let div = document.createElement("div");
            div.classList.add("content");

            let roles = ["Toastmaster of the Day", "Ah-Counter", "Grammarian", "Timer", "Topicsmaster", "Meeting Speaker", "Evaluator", "General Evaluator", "Table Topics Speaker"];
            html = `<div class="center subheader"><h1 class="subheader">Announce Roles</h1><br><h0>{{ role }}</h0><br><br><button class='btn btn-success intronext'>Next</button></div>`;
            let i = 0;
            function next(e) {
                if (!roles[i]) { return resolve() };
                div.querySelector("h0").innerText = roles[i];
                i++;
            }
            div.innerHTML = html;
            next();

            document.querySelector(".startcont").appendChild(div);
            div.querySelector(".intronext").addEventListener("click", next);
        })
    },
    impromptusituation(params, people) {
        return new Promise(resolve => {
            let div = document.createElement("div");
            div.classList.add("content");

            shuffleArray(people);
            let round = 0;
            div.innerHTML = `<h2>Round ${round + 1}</h2><div class="center subheader"><div class="sideflex"><div><br><h1 class="subheader">Impromptu Situation</h1><br><h3>${people[Math.floor(round)]}</h3><br><button class='btn btn-success intronext'>Next</button></div><div><iframe src="/apps/random-impromptu-situation" width="500" height="300" class="frame"></iframe></div></div></div>`;
            function next(e) {
                if (round + 1 >= params.Rounds || !people[Math.floor(round)]) {
                    return resolve();
                }
                div.querySelector("h3").innerText = people[Math.floor(round)];
                round++;
            }
            document.querySelector(".startcont").appendChild(div);
            next();
            document.querySelector(".intronext").addEventListener("click", next);
        })
    },
    meetingconclusion() {
        return new Promise(resolve => {
            let div = document.createElement("div");
            div.classList.add("content");

            div.innerHTML = `<div class="center subheader"><h0 class="subheader">Meeting Conclusion</h0><br><button class='btn btn-success intronext'>Next</button></div>`;
            document.querySelector(".startcont").appendChild(div);

            div.querySelector(".intronext").addEventListener('click', exit);
        });
    }
}