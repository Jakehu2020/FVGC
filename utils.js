const fs = require('fs');
function json_check(x,a){
    let j=JSON.parse(fs.readFileSync("/data/" + x + ".json"));
    return j[a]!=undefined;
}
function json_set(x,a,b){
    let j=JSON.parse(fs.readFileSync("./data/" + x + ".json"));
    j[a] = b;
    return fs.writeFileSync("./data/" + x + ".json", JSON.stringify(j));
}
function json_get(x,a){
    let j=JSON.parse(fs.readFileSync("./data/" + x + ".json"));
    return j[a];
}
function json_gf(x){
    return JSON.parse(fs.readFileSync("./data/" + x + ".json"));
}
function json_sf(x,y){
    fs.writeFileSync("./data/" + x + ".json", y);
}
function confirm_identity(a,b,c,d){
    let x = JSON.parse(fs.readFileSync("./data/users.json"));
    let y = crypt.decodeb64(a) == crypt.decodehex(b) && crypt.decodeb64(c) == crypt.decodehex(String(d));
    return y;
}

let crypt = {
    encodeb64: x => Buffer.from(x).toString('base64'),
    decodeb64: x => Buffer.from(x, 'base64').toString('ascii'),
    encodehex: x => Buffer.from(x).toString('hex'),
    decodehex: x => Buffer.from(x, 'hex').toString('ascii'),
}

module.exports = {
    json_check, json_set, json_get, json_gf, json_sf, crypt, confirm_identity
}
