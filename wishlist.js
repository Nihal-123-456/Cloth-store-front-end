// start from here
const wishlist = () => {
    const table = document.getElementById('wishlist-table-body')
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    if(token && uid) {
        fetch(`https://cloth-store-api-production.up.railway.app/user/wishlist/?user=${uid}`)
        .then((req)=>req.json())
        .then((data)=>{
            if (data.length>0) {
                data.forEach((item)=>{
                    const tr = document.createElement('tr')
                    tr.classList.add('align-middle')
                    tr.innerHTML = `
                        <td id="wishlist-table-img-clm">
                            <img id="wishlist-img" src="${item.item_image}" alt="" class="">
                            <small class="">${item.item_name}</small>
                        </td>
                        <td class="px-5">
                            <small class="text-decoration-line-through me-1 text-black-50">${item.item_discount? `$${item.item_price}` : ''}</small>
                            <small id="wishlist-price" class="">$${item.item_discount? item.item_discount_price : item.item_price}</small>
                        </td>
                        <td class="text-end">
                            <button class="text-black ms-4 border-0 bg-white text-decoration-underline " onclick = "wishlist_item_delete('${item.id}')"><small>Remove</small></button>
                            <a class="text-black ms-4 border-0 bg-white text-decoration-underline " href="item_details.html?item_id=${item.item_id}"><small>See details</small></a>
                        </td>
                    `
                    table.appendChild(tr)
                    const wishlist_sm = document.getElementById('wishlist-sm') 
                    const div_sm = document.createElement('div')
                    div_sm.innerHTML = `
                        <div class="d-flex gap-5 justify-content-center align-items-center mt-4">
                        <div class="d-flex align-items-center gap-3 w-50">
                        <img width="50" src="${item.item_image}" alt="">
                        <p><small>${item.item_name}</small></p>
                        </div>
                        <div class="w-25">
                            <p><small class="text-decoration-line-through text-black-50">${item.item_discount? `$${item.item_price}` : ""}</small></p>
                            <p><small>$${item.item_discount? item.item_discount_price : item.item_price}</small></p>
                        </div>
                        <div class="d-flex flex-column gap-3 w-25 justify-content-cente align-items-center">
                        <button class="text-black border-0 bg-white text-decoration-underline" onclick = "wishlist_item_delete('${item.id}')"><small>Remove</small></button>
                        <a class="text-black border-0 bg-white text-decoration-underline" href="item_details.html?item_id=${item.item_id}"><small>See details</small></a>
                        </div>
                        </div>
                        <hr>
                    `
                    wishlist_sm.appendChild(div_sm)
                })
            }
            else {
                const wishlist_section = document.getElementById('wishlist-section-right')
                const wishlist_section_sm = document.getElementById('wishlist-sm')
                const table = document.getElementById('wishlist-table')
                table.classList.add('d-none')
                wishlist_section.innerHTML = `
                    <p><small>Your wishlist is currently empty.</small></p>
                `
                wishlist_section_sm.innerHTML = `
                    <p><small>Your wishlist is currently empty.</small></p>
                `
            }
        })
    }
    else {
        window.location.href = 'index.html'
    }
}
wishlist()

const wishlist_item_delete = (id) => {
    const token = localStorage.getItem('token')
    fetch(`https://cloth-store-api-production.up.railway.app/user/wishlist/${id}/`,{
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