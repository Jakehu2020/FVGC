// BASH: npm install express ejs cookie-parser cors
const express = require("express");
const app = express();

const server = require("http").Server(app);
const fs = require("fs");
const io = require('socket.io')(server);

const utils = require("./utils.js");
const JakeBot = require("./Jakebot.js");
const nm = require("./nodemailer.js");

app.engine("html", require("ejs").renderFile);
app.set("views", "src");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("res"));

app.use(require('cookie-parser')());
app.use(require("cors")());

let user = null;

function info(req) {
    if (!req) { return { user: null }; };
    if (req.usr_token && req.secure && utils.confirm_identity(req.usr_token, req.usr_key, req.secure, req._Secure)) {
        return {
            user: utils.crypt.decodeb64(req.usr_token),
            data: utils.json_get("users", utils.crypt.decodeb64(req.usr_token))
        }
    };
    return {
        user: undefined,
        data: {}
    };
}

app.get("/", (req, res) => {
    let x = info(req.cookies);
    if (x.user) { res.redirect("/~"); };
    res.render("index.html", x)
})
app.get("/login", (req, res) => {
    let x = info(req.cookies);
    if (x.user) { res.redirect("/~"); };
    res.render("login.html", info(x))
})
app.get("/signup", (req, res) => {
    let x = info(req.cookies);
    if (x.user) { res.redirect("/~"); };
    res.render("signup.html", x)
})
app.get("/~", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); };
    res.render("home.html", x)
});
app.get("/chat", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); };
    res.render("chat.html", x)
});
app.get("/calendar", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); };
    res.render("calendar.html", x)
});
app.get("/tasks", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); };
    let tasks = utils.json_get("tasks", x.user) || [];
    res.render("tasks.html", { user: x.user, tasks })
});
app.get("/apps", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); }
    res.render("apps.html", x)
});
app.get("/calendar", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); }
    res.render("calendar.html", x);
});
app.get("/settings", (req, res) => {
    let x = info(req.cookies);
    if (!x.user) { res.redirect("/login?msg=You+Haven't+Logged+In+Yet"); }
    res.render("settings.html", x);
})

app.get("/signout", (req, res) => {
    res.clearCookie("usr_token");
    res.clearCookie("usr_key");
    res.clearCookie("secure");
    res.clearCookie("_Secure");
    res.redirect("/");
})

io.on('connection', (socket) => {
    socket.on("chat_send", (author, message) => {
        io.emit("chat_receive", author, message);
        if (JakeBot(message)) { io.emit("chat_BOT", JakeBot(message)); }
    });
    socket.on("disconnect", () => {
        io.emit("chat_BOT", "A User has left the chat (or reloaded the page)");
    });
    socket.on("userconnect", (user) => {
        io.emit("chat_BOT", `${user} has joined the chat!`);
    });
});

app.post("/signup", (req, res) => {
    let user = req.body.login;
    let pass = req.body.password;
    if (!utils.json_check("users", user)) {
        utils.json_set("users", user, [utils.crypt.encodeb64(pass), null]);
        utils.json_set("tasks", user, [])
        res.redirect("/login");
    } else {
        res.redirect("/signup?msg=Your+Account+Username+Is+Already+Taken. Maybe Something Else?");
    }
});
app.post("/login", (req, res) => {
    let user = req.body.login;
    let pass = req.body.password;
    if (utils.json_get("users", user) && utils.crypt.decodeb64(utils.json_get("users", user)) == pass) {
        res.cookie("usr_token", utils.crypt.encodeb64(user), { httpOnly: true, maxAge: req.body.stayin ? 2592000000 : 259200000 })
        res.cookie("usr_key", utils.crypt.encodehex(user), { httpOnly: true, maxAge: req.body.stayin ? 2592000000 : 259200000 })
        res.cookie("secure", utils.crypt.encodeb64(pass), { httpOnly: true, maxAge: req.body.stayin ? 2592000000 : 259200000 })
        res.cookie("_Secure", utils.crypt.encodehex(pass), { httpOnly: true, maxAge: req.body.stayin ? 2592000000 : 259200000 })
        res.redirect("/~");
    } else {
        res.redirect("/login?msg=Couldn't+Find+Your+Account");
    }
});
app.post("/tasks", (req, res) => {
    let taskJSON = utils.json_gf("tasks");
    let USER = info(req.cookies).user;
    if (!USER) { return; }
    let request = req.body.request;
    if (request == "create") {
        taskJSON[USER].push([req.body.text, false, false]);
        // req.body = { request: "create", text: "..."}
    } else if (request == "toggle") {
        let i = taskJSON[USER].findIndex(a => a[0] == req.body.task)
        taskJSON[USER][i][1] = !taskJSON[USER][i][1];
        // req.body = { request: "toggle", task: "..."}
    } else if (request == "delete") {
        let i = taskJSON[USER].findIndex(a => a[0] == req.body.task);
        if (i == -1 || !taskJSON[USER][i] || taskJSON[USER][i][2]) { return; }
        taskJSON[USER].splice(i, 1);
        // req.body = { request: "delete", task: "..."}
    }
    utils.json_sf("tasks", JSON.stringify(taskJSON));
});

let code = {}, tms = [];
app.post("/verifyemail", (req, res) => {
    let email = req.body.email;
    let USER = info(req.cookies).user;
    let p = (`000000` + Math.floor(Math.random() * 1000000));
    p = p.substring(p.length - 6, p.length);
    while (tms.includes(p)) {
        let p = (`000000` + Math.floor(Math.random() * 1000000));
        p = p.substring(p.length - 6, p.length);
    }
    code[String(p)] = [email, USER];
    if (!USER) { return; }
    nm.send(email, "Email Verification Code", utils.replace(nm.getEmailHTML("email_verify"), { VERIFICATION_CODE: p, USER }));

    setTimeout(() => {
        if (code[p]) {
            delete code[p];
        };
        if (tms.includes(p)) {
            tms.splice(tms.indexOf(p))
        };
    }, 600000);
    tms.push(p);
});
app.post("/verifycode", (req, res) => {
    let code_input = req.body.code;
    res.send(code[code_input] ? "true" : "false");
    if (code[code_input]) {
        let z = utils.json_get("users", code[code_input][1]);
        z[1] = code[code_input][0];
        utils.json_set("users", code[code_input][1], z);
        delete code[code_input];
    }
});

server.listen(3000, () => console.log("Server is starting"));

// Putting this last so I don't forget my mistakes.
app.use((req, res, next) => {
    res.render("404.html", info(req.cookies));
    next();
});