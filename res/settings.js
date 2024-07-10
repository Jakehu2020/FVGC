location.hash = "";
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
document.querySelector(".interface_save").addEventListener("click", (e) => {
    localStorage["theme"] = document.querySelector('.theme').value;
    localStorage["effect"] = document.querySelector('.effect').value;
    location.hash="#INTERFACE"
    location.reload();
});