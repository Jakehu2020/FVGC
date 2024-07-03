let focused = false;
let focusele = 0;
function focuselement(n){
    let apps = document.querySelectorAll(".app");
    let ele = apps[n];
    ele.style.width = "750px";
    ele.style.height = "750px";
    focused = true;
    focusele = n;
    apps[0].before(ele);
}
function unfocus(){
    let apps = document.querySelectorAll(".app");
    apps.forEach(x => {
        x.style.width = "250px";
        x.style.height = "250px";
    });
    focused = false;
}

document.querySelectorAll(".app").forEach((x, i) => {
    x.addEventListener("click",() => {
        if(!focused){ focuselement(i); }
        if(focused && focusele != i){ unfocus(); focuselement(i); }
    });
    x.addEventListener("focusout",() => {
        if(!focused){ focuselement(i); }
        if(focused && focusele != i){ unfocus(); focuselement(i); }
    });
})

// APPS
document.querySelector(".timer_text").addEventListener("click", () => {
    
})