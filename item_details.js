const itemdetails=()=>{
    const item = new URLSearchParams(window.location.search).get('item_id')
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    fetch(`https://cloth-store-api-production.up.railway.app/product/item/${item}/`)
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('item-details')
        parent.innerHTML = `
            <div class="d-flex flex-wrap gap-2" id="product-images">
                ${
                    data.images.map((img)=>{
                        return `<img src="${img.image}" alt="">`
                    }).join('')
                }
            </div>
            <div id="product-description">
                <h3>${data.title}</h3>
                <p class="fw-bold text-black-50">${data.category_name}</p>
                <div class="d-flex">
                    <div class="d-flex gap-2 flex-grow-1">
                        <p class="text-decoration-line-through text-black-50">${data.discount == true ? "$"+ data.price : ""}</p>
                        <p>${data.discount == true ? "$"+ data.discount_price : "$"+ data.price}</p>
                    </div>
                    <p><small class="fw-bold">${data.discount == true ? "discount. -"+data.discount_percentage +"%" : ""}</small></p>
                </div>
                <div class="d-flex mb-4 gap-3">
                    <div>
                        <label for="color" class="d-block"><small>Select Color</small></label>
                        <select id="color" name="color">
                        ${data.color_list.map((col)=>{
                            return `<option value="${col}">${col}</option>`
                        })}
                        </select>
                    </div>
                    <div>
                        <label for="size" class="d-block"><small>Select Size</small></label>
                        <select id="size" name="size">
                        ${data.size_list.map((size)=>{
                            return `<option value="${size}">${size}</option>`
                        })}
                        </select>
                    </div>
                </div>
                <button id="addto-cart"><small>Add to cart</small></button>
                <button class="mt-2 w-100 text-black bg-white border-1 fw-bold" style="padding: 10px" id="addto-wishlist"><small>Add to wishlist</small></button>
                <p class="d-none fw-bold" id="non-user-msg"><small>!Please login or signup to buy this item.</small></p>
                <p class="mt-4"><small>${data.description}</small></p>
            </div>
        `
        const btn = document.getElementById('addto-cart')
        const wishlist_btn = document.getElementById('addto-wishlist')
        const non_user = document.getElementById('non-user-msg')
        if(!token && !uid) {
            btn.classList.add('d-none')
            wishlist_btn.classList.add('d-none')
            non_user.classList.remove('d-none')
        }
        btn.addEventListener('click', ()=>{
            const color = document.getElementById('color').value
            const size = document.getElementById('size').value
            add_to_cart(data.id, color,size)
        })
        wishlist_btn.addEventListener('click', ()=>{
            add_to_wishlist(data.id)
        })

        document.getElementById('review-heading').innerText = `Rating & Reviews of ${data.title}`

        if(data.average_rating) {
            document.getElementById('item-average-rating').innerHTML = `<h1 class="d-inline">${Number(data.average_rating.toFixed(1))}</h1><h3 class="d-inline" style="color: gray;">/5</h3>`
            let integer_rating = Math.round(data.average_rating)
            let star_remain = 5-integer_rating
            let i=0
            while(i<integer_rating){
                const star = document.createElement('span')
                star.innerHTML = `<span style="font-size: 40px; color: rgb(255, 215, 0)">★</span>`
                document.getElementById('item-star-rating-average').appendChild(star)
                i++
            }
            let j=0
            while(j<star_remain){
                const star = document.createElement('span')
                star.innerHTML = `<span style="font-size: 40px; color: rgb(170, 169, 169);">★</span>`
                document.getElementById('item-star-rating-average').appendChild(star)
                j++
            }

            fetch(`https://cloth-store-api-production.up.railway.app/product/review/?item=${item}`)
            .then((res)=>res.json())
            .then((review_data)=>{
                document.getElementById('number-of-ratings').innerText = `${review_data.length} ratings`
                const comment_section = document.getElementById('comments-section')
                review_data.forEach((item)=>{
                    const div = document.createElement('div')
                    div.innerHTML = `
                        <div id="review-no-${item.id}">
                        </div>
                        <p><small style="color: gray;">${item.username}</small></p>
                        <p>${item.review}</p>
                    `
                    comment_section.appendChild(div)
                    let item_star_remain = 5-item.rating
                    let k=0
                    while(k<item.rating){
                        const star = document.createElement('span')
                        star.innerHTML = `<span style="font-size: 24px; color: rgb(255, 215, 0)">★</span>`
                        document.getElementById(`review-no-${item.id}`).appendChild(star)
                        k++
                    }
                    let l=0
                    while(l<item_star_remain){
                        const star = document.createElement('span')
                        star.innerHTML = `<span style="font-size: 24px; color: rgb(170, 169, 169);">★</span>`
                        document.getElementById(`review-no-${item.id}`).appendChild(star)
                        l++
                    }
                })
            })
        }
        else{
            document.getElementById(`item-reviews`).innerHTML = `
                <h4>No review available for this product.</h4>
            `
        }
    })
}
itemdetails()

const add_to_cart = (item, color, size) => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    const quantity = 1
    fetch(`https://cloth-store-api-production.up.railway.app/user/cart/?user=${uid}`)
    .then((req)=>req.json())
    .then((data)=>{
        const cart = data[0].id
        fetch(`https://cloth-store-api-production.up.railway.app/user/cart_items/`,{
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({quantity, color, size, cart, item})
        })
        .then((req)=>req.json())
        .then((data)=>{
            window.location.href = 'cart.html'
        })
    })
}

const add_to_wishlist = (id) => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    fetch(`https://cloth-store-api-production.up.railway.app/user/wishlist/` ,{
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
            "user": uid,
            "item": id
        })
    })
    .then((req)=>req.json())
    .then((data)=>{
        window.location.href = 'wishlist.html'
    })
}