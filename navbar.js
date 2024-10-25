window.onload = function() {
    fetch('https://cloth-store-api-production.up.railway.app/user/token_view')
    .then((res)=>res.json())
    .then((data)=>{
        const uid = localStorage.getItem('uid')
        const token = localStorage.getItem('token')
        let token_present = false
        if(uid && token){
            data.tokens.forEach(t => {
                if(token == t.key && uid == t.user){
                    token_present = true
                }
            })
            if (token_present == false){
                localStorage.clear()
                window.location.reload()
            }
        }
    })
};

const navbar = () => {
    const username = document.getElementById('account-name-lg')
    const username_sm = document.getElementById('account-name-sm')
    const logout_btn = document.getElementById('logout-btn-sm')
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    if (token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/userinfo/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            username.innerHTML = `
                <div class="dropdown">
                  <button id="nav-profile-name" class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${data[0].user_data.username}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end px-5 pt-5 pb-4"> 
                    <div class="d-flex flex-column mb-4 gap-2">
                        <a href="profile.html" class="text-decoration-none text-black">Personal information</a>
                        <a href="profile.html#orders" class="text-decoration-none text-black">Orders</a>
                    </div>
                    <hr class="mb-4">
                    <div class="d-flex gap-5 align-items-center">
                    <a class="text-black flex-grow-1 text-decoration-none" onclick="logout('')" style="cursor: pointer"><small>Logout</small></a>
                    <a href="profile.html" class="text-white bg-black px-5 pt-3 pb-3 text-decoration-none fw-bold"><small>My account</small></a>
                    </div>
                  </ul>
                </div>
            `
            username_sm.innerHTML = `
                <a class="nav-link mb-2" href="profile.html">${data[0].user_data.username}</a>
            `
            logout_btn.classList.add('d-lg-none')
            logout_btn.innerText = 'Logout'
        })
    }
    else {
        username.innerHTML = `
            <div class="dropdown">
                <button id="account-btn-lg" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    My account
                </button>
                <ul class="dropdown-menu dropdown-menu-end px-5 pt-5 pb-4">
                    <p class="mb-5"><small>Create an account or log in to view your orders, return or adjust your personal information.</small></p>
                    <hr class="mb-4">
                    <div class="d-flex gap-5 align-items-center">
                    <a href="register.html" class="text-black flex-grow-1 text-decoration-none"><small>Create account</small></a>
                    <a href="login.html" class="text-white bg-black px-5 pt-3 pb-3 text-decoration-none fw-bold"><small>Login</small></a>
                    </div>
                </ul>
            </div>
        `
        username_sm.innerHTML = `
            <a class="nav-link mb-2" href="login.html">My account</a>
        `
        logout_btn.classList.add('d-none')
    }
}
navbar()

const logout = () => {
    const token = localStorage.getItem('token')
    fetch('https://cloth-store-api-production.up.railway.app/user/logout/' , {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'content-type': 'application/json'
        }
    })
    .then((req)=>req.json())
    .then((data)=>{
        localStorage.clear()
        window.location.href = 'index.html'
    })
}

const cartButton = () => {
    const cart = document.getElementById('cart-btn')
    const cart_sm = document.getElementById('cart-btn-sm')
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    if(token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/cart/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            if (data[0].total_quantity > 0) {
                cart.innerHTML = `
                <div class="dropdown">
                  <button class="" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: white; background-color: black; border-radius: 50%; padding: 2px 8px; text-decoration: none;">
                    ${data[0].total_quantity}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end px-5 pt-5 pb-4" style="width: 400px;"> 
                    <div id="cart-items" class="d-flex flex-column mb-4 gap-2">
                        ${data[0].cart_items.map((item) => {
                            return `
                                <div class="d-flex gap-5 justify-content-between">
                                    <img width="50" src="${item.item_image}" alt="">
                                    <p><small>${item.quantity}x ${item.item_name}</small></p>
                                    <div>
                                        <p class="ps-2"><small>$${item.quantity * item.item_price}</small></p>
                                        <button class="text-black bg-white text-decoration-underline border-0" onclick = "navcart_item_delete('${item.id}')"><small>Remove</small></button>
                                    </div>
                                </div>
                                <hr>
                            `
                        }).join('')}
                    </div>
                    <div class="d-flex" style="margin-bottom: -15px; margin-top: -15px">
                        <p class="flex-grow-1"><small>Total:</small></p>
                        <p class="pe-2"><small>$${data[0].total_payment}</small></p>
                    </div>
                    <hr>
                    <div class="d-flex gap-5 align-items-center justify-content-end">
                    <a href="cart.html" class="text-white bg-black px-5 pt-3 pb-3 text-decoration-none fw-bold"><small>Checkout</small></a>
                    </div>
                  </ul>
                </div>
                `
            }
            else {
                cart.innerHTML = `
                <div class="dropdown">
                  <button class="" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: white; background-color: black; border-radius: 50%; padding: 2px 8px; text-decoration: none;">
                    ${data[0].total_quantity}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end px-5 pt-5 pb-4"> 
                    <div id="cart-items" class="d-flex flex-column mb-4 gap-2">
                        <p><small>Your cart is currently empty.</small></p>
                    </div>
                    <hr>
                    <div class="d-flex gap-5 align-items-center justify-content-end">
                    <a href="cart.html" class="text-white bg-black px-5 pt-3 pb-3 text-decoration-none fw-bold"><small>Checkout</small></a>
                    </div>
                  </ul>
                </div>
                `
            }

            cart_sm.innerHTML = `
                <a href="cart.html" style="color: white; background-color: black; border-radius: 50%; padding: 2px 8px; text-decoration: none;">
                    ${data[0].total_quantity}
                </a>   
            `
        })
    }
    else {
        cart.classList.remove('d-lg-block')
        cart_sm.classList.add('d-none')
    }
}
cartButton()

