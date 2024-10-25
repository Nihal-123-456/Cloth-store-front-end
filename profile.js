const profile_view = () => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    if (token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/userinfo/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            localStorage.setItem('user-mobile',data[0].contact_number)
            localStorage.setItem('user-address',data[0].street_address)
            document.getElementById('profile-name').innerText = `Welcome ${data[0].user_data.first_name}`
            const contact = document.getElementById('contact')
            const address = document.getElementById('address')
            contact.innerHTML = `
                <p class="fw-bold">Contact information</p>
                <div class="mt-lg-5 lh-1">
                    <p><small>${data[0].user_data.first_name} ${data[0].user_data.last_name}</small></p>
                    <p><small>${data[0].user_data.email}</small></p>
                    <p><small id="user-phone">0${data[0].contact_number}</small><span class="material-symbols-outlined ms-3" id="edit-contact">
                    edit
                    </span></p>
                </div>
            `
            address.innerHTML = `
                <p class="fw-bold">Address book</p>
                <div class="mt-lg-5 lh-1">
                    <p><small id="user-address">${data[0].street_address}</small><span class="material-symbols-outlined ms-2 ms-lg-3" id="edit-address">
                    edit
                    </span></p>
                </div>
            `
            document.getElementById('edit-contact').addEventListener('click', function() {
                const phoneElement = document.getElementById('user-phone');
                phoneElement.innerHTML = `<input type="number" value="0${localStorage.getItem('user-mobile')}" id="phone-input">`;
                document.getElementById('phone-input').focus();
                
                document.getElementById('phone-input').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const updatedPhone = this.value;
                        phoneElement.innerHTML = updatedPhone
                        saveUserDetails(parseInt(updatedPhone, 10), localStorage.getItem('user-address'), data[0].id);
                    }
                });
            })
            document.getElementById('edit-address').addEventListener('click', function() {
                const addressElement = document.getElementById('user-address');
                addressElement.innerHTML = `<input type="text" value="${localStorage.getItem('user-address')}" id="address-input" class="w-50">`;
                document.getElementById('address-input').focus();
                
                document.getElementById('address-input').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const updatedAddress = this.value;
                        addressElement.innerHTML = updatedAddress;
                        saveUserDetails(localStorage.getItem('user-mobile'),updatedAddress, data[0].id);
                    }
                });
            })
        })
    }
    else{
        window.location.href = 'login.html'
    }
}
profile_view()

const order_view = () => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    const orders = document.getElementById('order-row')
    if (token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/order_history/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            data.forEach((item)=>{
            const tr = document.createElement('tr')
            tr.classList.add('align-middle')
            tr.innerHTML = `
                <td id="order-table-img-clm"><div class="d-flex">
                <img id="order-img" src="${item.item_image}" alt="">
                <p style="margin-top: 11.5%"><small>${item.quantity}x ${item.color} ${item.item_name} ${item.size}</small></p>
                </div></td>
                <td><small>${item.order_date}</small></td>
                <td><small>${item.status}</small></td>
                <td><small id="cart-price">$${item.total_item_price}</small></td>
            `
            orders.appendChild(tr)
            })
        })
    }
}
order_view()

const saveUserDetails = (contact_number, street_address, id) => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const user = parseInt(uid,10)
    fetch(`https://cloth-store-api-production.up.railway.app/user/userinfo/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({contact_number, street_address, user})
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('user-mobile',contact_number)
        localStorage.setItem('user-address',street_address)
        alert("Details updated successfully!");
    })
}

