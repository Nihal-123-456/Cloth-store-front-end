const password_recover = (event) => {
    event.preventDefault()
    const recovery_email = document.getElementById('recovery-email').value
    const html = document.getElementById('pass-recover-instruction')
    fetch('https://cloth-store-api-production.up.railway.app/user/forget_password/',{
        method: 'POST',
        headers: {'content-type' : 'application/json'},
        body: JSON.stringify({'email':recovery_email})
    })
    .then((req)=>req.json())
    .then((data)=>{
        if(data === "A link has been sent to your email."){
            localStorage.setItem('pass-recover-status','email-sent')
            window.location.reload()
        }
        else{
            if(data.email[0] === "Enter a valid email address."){
                html.innerHTML = `<p>Enter a valid email address.</p>`
            }
            else {
                html.innerHTML = `<p>There are no users with this email.</p>`
            }
        }
    })
}

const set_new_password = (event, uid, token) => {
    event.preventDefault()
    const new_password = document.getElementById('new-password').value
    const confirm_new_password = document.getElementById('confirm-new-password').value
    const msg = document.getElementById('pass-recover-instruction')

    if (new_password == confirm_new_password) {
        if(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(new_password)) {
            fetch(`https://cloth-store-api-production.up.railway.app/user/password_reset/${uid}/${token}`, {
                method: 'POST',
                headers: {'content-type' : 'application/json'},
                body: JSON.stringify({new_password, confirm_new_password})
            })
            .then((req)=>req.json())
            .then((data)=>{
                console.log(data);
                localStorage.setItem('pass-recover-status', 'success')
                window.location.href = 'password_recover.html'
            })
        }
        else{
            msg.innerHTML = `
                <small>Password must contain minimum 8 letters with at least a symbol, upper and lower case letters and a number.</small>
            `   
        }
    }
    else{
        msg.innerHTML = `
            <small>Passwords do not match</small>
        `
    }
}

document.addEventListener('DOMContentLoaded',function () {
    const html = document.getElementById('pass-recover-instruction')
    const form = document.getElementById('pass-recover-form')
    const link = document.getElementById('back-to-login')
    const title = document.getElementById('password-reset-form-title')
    const email_status = localStorage.getItem('pass-recover-status')
    if (email_status) {
        if(email_status == 'email-sent') {
            html.innerHTML = `<p>Successfully done! Check out your email to reset your password.</p>`
            form.classList.add('d-none')
            link.classList.remove('d-none')
            localStorage.removeItem('pass-recover-status')
        }
        else {
            html.innerHTML = `<p>Success! Your password has been successfully reset.</p>`
            form.classList.add('d-none')
            link.classList.remove('d-none')
            localStorage.removeItem('pass-recover-status')
        }
    }
    else{
        const param = new URLSearchParams(window.location.search)
        const refer = param.get('referrer')
        const token = param.get('token')
        const uid = param.get('uid')
        if(refer == 'password_reset' && token && uid){
            title.innerText = 'Enter a new password below.'
            form.innerHTML = `<label class="mb-2" for="new-password"><small>Password</small></label> <br> 
            <input id="new-password" type="password" required> <br>
            <label class="mt-4 mb-2" for="confirm-new-password"><small>Confirm password</small></label> <br> 
            <input id="confirm-new-password" type="password" required> <br>
            <hr class="mt-5">
            <div class="d-flex justify-content-end mt-4">
                <button type="submit" onclick="set_new_password(event,'${uid}', '${token}')"><small class="fw-bold">Save</small></button>
            </div>`
        }
        else {
            title.innerText = 'Lost password'
            html.innerHTML = `<p>Lost your password? Please enter your email address. You will receive a link to create a new password via email.</p>
            `
            form.innerHTML = `<label class="mb-2" for="recovery-email"><small>Email Address</small></label> <br> 
            <input id="recovery-email" type="email" required> <br>
            <hr class="mt-5">
            <div class="d-flex justify-content-end mt-4">
                <button type="submit" onclick="password_recover(event)"><small class="fw-bold">Reset password</small></button>
            </div>`
        }
    }
})