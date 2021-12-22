

const tableEle = document.querySelector('table')
let stateAll = false //全选状态
/**
 * 显示购物车列表
 */
function showCartList() {
    // 1. 从localstorage中获取购物车商品数据
    let cartListStr = localStorage.getItem('CARTLIST')
    let carts = JSON.parse(cartListStr)


    let str = `<tr>
            <td><input type="checkbox" class="checkbox-all" ${stateAll ? 'checked' : ''}></td>
            <td>序号</td>
            <th>商品图片</th>
            <th>商品信息</th>
            <th>单价</th>
            <th>数量</th>
            <th>总价</th>
            <th>操作</th>
        </tr>
        `
    carts.forEach((item, index) => {
        let itemStr = `
                <tr>
                    <td><input type="checkbox" class="checkbox-item" ${item.state ? 'checked' : ''}></td>
                    <td data-id='${item.id}'>${index+1}</td>
                    <td><img src="${item.photo[0].url}" alt="shop03" width="150" height="110"></td>
                    <td class='xinXi'>${item.title}</td>
                    <td>￥${item.price}</td>
                    <td><input type="button" name="minus" value="-" ${item.num == 0 ? 'disabled' : ''} ><input type="text" name="amount"  value="${item.num}"><input type="button" name="plus" value="+"></td>
                    <td class="singleprice" width="100px">￥${item.singlePrice}</td>
                    <td><a href="#">移入收藏</a><br><a class="delete-btn" href="#">删除</a></td>
                </tr>
            `
        str += itemStr
    })

    tableEle.innerHTML = str
}

/**
 * 显示用户名
 */
function showName(){
    let url = location.href
    let index = url.indexOf('?')
    let subUrl = url.substring(index + 1)
    let name = subUrl.split('=')[1]
    let userName=document.querySelector('.header>span')
    userName.innerHTML='尊敬的'+name+'您好'
}
showName()
/**
 * 商品列表界面
 */
function toProductList() {
    const productListBtn = document.querySelector('#product-list')
    productListBtn.onclick = function () {
        location.href = 'index.html'
    }
}
toProductList()

/**
 * 商品数量操作加一、减一 、删除、全选等
 */
function onCartProduct() {
    //输入计算总价
    tableEle.addEventListener('change', function (e) {
        e = e || window.event
        let target = e.target || e.srcElement
        if (target.getAttribute('name') == 'amount') {
            // 1. 找商品的id
            let id =
                target.parentElement.parentElement.firstElementChild.nextElementSibling
                    .innerHTML
            // 2. find 返回数组满足条件的元素
            // 从localstorage中获取购物车商品数据
            let cartListStr = localStorage.getItem('CARTLIST')
            let carts = JSON.parse(cartListStr)
            let product = carts.find(item => item.id == id)
            //判断输入的值是否为数字
            if (isNaN(target.value)) {
                alert('请输入数字，数量必须为数字')
                showCartList()
                return
            }
            //判断输入的值是否为负数
            if (target.value < 0) {
                // target.previousElementSibling.disabled = true
                alert('数值不能为负')
                showCartList()
                return
            }
            //判断输入的数字是否为小数
            if (parseInt(target.value) != parseFloat(target.value)) {
                alert('请输入整数')
                showCartList()
                return
            }
            product.num = target.value //设置数量值
            //改变单个商品总价
            let priceEle = product.price
            let totalPrice = priceEle * product.num //单价*数量=单个商品总价
            product.singlePrice = totalPrice.toFixed(2)
            //重新加载数据
            localStorage.setItem('CARTLIST', JSON.stringify(carts))
            allTotalPrice()
            showCartList()
        }
    })

    tableEle.addEventListener('click', function (e) {
        e = e || window.event
        let target = e.target || e.srcElement
        // 从localstorage中获取购物车商品数据
        let cartListStr = localStorage.getItem('CARTLIST')
        let carts = JSON.parse(cartListStr)
        //1.删除操作
        if (target.getAttribute('class') == 'delete-btn') {
            let index = target.getAttribute('data-index')
            //实现删除一项后，其他项目序号重新赋予并排序
            if (index == carts.length - 1) {
                carts.splice(index, 1)
            } else {
                carts.splice(index, 1)
                carts.forEach((item, a) => {
                    item.id = a + 1;
                })
            }
            localStorage.setItem('CARTLIST', JSON.stringify(carts))
            allTotalPrice()
            showCartList()
        }
        //2. 数量加一
        if (target.getAttribute('name') == 'plus') {
            // 1. 找商品的id
            let id =
                target.parentElement.parentElement.firstElementChild.nextElementSibling
                    .getAttribute('data-id')
            // 2. find 返回数组满足条件的元素
            let product = carts.find(item => item.id == id)
            // 3. 数量加一
            product.num++
            //4.改变单个商品总价
            let priceEle = product.price
            let totalPrice = priceEle * product.num //单价*数量=单个商品总价
            product.singlePrice = totalPrice.toFixed(2)
            //5. 重新加载数据
            localStorage.setItem('CARTLIST', JSON.stringify(carts))
            allTotalPrice()
            showCartList()
        }
        //3. 数量减一
        if (target.getAttribute('name') == 'minus') {
            // 1. 找商品的id
            let id =
                target.parentElement.parentElement.firstElementChild.nextElementSibling
                    .getAttribute('data-id')
            // 2. find 返回数组满足条件的元素
            let product = carts.find(item => item.id == id)
            // 3. 数量加一
            product.num--
            //4.改变单个商品总价
            let priceEle = product.price
            let totalPrice = priceEle * product.num //单价*数量=单个商品总价
            product.singlePrice = totalPrice.toFixed(2)
            //5. 重新加载数据
            localStorage.setItem('CARTLIST', JSON.stringify(carts))
            allTotalPrice()
            showCartList()
        }
        //4.全选框
        if (target.getAttribute('class') == 'checkbox-all') {
            //全选数据操作
            stateAll = !stateAll
            //全选框选中，则所有复选框选中
            if (stateAll) {
                carts.forEach((item) => (item.state = true))
            } else {
                carts.forEach((item) => (item.state = false))
            }
            localStorage.setItem('CARTLIST', JSON.stringify(carts))
            allTotalPrice()
            showCartList()
        }

        //5.复选框
        if (target.getAttribute('class') == 'checkbox-item') {
            //1.改变复选框自身状态
            let id =
                target.parentElement.nextElementSibling
                    .getAttribute('data-id')
            let product = carts.find((item) => item.id == id)

            product.state = !product.state
            //2.根据数组所有商品状态，确定全选状态
            stateAll = carts.every(item => item.state == true)
            localStorage.setItem('CARTLIST', JSON.stringify(carts))
            allTotalPrice()
            showCartList()
        }
    })
}
onCartProduct()

/**
 * 计算所有商品总价
 */
function allTotalPrice() {
    let sum = 0
    // 从localstorage中获取购物车商品数据
    let cartListStr = localStorage.getItem('CARTLIST')
    let carts = JSON.parse(cartListStr)
    carts.forEach((item) => {
        if (item.state) {
            sum += Number(item.singlePrice)
        }
    })


    let totalPriceEle = document.querySelector('#totalPrice')
    totalPriceEle.innerHTML = `￥${sum.toFixed(2)}`
}
allTotalPrice()

showCartList()

