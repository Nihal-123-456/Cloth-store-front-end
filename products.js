const colorview = () => {
    fetch('https://cloth-store-api.onrender.com/product/color/')
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('color-list')
        data.forEach((item)=>{
            const li = document.createElement('li')
            li.classList.add('list-unstyled')
            li.classList.add('mb-5')
            li.innerHTML = `
                <a class="d-none text-black text-decoration-none p-3" id="${item.title}" onclick='sortByColor("${item.title}")' style="cursor: pointer;">${item.title}</a>
            `
            parent.appendChild(li)
        })
        var activecolors = JSON.parse(localStorage.getItem('activeColors')) || [];
        if(activecolors.length>0){
            activecolors.forEach((item)=>{
                var color = document.getElementById(item)
                if(color){
                    color.classList.add('active')
                }
            })
        }
    })
}
colorview()

const sizeview = () => {
    fetch('https://cloth-store-api.onrender.com/product/size/')
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('size-list')
        data.forEach((item)=>{
            const li = document.createElement('li')
            li.classList.add('list-unstyled')
            li.classList.add('mb-5')
            li.innerHTML = `
                <a class="d-none text-black text-decoration-none p-3" id="${item.title}" onclick='sortBySize("${item.title}")' style="cursor: pointer;">${item.title}</a>
            `
            parent.appendChild(li)
        })
        var activesizes = JSON.parse(localStorage.getItem('activeSizes')) || [];
        if(activesizes.length>0){
            activesizes.forEach((item)=>{
                var size = document.getElementById(item)
                if(size){
                    size.classList.add('active')
                }
            })
        }
    })
}
sizeview()

const sortByCategory = (category) => {
    localStorage.setItem('category', category)
    productlist()
}

const sortByParam = (param) => {
    localStorage.setItem('param', param)
    productlist()
}

const sortByRating = (id) => {
    localStorage.setItem('rating', id);
    productlist()
}

const sortByColor = (id) => {
    var activeLinks = JSON.parse(localStorage.getItem('activeColors')) || [];
    const linkElement = document.getElementById(id);
    if(activeLinks.includes(id)){
        linkElement.classList.remove('active');
        activeLinks = activeLinks.filter(linkId => linkId !== id);
    }
    else {
        linkElement.classList.add('active');
        activeLinks.push(id);
    }
    localStorage.setItem('activeColors', JSON.stringify(activeLinks));
    productlist()
}

const sortBySize = (id) => {
    var activeLinks = JSON.parse(localStorage.getItem('activeSizes')) || [];
    const linkElement = document.getElementById(id);
    if(activeLinks.includes(id)){
        linkElement.classList.remove('active');
        activeLinks = activeLinks.filter(linkId => linkId !== id);
    }
    else {
        linkElement.classList.add('active');
        activeLinks.push(id);
    }
    localStorage.setItem('activeSizes', JSON.stringify(activeLinks));
    productlist()
}

const removesort = () => {
    localStorage.removeItem('param')
    productlist()
}
const removerating = () => {
    localStorage.removeItem('rating')
    productlist()
}
const removecolor = (id) => {
    var activeLinks = JSON.parse(localStorage.getItem('activeColors')) || [];
    const linkElement = document.getElementById(id);
    linkElement.classList.remove('active');
    activeLinks = activeLinks.filter(linkId => linkId !== id);
    localStorage.setItem('activeColors', JSON.stringify(activeLinks))
    productlist()
}
const removesize = (id) => {
    var activeLinks = JSON.parse(localStorage.getItem('activeSizes')) || [];
    const linkElement = document.getElementById(id);
    linkElement.classList.remove('active');
    activeLinks = activeLinks.filter(linkId => linkId !== id);
    localStorage.setItem('activeSizes', JSON.stringify(activeLinks))
    productlist()
}

const categorylist = () => {
    const path = document.getElementById('category-path')
    fetch('https://cloth-store-api.onrender.com/product/category/')
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('categories')
        data.forEach((item)=>{
            const li = document.createElement('li')
            li.classList.add('list-unstyled')
            li.innerHTML = `
                <div class="border-0" onclick="sortByCategory('${item.title}')" style="cursor: pointer;">
                    <div class="">
                        <img src="${item.image}" class="categories-img" loading="lazy" alt="...">
                    </div>
                    <div class="p-0 pt-2 px-2">
                        <p class=""><small>${item.title}</small></p>
                    </div>
                </div>
            `
            parent.appendChild(li)
        })
        parent.style.animation = 'load 0.7s forwards'
        setTimeout(()=>{
            parent.style.animation = 'none'
        },700)
    })
}
categorylist()

