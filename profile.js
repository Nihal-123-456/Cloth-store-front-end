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
    const profile_section = document.getElementById('profile-section')
    if (token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/order_history/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            data.forEach((item)=>{
            const modal = document.createElement('section')
            modal.innerHTML = `
            <div class="modal fade" id="reviewModal${item.item}" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Help us with your valuable opinion.</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="rating-section text-center mt-3">
                            <h4>Rate the Product</h4>
                            <span onclick="gfg(1,${item.item})" class="star ${item.item}">★</span>
                            <span onclick="gfg(2,${item.item})" class="star ${item.item}">★</span>
                            <span onclick="gfg(3,${item.item})" class="star ${item.item}">★</span>
                            <span onclick="gfg(4,${item.item})" class="star ${item.item}">★</span>
                            <span onclick="gfg(5,${item.item})" class="star ${item.item}">★</span>
                            <p id="rating-output-${item.item}" hidden></p>
                        </div>
                        <div class="comment-section mt-4">
                            <label for="product-comment-${item.item}" class="form-label">Leave a comment</label>
                            <textarea id="product-comment-${item.item}" class="form-control" rows="5"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="submit_review('${item.item}')">Submit</button>
                    </div>
                    </div>
                </div>
            </div>`
            profile_section.appendChild(modal)
            
            const tr = document.createElement('tr')
            tr.classList.add('align-middle')
            tr.innerHTML = `
                <td id="order-table-img-clm"><div class="d-flex">
                <img id="order-img" src="${item.item_image}" alt="">
                <p style="margin-top: 11.5%"><small>${item.quantity}x ${item.color} ${item.item_name} ${item.size}</small></p>
                </div></td>
                <td class="d-none d-lg-table-cell"><small>${item.order_date}</small></td>
                <td><small>${item.status}</small></td>
                <td><small id="cart-price">$${item.total_item_price}</small></td>
                <td><small>${item.status == 'Delivered'? `<button type="button" class="border-0 bg-white text-decoration-underline text-black" data-bs-toggle="modal" data-bs-target="#reviewModal${item.item}">Give review</button>` : ""}</small></td>
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

function gfg(n,item) {
    let stars = document.getElementsByClassName("star " + item);
	remove(stars,item);
    const output = document.getElementById("rating-output-"+item)
	for (let i = 0; i < n; i++) {
		if (n == 1) cls = "one";
		else if (n == 2) cls = "two";
		else if (n == 3) cls = "three";
		else if (n == 4) cls = "four";
		else if (n == 5) cls = "five";
		stars[i].className = "star " + item + " " + cls;
	}
    output.value = n
}
function remove(stars,item) {
	let i = 0;
	while (i < 5) {
		stars[i].className = "star " + item;
		i++;
	}
}

const submit_review = (item) => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('uid')
    const review = document.getElementById('product-comment-'+item).value
    const rating = document.getElementById('rating-output-'+item).value
    if (!rating) {
        alert("Please provide a rating before submitting.");
        return;
    }
    if (!review) {
        alert("Please write a review before submitting.");
        return;
    }
    fetch('https://cloth-store-api-production.up.railway.app/product/review/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({rating, review, user, item})
    })
    .then((res)=>res.json())
    .then((data)=>{
        if (data.success) {
            alert("Review submitted successfully!");
            document.getElementById('product-comment-' + item).value = '';
            document.getElementById('rating-output-' + item).value = '';
            remove(document.getElementsByClassName("star " + item), item); 
        } else {
            alert(data.message);
        }
    })
}