const navcart_item_delete = (product) => {
    const token = localStorage.getItem('token')
    console.log(product);
    fetch(`https://cloth-store-api-production.up.railway.app/user/cart_items/${product}/`,{
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
        }
    })
    .then((data)=>{
        window.location.reload()
    })
}

const show_search_bar = () => {
    const search = document.getElementById('search-section')
    search.classList.remove('close')
    search.classList.add('show')
}
const close_search_bar = () => {
    const search = document.getElementById('search-section')
    search.classList.add('close')
    setTimeout(()=>{
        search.classList.remove('show')
    },400)
}

let items = []

const item_list = () => {
    fetch('https://cloth-store-api-production.up.railway.app/product/item/')
    .then((req)=>req.json())
    .then((data)=>{
        items = data
    })
}

item_list()

const filter_search = (event) => {
    const user_input = event.target.value
    const data_section = document.getElementById('search-results')
    data_section.innerHTML = ''
    if(user_input.length > 0){
        const filter_data = items.filter((item)=>{
            return (item.title.toLowerCase().includes(user_input.toLowerCase()))
        })
        if(filter_data.length > 0){
            filter_data.forEach((item)=>{
                const li = document.createElement('li')
                li.innerHTML = `
                <a href="item_details.html?item_id=${item.id}" class="text-black text-decoration-none">
                    <div class="d-flex gap-3 mt-4 mb-4">
                        <img style='width: 80px; height: 80px' src="${item.images[0].image}" alt="">
                        <div class='d-flex flex-column'>
                            <p><small>${item.title}</small></p>
                            <div class="d-flex gap-2">
                                <p class="text-decoration-line-through text-black-50"><small>${item.discount ? `$${item.price}` : ''}</small></p>
                                <p class=""><small>${item.discount ? `$${item.discount_price}` : `$${item.price}`}</small></p>
                            </div>
                        </div>
                    </div>
                </a>
                `
                data_section.appendChild(li)
            })
        }
        else{
            document.getElementById('search-results').innerHTML=`
                <p class="text-center"><small class='fw-bold mb-4'>No matching results found.</small></p>
            `
        }
    }
}

const collapse_navbar = () =>{
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    const nav = document.getElementById
    ('navbarSupportedContent')
    const navleft = document.getElementById('navlinks-left')
    const navright = document.getElementById('navlinks-right')
    if(nav.classList.contains('collapse')){
        nav.classList.remove('collapse')
        if(token && uid){
            nav.style.animation = 'navopen 0.4s forwards'
        }
        else{
            nav.style.animation = 'navopen2 0.4s forwards'
        }
        setTimeout(()=>{
            navleft.classList.remove('d-none')
            navright.classList.remove('d-none')
            nav.style.animation = 'none'
        },400)
    }
    else{
        navleft.classList.add('d-none')
        navright.classList.add('d-none')
        if(token && uid){
            nav.style.animation = 'navclose 0.4s forwards'
        }
        else{
            nav.style.animation = 'navclose2 0.4s forwards'
        }
        setTimeout(()=>{
            nav.classList.add('collapse');
            nav.style.animation = 'none'
        },400)
    }
}

window.addEventListener('load', ()=>{
    const body = document.querySelector('body')
    body.style.animation = 'load 1s ease forwards'
})