const productlist = () => {
    const category = localStorage.getItem('category')
    const sort_param = localStorage.getItem('param')
    const rating_param = localStorage.getItem('rating')
    const rating = rating_param=="no-rating"?"": rating_param
    const activecolors = JSON.parse(localStorage.getItem('activeColors')) || []
    const activesizes = JSON.parse(localStorage.getItem('activeSizes')) || []
    const colors = activecolors.length>0? activecolors.join(',') : ''
    const sizes = activesizes.length>0? activesizes.join(',') : ''
    const path = document.getElementById('category-path')
    fetch(`https://cloth-store-api.onrender.com/product/item/?category=${category?category:""}&sort=${sort_param?sort_param:""}&color=${colors}&size=${sizes}&average_rating=${rating?rating:""}`)
    .then((req)=>req.json())
    .then((data)=>{
        const parent = document.getElementById('products')
        parent.innerHTML=''
        document.getElementById('item-number').innerText=`${data.length} items`
        data.forEach((item)=>{
            const li = document.createElement('li')
            li.classList.add('list-unstyled')
            li.innerHTML = `
                <div class="card border-0">
                <div>
                    <img src="${item.images[0].image}" id="product-card-img" loading="lazy" alt="...">
                </div>
                <div class="card-body p-0 pt-2 lh-1">
                <a href="item_details.html?item_id=${item.id}" class="text-decoration-none text-black">
                    <div class="d-lg-flex">
                        <p class="flex-grow-1 fw-bold"><small>${item.title}</small></p>
                        ${item.discount? `<p class="px-lg-2 text-decoration-line-through" style="color: gray;"><small>$${item.price}</small></p>`:`<p class="px-lg-2"><small>$${item.price}</small></p>`}
                    </div>
                    <div class="d-flex">
                        <p class="flex-grow-1 fw-bold" style="color: red;"><small>${item.discount?`Sale. -${item.discount_percentage}%`:""}</small></p>
                        <p class="px-2"><small>${item.discount?`$${item.discount_price}`:""}</small></p>
                    </div>
                </a>
                </div>
            </div>
            `
            parent.appendChild(li)
        })

        if(sort_param){
            const p = document.getElementById('sort-param')
            if(sort_param!="default"){
                p.innerHTML = `<small class="d-flex align-items-center gap-2 bg-black text-white px-2 pt-1 pb-1 rounded-5" style="font-size: 12px; cursor: pointer;" onclick="removesort()"><span>${sort_param}</span> <span class="material-symbols-outlined">
                    close
                </span></small>`
            }
            else{
                p.innerHTML=""
            }
            document.getElementById(sort_param).checked = true
        }
        else{
            document.getElementById('sort-param').innerHTML=""
            document.getElementById("default").checked = true
        }

        if(rating_param){  
            const p = document.getElementById('rating-param')
            if(rating_param!="no-rating"){
                p.innerHTML = `<small class="d-flex align-items-center gap-2 bg-black text-white px-2 pt-1 pb-1 rounded-5" style="font-size: 12px; cursor: pointer;" onclick="removerating()"><span>${rating_param} star</span> <span class="material-symbols-outlined">
                    close
                </span></small>`
            }
            else{
                p.innerHTML=""
            }   
            document.getElementById(rating_param).checked = true
        }
        else{
            document.getElementById('rating-param').innerHTML=""
            document.getElementById("no-rating").checked = true
        }

        if(activecolors.length>0){
            const div = document.getElementById('color-param')
            div.innerHTML = ""
            activecolors.forEach((item)=>{
                const p = document.createElement('p')
                p.innerHTML = `<small class="d-flex align-items-center gap-2 bg-black text-white px-2 pt-1 pb-1 rounded-5" style="font-size: 12px; cursor: pointer;" onclick="removecolor('${item}')"><span>${item}</span> <span class="material-symbols-outlined">
                close
                </span></small>`
                div.appendChild(p)
            })
        }
        else{
            document.getElementById('color-param').innerHTML=""
        }
        if(activesizes.length>0){
            const div = document.getElementById('size-param')
            div.innerHTML = ""
            activesizes.forEach((item)=>{
                const p = document.createElement('p')
                p.innerHTML = `<small class="d-flex align-items-center gap-2 bg-black text-white px-2 pt-1 pb-1 rounded-5" style="font-size: 12px; cursor: pointer;" onclick="removesize('${item}')"><span>${item}</span> <span class="material-symbols-outlined">
                close
                </span></small>`
                div.appendChild(p)
            })
        }
        else{
            document.getElementById('size-param').innerHTML=""
        }
        path.innerHTML = `<p class="mb-lg-3">${category?"> "+category:""}</p>`
        document.getElementById('show-btn').innerHTML = `Show (${data.length})`
        parent.style.animation = 'load 0.7s forwards'
        setTimeout(()=>{
            parent.style.animation = 'none'
        },700)
    })
}
productlist()

