location.hash = ""; let updates = false;
document.querySelectorAll("tr").forEach(x => {
    x.addEventListener("click", (e) => {
        location.hash = "#" + x.innerText;
    });
});
if (data[1]) {
    document.querySelector(".email_change").addEventListener("click", (e) => {
        Swal.fire({
            title: "What is your email address?",
            input: "email",
            inputPlaceholder: "Enter your email address",
            showCancelButton: true,
        }).then((email) => {
            if (email.dismiss == "cancel") { return Swal.fire({ title: "Canceled", icon: "success" }) }
            post("/verifyemail", { email: email.value });
            Swal.fire({
                title: "Verification code",
                text: "A 6-digit verification code has been sent to this email. What is it?",
                input: "number",
                inputPlaceholder: "Verification code...",
                showCancelButton: true,
            }).then((code) => {
                if (result) {
                    post("/verifycode", { code: code.value })
                }
            });
        })
    });

    document.querySelector(".email_delete").addEventListener("click", (e) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted",
                    text: "Your email has been deleted.",
                    icon: "success"
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "This has been canceled.",
                    icon: "error"
                });
            }
        });
    });
} else {
    document.querySelector(".email_add").addEventListener("click", (e) => {
        Swal.fire({
            title: "What is your email address?",
            input: "email",
            inputPlaceholder: "Enter your email address",
            showCancelButton: true,
        }).then((email) => {
            if (email.dismiss == "cancel") { return Swal.fire({ title: "Canceled", icon: "success" }) }
            post("/verifyemail", { email: email.value });
            Swal.fire({
                title: "Verification code",
                text: "A 6-digit verification code has been sent to this email. What is it?",
                input: "number",
                inputPlaceholder: "Verification code...",
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (String(value).length != "6") { resolve("The code should be 6 numbers in length.") }
                        post("/verifycode", { code: value }).then(resp => resp.text()).then(n => {
                            if (n == "true") { resolve();Swal.fire({ icon: 'success', title: 'It worked!' }) };
                            if (n == "false") { resolve("The code did not work.") }
                        });
                    });
                }
            });
        })
    });
}

document.querySelector('.theme').selectedIndex=["light","dark","ldtime","penguin","coffee"].indexOf(localStorage["theme"])
document.querySelector('.effect').selectedIndex=["none","3d","3dmove","bf"].indexOf(localStorage["effect"])

function gbVal(n, x=document){
    let ele = x.querySelector(`[name='${n}']`) || x.querySelector(`.${n}`);
    return ele.value || ele.checked || Array.from(ele.querySelectorAll('input[type="checkbox"]')).map(x => x.checked);
}
function gbEle(n, x=document){
    return x.querySelector(`[name='${n}']`) || x.querySelector(`.${n}`);
}

let pfpdata = window.pfpdata || {};
if(Object.keys(pfpdata).length != 0){
    Object.getOwnPropertyNames(pfpdata).forEach(name => {
        let ele = gbEle(name), prop = pfpdata[name];
        if(!ele){ return; }
        if(typeof prop == "boolean"){ ele.checked = prop; }
        else if(typeof prop == "string"){ ele.value = prop; }
        else if(typeof prop == "object"){
            console.log(name, ele, prop);
            ele.querySelectorAll("input[type='checkbox']").forEach((check, i) => { check.checked = prop[i]; });
        }
    })
}
document.querySelector(".acc_save").addEventListener('click', (e) => {
    testInternet(true);
    Object.assign(pfpdata, { 
        fullname: gbVal("fullname"),
        role: gbVal("role"),
    });
    sendSave();
})
document.querySelector(".prof_save").addEventListener('click', (e) => {
    testInternet(true);
    Object.assign(pfpdata, { 
        settings_bio: gbVal("settings_bio") || "",
        pronouns: gbVal("pronouns") || "",
        website: gbVal("website") || "",
        sm1: gbVal("sm1") || "",
        sm2: gbVal("sm2") || "",
        sm3: gbVal("sm3") || "",
    });
    sendSave();
})
document.querySelector(".notif_save").addEventListener('click', (e) => {
    testInternet(true);
    Object.assign(pfpdata, { 
        notifications_check: gbVal("notifications_check") || [],
        email_check: gbVal("email_check") || [],
    });
    sendSave();
})
document.querySelector(".interface_save").addEventListener("click", (e) => {
    localStorage["theme"] = gbVal('theme');
    localStorage["effect"] = gbVal('effect');
    localStorage["confetti"] = gbVal('confetti');
    localStorage["checkbox"] = gbVal('checkbox');
    location.hash="#INTERFACE";
});

function sendSave(){
    if(!testInternet(false)){ return; };
    return post("/setting", { data: pfpdata, user }).then(res => {
        updates = false;
    });
    // console.log("save");
    // updates = false;
}

Array.from(document.querySelectorAll("input")).concat(Array.from(document.querySelectorAll("select"))).forEach(ele => {
    ele.addEventListener("change", (e) => {
        updates = true;
    })
})

window.addEventListener('beforeunload', function (e) {
    if (updates) { sendSave(); e.preventDefault(); return ""; }
});
window.addEventListener("scroll",(e) => {
    document.querySelector(".stb").style.top = window.scrollY+"px";
});

setInterval(sendSave, 5000);