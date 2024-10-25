const orderlist = () => {
    const order = document.getElementById('order-section')
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    if(token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/cart/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            fetch(`https://cloth-store-api-production.up.railway.app/user/userinfo/?user=${uid}`)
            .then((req)=>req.json())
            .then((user)=>{
                order.innerHTML = `
                <div id="order-items" class="d-flex flex-column mb-5 gap-5">
                    ${data[0].cart_items.map((item) => {
                        return `
                            <div class="d-flex gap-5 justify-content-between mx-3">
                                <img width="50" height="65" src="${item.item_image}" alt="">
                                <p><small>${item.quantity}x ${item.item_name} | ${item.size} | ${item.color}</small></p>
                                <div>
                                    <p class="ps-2"><small>$${item.quantity * item.item_price}</small></p>    
                                </div>
                            </div>
                        `
                    }).join('')}
                </div>
                <hr/>
                <div class="d-flex gap-5 justify-content-between mx-3 mt-4 mb-4">
                    <p><small>Shipping Address</small></p>
                    <p><small id="user-address">${user[0].street_address}</small></p>
                </div>
                <div class="d-flex justify-content-center gap-5 mb-4">
                    <h5 class="mx-3 flex-grow-1">Total</h5>
                    <h5 class="pe-2">$${data[0].total_payment}</h5>
                </div>
                <hr/>
                </div>
                <div class="d-flex justify-content-center mt-5">
                <span class="text-white bg-black px-5 pt-3 pb-3 text-decoration-none fw-bold text-center" id="payment-btn" style="cursor: pointer;"><small onclick="payment_landing(event)">Pay Now</small></span>
                </div>
                `
            })
        })
    }
    else{
        window.location.href = 'index.html'
    }
}
orderlist()

const payment_landing = (event) =>{
    event.preventDefault()
    const uid = localStorage.getItem('uid')
    fetch(`https://cloth-store-api-production.up.railway.app/product/paymentgateway/${uid}`)
    .then((res)=>res.json())
    .then((data)=>{
        window.location.href = data.payment_url
    })
}
