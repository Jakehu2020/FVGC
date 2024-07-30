const fs = require('fs');
function json_check(x,a){
    return fs.existsSync("./data/" + x + ".json") && JSON.parse(fs.readFileSync("./data/" + x + ".json"))[a]!=undefined;
}
function json_set(x,a,b){
    let j=JSON.parse(fs.readFileSync("./data/" + x + ".json"));
    j[a] = b;
    return fs.writeFileSync("./data/" + x + ".json", JSON.stringify(j));
}
function json_get(x,a){
    return JSON.parse(fs.readFileSync("./data/" + x + ".json"))[a];
}
function json_gf(x){
    return JSON.parse(fs.readFileSync("./data/" + x + ".json"));
}
function json_sf(x,y){
    fs.writeFileSync("./data/" + x + ".json", y);
}
function confirm_identity(a,b,c,d){
    let x = json_gf('users');
    let y = crypt.decodeb64(a) == crypt.decodehex(b) && crypt.decodeb64(c) == crypt.decodehex(String(d)) && crypt.decodeb64(x[crypt.decodeb64(a)][0]) == crypt.decodeb64(c);
    return y;
}

let crypt = {
    encodeb64: x => Buffer.from(x).toString('base64'),
    decodeb64: x => Buffer.from(x, 'base64').toString('ascii'),
    encodehex: x => Buffer.from(x).toString('hex'),
    decodehex: x => Buffer.from(x, 'hex').toString('ascii'),
}

function replace(a, obj){
    let b = a.toString();
    Object.getOwnPropertyNames(obj).forEach(n => {
        b = b.replace(`[ ${n} ]`, obj[n]);
    });
    return b;
}

module.exports = {
    json_check, json_set, json_get, json_gf, json_sf, crypt, confirm_identity, replace
}
