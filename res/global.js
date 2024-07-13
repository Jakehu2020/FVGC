console.log("%cWarning!", "font-size: 50px; color:orange; text-shadow: -3px -3px #e8ba3f, 5px 5px yellow");
console.log("%cDO NOT %ccopy and paste anything into this console.  If someone tells you to, they might be trying to steal your account info.", "font-weight: bold;", "font-weight: normal;")
console.log("I haven't had to encrypt data too seriously yet.. \n\n\n%cdon't make me", "font-weight: bold;")

let params = new URLSearchParams(location.search)

function resize_navbar() {
    setTimeout(() => {
        if (document.querySelector(".sidebar_ul")) {
            document.querySelector(".sidebar_ul").style.height = innerHeight - 134 + "px";
        }
        if (document.querySelector(".sidebarstart_ul")) {
            document.querySelector(".sidebarstart_ul").style.height = innerHeight - 78 + "px";
        }
    }, 20);
}

window.addEventListener("resize", resize_navbar);
resize_navbar();

try {
    if (location.href.endsWith("/~")) {
        document.querySelector(".HOME").classList.add("active");
    } else if (document.querySelector("." + location.pathname.substring(1, 999).toUpperCase())) {
        document.querySelector("." + location.pathname.substring(1, 999).toUpperCase()).classList.add("active");
    }
} catch (e) { / Just the URL.. / }

let socket = io();
document.body.scrollTop = document.documentElement.scrollTop = 0;

let notifications = [];
function notify(text) {
    let k = notifications.length * 1
    const ele = document.createElement("div");
    ele.className = "notification"
    ele.innerHTML = text;
    ele.style.top = `${notifications.length * 100 + 40}px`;
    ele.style.right = `-30px`; // 55
    ele.right = -30
    let i = setInterval(() => {
        ele.right += (25 - ele.right) / 5;
        ele.style.right = `${ele.right}px`;
        if (ele.right == 25) {
            clearInterval(i)
        }
    }, 5);
    ele.addEventListener("click", () => {
        ele.remove();
        notifications.splice(notifications.indexOf(ele), 1);
    })
    const timer = document.createElement("div");
    timer.className = "timer_notify";
    timer.width = 100;
    ele.appendChild(timer);
    let I = setInterval(() => {
        if (timer.width < -60) {
            clearInterval(I);
            ele.remove();
            notifications.splice(notifications.indexOf(ele), 1);
        }
        timer.width -= 1;
        ele.style.top = `${notifications.indexOf(ele) * 100 + 40}px`;
        timer.style.width = timer.width + "%"
    }, 15)
    document.body.appendChild(ele);
    notifications.push(ele);
}

function keyEvent(key, press) {
    window.addEventListener("keydown", (e) => {
        if (e.key == key) { press(); };
    })
}

function post(uri, data) {
    return fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

window.addEventListener('beforeunload', function (e) {
    // How to prevent user from leaving:
    // e.preventDefault(); return "";
});


if (localStorage['effect'] == '3d') {
    Array.from(document.body.children).slice(1, 9999).forEach(x => {
        x.classList.add("threed");
        Array.from(x.children).forEach(y => {
            y.classList.add("threed");
            Array.from(y.children).forEach(z => {
                z.classList.add("threed");
            })
        })
    });
}
if (localStorage['effect'] == '3dmove') {
    Array.from(document.body.children).slice(1, 9999).forEach(x => {
        x.classList.add("threedinteractive");
        Array.from(x.children).forEach(y => {
            y.classList.add("threedinteractive");
            Array.from(y.children).forEach(z => {
                z.classList.add("threedinteractive");
            })
        })
    });
    window.addEventListener("mousemove", e => {
        document.querySelectorAll(".threedinteractive").forEach(x => {
            x.style.boxShadow = `${e.clientX / 50 - screen.width / 100}px ${e.clientY / 50 - screen.height / 100}px 3px #aeaeae`
        })
    })
}
if (localStorage['effect'] == 'bf') {
    Array.from(document.body.children).forEach(x => {
        x.classList.add("fades");
        Array.from(x.children).forEach(y => {
            y.classList.add("fades");
            Array.from(y.children).forEach(z => {
                z.classList.add("fades");
            })
        })
    });
}

if (location.href.includes("/apps/") && window.parent != window) {
    document.querySelector(".sidenavbar").remove();
    // <iframe src="http://localhost:3000/apps/__" width="300" height="250"></iframe>
} else {
    if (parent != window) { parent.location.href = location.href }
}