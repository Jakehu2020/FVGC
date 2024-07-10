document.querySelectorAll(".app").forEach(div => {
    div.addEventListener("click",(e) => {
        location.href = "/apps/"+div.innerText.toLowerCase().replaceAll(" ","-");
    })
});