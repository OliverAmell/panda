/**
 * 跳转到首页
 */
 function turnToIndex() {
    let indexBtn = document.querySelector('#navigation li')
    indexBtn.addEventListener('click', function () {
        location.href = 'index.html'
    })
}
turnToIndex()

/**
 *获取商品id
 */
function getOrderNum() {
    let url = location.href
    let index = url.indexOf('?')
    let subUrl = url.substring(index + 1)
    let id = subUrl.split('=')[1]
    return id
}

/**
 * 获取商品数据
 */
async function getProductData() {
    let id = getOrderNum()
    try {
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/detail',
            data: {
                id: id,
            }
        })
        console.log(data);
        //tab切换(scss也需要解开注释代码)
        productImg(data)
        //轮播(需注释掉tab需要的scss)
        // ShowSwiper(data)

        dataShow(data)
        addCart(data.data.detail)
        localStorage.setItem('products', JSON.stringify([data.data.detail]))
    } catch (err) {
        console.log(err);
    }

}
getProductData()

/**
 * 数据渲染给页面 
 */
function dataShow(data) {
    //获取需动态化的节点
    let platform = document.querySelector('.platform')//淘宝或天猫
    let isFreePostage = document.querySelector('.isFreePostage')//是否包邮
    let txt = document.querySelector('.txt')//商品描述
    let yuan = document.querySelector('.yuan')//商品原价
    let bigPrice = document.querySelector('.bigPrice')//商品现价小数点前
    let smallPrice = document.querySelector('.smallPrice')//商品现价小数点后
    let token = document.querySelector('.token')//劵
    let saleNum = document.querySelector('.saleNum')//已买人数
    let tokenData = document.querySelector('.tokenData')//劵有效期
    let shopImg = document.querySelector('.shopImg')//卖家头像
    let shopName = document.querySelector('.shopName')//卖家name
    let wuLiu = document.querySelector('.score>li:first-child')//物流评分
    let fuWu = document.querySelector('.score>li:nth-child(2)')//服务评分
    let miaoShu = document.querySelector('.score>li:nth-child(3)')//描述评分
    let imgs = document.querySelector('.imgs')//下方大图

    //淘宝还是天猫
    if (data.data.detail.platform == 1) {
        platform.innerHTML = '淘'
    } else {
        platform.innerHTML = '天'
    }

    //包邮or不包邮
    isFreePostage.innerHTML = data.data.detail.isFreePostage ? '包邮' : '不包邮'
    //描述
    txt.innerHTML = data.data.detail.title
    //原价
    yuan.innerHTML = '原价￥' + data.data.detail.tbOriginPrice
    //现价小数点前
    bigPrice.innerHTML = parseInt(data.data.detail.price)
    //现价小数点后
    if (Math.round(data.data.detail.price) == data.data.detail.price) {
        smallPrice.innerHTML = '.0'
    } else {
        smallPrice.innerHTML = '.' + String(data.data.detail.price).split('.')[1]
    }
    //有无劵
    if (data.data.detail.couponStatus == "有券") {
        token.innerHTML = data.data.detail.couponValue
    } else {
        token.innerHTML = '无劵'
    }
    //已买人数是否超过10000
    if (data.data.detail.saleNum > 10000) {
        saleNum.innerHTML = (data.data.detail.saleNum / 10000).toFixed(2) + '万人已买'
    } else {
        saleNum.innerHTML = data.data.detail.saleNum + '人已买'
    }
    //优惠券有效期
    tokenData.innerHTML = '优惠有效期：' + data.data.detail.expireDate
    //卖家头像
    if (data.data.detail.shop.coverUrl == "http://") {
        shopImg.src = '../static/images/logo1.png'
    } else {
        shopImg.src = data.data.detail.shop.coverUrl
    }
    //卖家名字
    shopName.innerHTML = data.data.detail.shop.nickname
    //店铺评分
    miaoShu.innerHTML = data.data.detail.shop.itemScore
    fuWu.innerHTML = data.data.detail.shop.serviceScore
    wuLiu.innerHTML = data.data.detail.shop.deliveryScore
    //下方大图
    let content = template('detail-imgs', data.data.detail.descContentList)
    imgs.innerHTML = content
}



/**
 * 回到顶部
 */
function returnTop() {
    let returnBtn = document.querySelector('#return')
    window.onscroll = function () {
        //页面卷入高度，也就是滚动条距离顶部距离
        if (document.documentElement.scrollTop > parseInt(window.getComputedStyle(document.querySelector('#head')).height + 46)) {
            returnBtn.style.display = 'block'
        } else {
            returnBtn.style.display = 'none'
        }
    }
    returnBtn.addEventListener('click', function () {
        var obj = setInterval(function () {
            // 1. 获取当前滚动条位置(距离顶部距离)
            var scrollTop = getScrollTop()
            var dist = scrollTop - 100
            setScrollTop(dist)

            // 3.至到当前滚动条位置小于等于0为止     
            if (dist <= 0) {
                clearInterval(obj)
            }
        }, 10)
    })

    /*
      设置滚动条离顶部距离
    */
    function setScrollTop(dist) {
        if (document.body.scrollTop) {
            document.body.scrollTop = dist
        } else {
            document.documentElement.scrollTop = dist
        }
    }
    /*
      获取滚动条离顶部距离
    */
    function getScrollTop() {
        return document.body.scrollTop || document.documentElement.scrollTop
    }
}
returnTop()

/**
 * tab切换图片放大镜
 */
