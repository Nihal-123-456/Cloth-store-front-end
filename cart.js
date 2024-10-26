const cart = () => {
    const param = new URLSearchParams(window.location.search)
    const refer = param.get('order')
    const table = document.getElementById('cart-table-body')
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    const msg = document.getElementById('order-failed-msg')
    const msg_sm = document.getElementById('order-failed-msg-sm')
    if(token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/cart/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            console.log(data);
            if(refer == 'failed'){
                msg.classList.remove('d-none')
                msg.innerHTML = `<small class="fw-bold">Your order has failed</small>`
                msg_sm.classList.remove('d-none')
                msg_sm.innerHTML = `<small class="fw-bold">Your order has failed</small>`
            }
            if (data[0].total_quantity > 0) {
                data[0].cart_items.forEach((item)=>{
                    const tr = document.createElement('tr')
                    tr.classList.add('align-middle')
                    tr.innerHTML = `
                        <td id="cart-table-img-clm"><img id="cart-img" src="${item.item_image}" alt="" class="mt-3 mb-3"><small class="mt-3 mb-3">${item.item_name}</small></td>
                        <td><small class="px-4 mt-3 mb-3">${item.color}</small></td>
                        <td><small class="px-5 mt-3 mb-3">${item.size}</small></td>
                        <td id="cart-quantity-input" class="px-5"> 
                        <select name="quantity" id="${item.item_name}-numbers" class="mb-3 mt-3">
                        </select>
                        <button class="text-black ms-4 border-0 bg-white text-decoration-underline mt-3 mb-3" onclick = "cart_item_delete('${item.id}')"><small>Remove</small></button></td>
                        <td class="text-end"><small id="cart-price" class="mt-3 mb-3">$${item.item_price * item.quantity}</small></td>
                    `
                    table.appendChild(tr)
                    const cart_sm = document.getElementById('cart-sm') 
                    const div_sm = document.createElement('div')
                    div_sm.innerHTML = `
                        <div class="d-flex gap-5 justify-content-center align-items-center mt-4">
                        <div class="d-flex align-items-center gap-3 w-50">
                        <img width="50" src="${item.item_image}" alt="">
                        <p><small>${item.item_name} ${item.color} ${item.size}</small></p>
                        </div>
                        <div class="d-flex flex-column gap-3 w-25 justify-content-cente align-items-center">
                        <select name="quantity" id="${item.item_name}-numbers-sm" class="text-center w-75">
                        </select>
                        <button class="text-black border-0 bg-white text-decoration-underline" onclick = "cart_item_delete('${item.id}')"><small>Remove</small></button>
                        </div>
                        <div class="w-25 text-end">
                            <p><small>$${item.quantity * item.item_price}</small></p>
                        </div>
                        </div>
                        <hr>
                    `
                    cart_sm.appendChild(div_sm)
                    const datalist = document.getElementById(`${item.item_name}-numbers`)
                    const datalist_sm = document.getElementById(`${item.item_name}-numbers-sm`)
                    for(let i=1; i<=item.quantity_available; i++) {
                        const option = document.createElement('option')
                        const option_sm = document.createElement('option')
                        option.value = i;
                        option.innerText = i
                        option_sm.value = i;
                        option_sm.innerText = i
                        datalist.appendChild(option)
                        datalist_sm.appendChild(option_sm)
                        if (i==item.quantity) {
                            option.selected = true
                            option_sm.selected = true
                        }
                    }
                    datalist.addEventListener('change', () => cart_quantity_change(item,datalist.value,data[0].id))
                    datalist_sm.addEventListener('change', () => cart_quantity_change(item,datalist_sm.value,data[0].id))
                })
                const total = document.getElementById('total-cart-price')
                const total_sm = document.getElementById('cart-total-sm')
                total.innerHTML = `<p class="fw-bold">Total</p>
                <p><small class="ms-5 me-2">$${data[0].total_payment}</small></p>`
                total_sm.innerHTML = `<p class="fw-bold">Total</p>
                <p><small class="ms-5">$${data[0].total_payment}</small></p>`
            }
            else {
                const cart_section = document.getElementById('cart-section-right')
                const cart_section_sm = document.getElementById('cart-sm')
                const table = document.getElementById('cart-table')
                const btn_sm = document.getElementById('checkout-btn-sm')
                const btn_lg = document.getElementById('checkout-btn-lg')
                table.classList.add('d-none')
                btn_sm.classList.add('d-none')
                btn_lg.classList.add('d-none')
                cart_section.innerHTML = `
                    <p><small>Your cart is currently empty.</small></p>
                `
                cart_section_sm.innerHTML = `
                    <p><small>Your cart is currently empty.</small></p>
                `
            }
        })
    }
    else {
        window.location.href = 'index.html'
    }
}
cart()

const cart_quantity_change = (product, quantity, cart)=> {
    const token = localStorage.getItem('token')
    const color = product.color
    const size = product.size
    const item = product.item_id
    fetch(`https://cloth-store-api-production.up.railway.app/user/cart_items/${product.id}/`,{
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({quantity, color, size, cart, item})
    })
    .then((req)=>req.json())
    .then((data)=>{
        window.location.reload()
    })
}

const cart_item_delete = (product) => {
    const token = localStorage.getItem('token')
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