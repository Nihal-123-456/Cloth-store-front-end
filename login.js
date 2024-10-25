const login = (event) => {
    event.preventDefault();
    const username = document.getElementById('email-username').value
    const password = document.getElementById('password').value
    if(username && password) {
        fetch('https://cloth-store-api-production.up.railway.app/user/login/' , {
            method: 'POST',
            headers: {'content-type' : 'application/json'},
            body: JSON.stringify({username,password})
        })
        .then((req)=>req.json())
        .then((data)=>{
            if(data.uid && data.token) {
                localStorage.setItem('uid', data.uid)
                localStorage.setItem('token', data.token)
                window.location.href = 'index.html'
            }
            else{
                const error = document.getElementById('error-msg')
                error.innerHTML = `
                    <small>Wrong email/username or passowrd</small>
                ` 
            }
        })
    }
}

document.addEventListener('DOMContentLoaded',function () {
    const param = new URLSearchParams(window.location.search)
    const refer = param.get('referrer')
    if(refer == 'activation'){
        const msg = document.getElementById('error-msg')
        msg.innerHTML = `<small>Your account has been activated. Now please login.</small> `
        window.history.replaceState({},document.title, window.location.pathname)
    }
})