function productImg(data) {
    let productBox = document.querySelector('.product-img')
    console.log(productBox);
    let itemStr = data.data.detail.photo.map((item, index) => {
        return ` <div id="show_${index}"><img src="${item.url}" alt=""></div>`

    })
    let str = `
        <div id="top">
            <div id="son"><img src="${data.data.detail.photo[0].url}" alt=""></div>
            <img src="${data.data.detail.photo[0].url}" alt="" width='282' height='282'>
        </div>
        <div id="bottom">
            ${itemStr.join('')}
        </div>`
    productBox.innerHTML = str

    function ImageChange(big, small) {
        this.bigObj = big
        this.smallObj = small
    }
    ImageChange.prototype = {
        constructor: ImageChange,
        clear: function () {
            //清楚div原有样式
            for (let i = 0; i < this.smallObj.length; i++) {
                this.smallObj[i].classList.remove('active')
            }
        },
        changeImg: function () {
            for (let i = 0; i < this.smallObj.length; i++) {
                let _this = this
                this.smallObj[i].onclick = function () {
                    _this.clear()
                    this.classList.add('active')
                    _this.bigObj.src = `${this.firstElementChild.src}`
                    _this.bigObj.previousElementSibling.firstElementChild.src = `${this.firstElementChild.src}`
                }
            }
        }
    }

    let imgObj = document.querySelector('#top>img')
    let smallDiv = document.querySelectorAll('#bottom>div')

    let c1 = new ImageChange(imgObj, smallDiv)
    c1.changeImg()

    let glass1 = new GlassZoom('#top')
    glass1.moveGlass()

}

/**
   * 放大镜
   */
class GlassZoom {
    /**
     * 初始化属性节点
     * 
     */
    constructor(className) {
        this.root = document.querySelector(className)//显示图片right
        this.mask = this.root.querySelector('#son') //遮罩层mask，放大镜
        this.bigPicBox = this.root.querySelector('#son>img') //背景图bigpicBox
    }

    /**
     * 放大镜功能
     */
    moveGlass() {
        //移入显示遮罩层
        this.root.onmouseover = () => {
            this.mask.style.display = 'block'
        }
        //移出隐藏遮罩层
        this.root.onmouseout = () => {
            this.mask.style.display = 'none'
        }
        //移动遮罩层
        this.root.onmousemove = (e) => {
            e = e || window.event //事件对象

            let x = e.offsetX - this.mask.offsetWidth / 2
            let y = e.offsetY - this.mask.offsetHeight / 2

            if (x < 0) x = 0
            if (x > this.root.offsetWidth - this.mask.offsetWidth)
                x = this.root.offsetWidth - this.mask.offsetWidth
            if (y < 0) y = 0
            if (y > this.root.offsetHeight - this.mask.offsetHeight)
                y = this.root.offsetHeight - this.mask.offsetHeight

            this.mask.style.left = x + 'px'
            this.mask.style.top = y + 'px'

            // /**
            //    遮罩层移动距离        遮罩层
            //    ------------   =  ------------
            //    背景图片移动距离      放大镜

            //     背景图片移动距离 =  遮罩层移动距离*放大镜/遮罩层
            //  **/
            let moveX = x * (1 + 2.5 / 3)
            let moveY = y * (1 + 2.5 / 3)

            this.bigPicBox.style.left = -moveX + 'px'
            this.bigPicBox.style.top = -moveY + 'px'
        }
    }

}

/**
 * 跳转购物车界面
 */
function turnToCart() {
    let Btn = document.querySelector('.Btn>input:first-child')

    Btn.addEventListener('click', function () {
        let data = localStorage.getItem('CARTLIST')
        let isLog =JSON.parse(localStorage.getItem('isLog')) 
        // localStorage.setItem('isLog',JSON.stringify('false'))

        console.log(isLog);
        if (data.length != 2&&isLog) {
            window.open('cart.html')

        }else{
            alert('请添加商品且登录')
            window.open('login.html')
        }
    })

}
turnToCart()

/**
 * 添加购物车
 *   本质: 将商品数据添加到localStorage
 */
function addCart(data) {
    let Btn = document.querySelector(".Btn>input:last-child")
    Btn.addEventListener('click', function () {
        //1. 构造添加到购物车的商品数据
        let id = data.id
        let product = JSON.parse(localStorage.getItem('products')).find((item) => item.id == id)
        //   {
        //     id: 1004,
        //     name: 'react高级编程',
        //     picture: './image/book44.jpg',
        //     price: 48.9
        //   }
        product = {
            ...product, //选中商品
            num: 1, //数量
            singlePrice: product.price, //单个商品总价
            state: false // 选中状态
        }

        //  2.1. 从localstorage取出商品数据,如果是第一次，没有返回 空数组
        let productStr = localStorage.getItem('CARTLIST')
        let carts = JSON.parse(productStr) || []
        // 3.遍历购物车商品数组， 判断添加的商品，在商品数组中是否已经存在，
        let newProduct = carts.find((item) => item.id == product.id)
        if (newProduct) {
            // 3.1如果已经存在，改变商品数量
            newProduct.num++
        } else {
            //3.2如果不存在，添加一项商品
            carts.push(product)
        }

        //  4. 已经添加数据的数组重新写回localstorage
        localStorage.setItem('CARTLIST', JSON.stringify(carts))

        alert('添加购物车成功!')
    })
}
/**
 * 显示用户名
 */
function showUser(){
    let userList=JSON.parse(localStorage.getItem('dataLog'))
    if(userList.length!=0){
        // document.querySelector('').innerHTML=
    }
}