function help(){
    return
`Here are some commands:
- /JakeBot random(1,5,true)
  Gives a random number between 1 to 5. If you add "true", it will allow decimals.
- /Jakebot fortune()
  Returns a fortune that will predict your future outcome.
`
}
function random(a,b,decimal){
    return decimal?(Math.random()*(a+b)-b):Math.floor(Math.random()*(a+b)-b)
}
function fortune(){
    let res = ["You can rely on it", "Sorry, no.", "Possibly.", "The mist is unclear", "It depends.", "You may try.", "It will work", "It will not work", "As I see it, yes", "Most Likely", "Likely", "Ask discobot..","It is unclear at the moment. Let it unravel in time..."];
    return "🔮"+res[Math.floor(Math.random()*res.length)];
}
let CMD_OBJ = {
    random, fortune
}
function run(cmd){
    let command  = cmd.substr(9,cmd.length);;
    if(!cmd.startsWith("/Jakebot ")){ return null; }
    if(Object.getOwnPropertyNames(CMD_OBJ).includes(command.substring(0,command.indexOf("(")))){
        eval("CMD_OBJ."+command.substring(0,command.indexOf("("))+"(",command.substring(command.indexOf("("),command.indexOf(")")));
    }
}
module.exports = run;