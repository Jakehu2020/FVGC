let params = new URLSearchParams(location.search)

setTimeout(() => {
    if (document.querySelector(".sidebar_ul")) {
        document.querySelector(".sidebar_ul").style.height = innerHeight - 134 + "px";
    }
    if (document.querySelector(".sidebarstart_ul")) {
        document.querySelector(".sidebarstart_ul").style.height = innerHeight - 78 + "px";
    }
}, 20);
try {
    if (location.href.endsWith("/~")) {
        document.querySelector(".HOME").classList.add("active");
    } else if (document.querySelector("." + location.pathname.substring(1, 999).toUpperCase())) {
        document.querySelector("." + location.pathname.substring(1, 999).toUpperCase()).classList.add("active");
    }
} catch(e) { / Just the URL.. /}

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