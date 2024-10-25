const sortByCategory = (category) => {
    localStorage.setItem('category', category)
    localStorage.setItem('index', true)
    window.location.href = 'products.html'
}

const categoryList =()=>{
    fetch('https://cloth-store-api-production.up.railway.app/product/category/')
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('category-sliders')
        data.forEach((item)=>{
            const li = document.createElement('li')
            li.innerHTML = `
                <div class="d-flex align-items-center gap-5">
                  <div><img src="${item.image}" alt=""></div>
                  <div>
                    <p class="fw-bold"><small>${item.title}.</small></p>
                    <p><small>${item.description}.</small></p>
                    <a onclick="sortByCategory('${item.title}')" class="text-black" style="cursor: pointer;"><small>Shop now</small></a>
                  </div>
                </div>
            `
            parent.appendChild(li)
        })
    })
}
categoryList()

const discountProductList =()=>{
    fetch('https://cloth-store-api-production.up.railway.app/product/item/?sort=discount')
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('discount-sliders')
        data.forEach((item)=>{
            const li = document.createElement('li')
            li.innerHTML = `
                <div class="card border-0 p-3">
                    <div class="ratio ratio-1x1">
                        <img src="${item.images[0].image}" class="card-img-top" loading="lazy" alt="...">
                    </div>
                    <div class="card-body p-0 pt-2 mt-3">
                        <a href="item_details.html?item_id=${item.id}" class="text-decoration-none text-black">
                        <p class="fw-bold"><small>${item.title}</small></p>
                        <p><small>Discount. -${item.discount_percentage}%</small></p>
                        <div class="d-flex">
                            <p class="text-decoration-line-through text-body-tertiary"><small>$${item.price}</small></p>
                            <p class="px-2"><small>$${item.discount_price}</small></p>
                        </div>
                        </a>
                    </div>
                </div>
            `
            parent.appendChild(li)
        })
    })
}
discountProductList()