const register = (event) => {
    event.preventDefault()
    const msg = document.getElementById('msg')
    const first_name = document.getElementById('first-name').value
    const last_name = document.getElementById('last-name').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('create-password').value
    const confirm_password = document.getElementById('confirm-password').value
    const street_address = document.getElementById('address').value
    const contact_number = document.getElementById('number').value
    const info = {
        username, first_name, last_name, email, password, confirm_password, contact_number, street_address
    }
    if (password == confirm_password) {
        if(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            fetch('https://cloth-store-api.onrender.com/user/register/' , {
                method: 'POST',
                headers: {'content-type' : 'application/json'},
                body: JSON.stringify(info)
            })
            .then((req)=>req.json())
            .then((data)=>{
                console.log(data);
                if (data.username) {
                    msg.innerHTML = `
                        <small>This username is already taken.</small>
                    `
                }
                else if (data.email){
                    msg.innerHTML = `
                        <small>An account with this email already exists.</small>
                    `
                }
                else{
                    localStorage.setItem('msg', 'Account created successfully. Please check your email to activate your account.')
                    window.location.reload()
                }
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

document.addEventListener('DOMContentLoaded', function () {
    const msg = document.getElementById('msg')
    if (localStorage.getItem('msg')) {
        msg.innerHTML = `
        <small>${localStorage.getItem('msg')}</small>
        `
        localStorage.removeItem('msg')
    }
})