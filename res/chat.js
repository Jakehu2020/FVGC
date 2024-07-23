const log = document.querySelector(".chatlog");

socket = io();

socket.emit("userconnect", user);
function addMSG(a,b){
    document.querySelector(".chat_container").style.border = "1px solid black";
    let ele = document.createElement('div');
    ele.innerHTML=`<div class="chatmsg"><b>${a}</b><p class="msgtext">${b}</p></div>`
    log.appendChild(ele);
}
document.querySelector(".submiticon").addEventListener("click",(e) => {
    socket.emit("chat_send",user, document.querySelector(".chattext").value);
    document.querySelector(".chattext").value = "";
});
keyEvent("Enter",() => {
    socket.emit("chat_send",user, document.querySelector(".chattext").value);
    document.querySelector(".chattext").value = "";
});
socket.on('chat_receive',(author, txt) => {
    addMSG(author, txt);
});
setTimeout(()=>{
    socket.on('chat_BOT',(txt) => {
        addMSG("JakeBot", txt);
    });
},500);