const resetall = () => {
    if (localStorage.getItem('category')){
        localStorage.removeItem('category')
    }
    if (localStorage.getItem('param')){
        localStorage.removeItem('param')
    }
    if (localStorage.getItem('rating')){
        localStorage.removeItem('rating')
    }
    if (localStorage.getItem('activeColors')){
        var activeColors = JSON.parse(localStorage.getItem('activeColors'))
        activeColors.forEach((item) => {
            var element = document.getElementById(item);
            if (element) {
                element.classList.remove('active');
            } else {
                console.log(`Element with ID ${item} not found.`);
            }
        })
        localStorage.removeItem('activeColors')
    }
    if (localStorage.getItem('activeSizes')){
        var activeSizes = JSON.parse(localStorage.getItem('activeSizes'))
        activeSizes.forEach((item) => {
            var element = document.getElementById(item);
            if (element) {
                element.classList.remove('active');
            } else {
                console.log(`Element with ID ${item} not found.`);
            }
        })
        localStorage.removeItem('activeSizes')
    }
    productlist()
}

const check_page_referrer = () => {
    const index = localStorage.getItem('index')
    const referrer = document.referrer;
    const navigationEntries = performance.getEntriesByType("navigation");
    const getPath = (url) => {
        try {
            return new URL(url).pathname;
        } catch (e) {
            return "";
        }
    };
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
        console.log("The page was reloaded.");
    } else {
        const referrerPath = getPath(referrer);
        if (referrerPath === '/products.html' || index === 'true') {
            console.log("The page was reloaded.");
            localStorage.removeItem('index')
        } else if (referrerPath) {
            console.log("The user came from another page.");
            resetall();
        } else {
            console.log("Direct access or unknown navigation.");
            resetall();
        }
}}
check_page_referrer()

const show_filter_options = () => {
    const filter = document.getElementById('filter-options')
    const btns = document.querySelectorAll('#show-btn, #reset-btn');
    filter.classList.add('show')
    filter.style.animation = 'filtershow 0.4s forwards'
    setTimeout(()=>{
        btns.forEach(btn=>{
            btn.classList.remove('d-none')
        })
        filter.style.animation = 'none'
    },400)
}
const close_filter_options = () => {
    const filter = document.getElementById('filter-options')
    const btns = document.querySelectorAll('#show-btn, #reset-btn');
    filter.style.animation = 'filterclose 0.4s forwards'
    btns.forEach(btn=>{
        btn.classList.add('d-none')
    })
    setTimeout(()=>{
        filter.classList.remove('show')
        filter.style.animation = 'none'
    },400)
}

const show_sort = () => {
    const sort = document.getElementById('collapseOne')
    const inputs = sort.querySelectorAll('div')
    if(sort.classList.contains('collapse')){
        sort.classList.remove('collapse')
        sort.style.animation = 'sortopen 0.7s forwards'
        setTimeout(()=>{
            inputs.forEach(input => {
                input.classList.remove('d-none')
                input.classList.add('d-flex')
            })
        },700)
    }
    else{
        sort.style.animation = 'sortclose 0.7s forwards'
        inputs.forEach(input => {
            input.classList.remove('d-flex')
            input.classList.add('d-none')
        })
        setTimeout(()=>{
            sort.classList.add('collapse')
        },700)
    }
}
const show_color = () => {
    const sort = document.getElementById('collapseTwo')
    const inputs = sort.querySelectorAll('a')
    if(sort.classList.contains('collapse')){
        sort.classList.remove('collapse')
        sort.style.animation = 'sortopen 0.7s forwards'
        setTimeout(()=>{
            inputs.forEach(input => {
                input.classList.remove('d-none')
            })
        },700)
    }
    else{
        sort.style.animation = 'sortclose 0.7s forwards'
        inputs.forEach(input => {
            input.classList.add('d-none')
        })
        setTimeout(()=>{
            sort.classList.add('collapse')
        },700)
    }
}
const show_size = () => {
    const sort = document.getElementById('collapseThree')
    const inputs = sort.querySelectorAll('a')
    if(sort.classList.contains('collapse')){
        sort.classList.remove('collapse')
        sort.style.animation = 'sizeopen 0.7s forwards'
        setTimeout(()=>{
            inputs.forEach(input => {
                input.classList.remove('d-none')
            })
        },700)
    }
    else{
        sort.style.animation = 'sizeclose 0.7s forwards'
        inputs.forEach(input => {
            input.classList.add('d-none')
        })
        setTimeout(()=>{
            sort.classList.add('collapse')
        },700)
    }
}
const show_rating = () => {
    const sort = document.getElementById('collapseFour')
    const inputs = sort.querySelectorAll('div')
    if(sort.classList.contains('collapse')){
        sort.classList.remove('collapse')
        sort.style.animation = 'sortopen 0.7s forwards'
        setTimeout(()=>{
            inputs.forEach(input => {
                input.classList.remove('d-none')
                input.classList.add('d-flex')
            })
        },700)
    }
    else{
        sort.style.animation = 'sortclose 0.7s forwards'
        inputs.forEach(input => {
            input.classList.remove('d-flex')
            input.classList.add('d-none')
        })
        setTimeout(()=>{
            sort.classList.add('collapse')
        },700)
    }
}