let list = []
/**
 * 商品数据列表
 */
async function ShowProducts(pages) {
    try {
        //调用接口获取商品数据
        let data = await ajaxPromise({
            method: 'get',
            url: 'http://www.xiongmaoyouxuan.com/api/tab/1/feeds',
            data: {
                start: pages * 20,
                sort: 0
            }
        })
        let products = document.querySelector('.commodityData>ul')
        let num = data.data.list.length % 4
        if (num > 0) {
            data.data.list.splice(data.data.list.length - num, num)
        }
        //如果取到数据就赋给页面
        if (data.code == 200) {
            list = [...list, ...data.data.list]
            data.data.list = list
            // console.log(data);
            let content = template('product-list', data.data.list)
            products.innerHTML = content
        }
        //解决价格和购买人数等细节问题
        document.querySelectorAll('.isFreePostage').forEach((item, index) => {
            item.innerHTML = data.data.list[index].isFreePostage ? '包邮' : '不包邮'
        })
        document.querySelectorAll('.platform').forEach((item, index) => {
            if (data.data.list[index].platform == 1) {
                item.innerHTML = '淘宝'
            } else {
                item.innerHTML = '天猫'
            }
        })
        document.querySelectorAll('.bigPrice').forEach((item, index) => {
            item.innerHTML = parseInt(data.data.list[index].price)
        })
        document.querySelectorAll('.smallPrice').forEach((item, index) => {
            if (Math.round(data.data.list[index].price) == data.data.list[index].price) {
                item.innerHTML = '.0'
            } else {
                item.innerHTML = '.' + String(data.data.list[index].price).split('.')[1]

            }
        })
        document.querySelectorAll('.saleNum').forEach((item, index) => {
            if (data.data.list[index].saleNum > 10000) {
                item.innerHTML = (data.data.list[index].saleNum / 10000).toFixed(2) + '万人已买'
            } else {
                item.innerHTML = data.data.list[index].saleNum + '人已买'
            }
        })

    } catch (err) {
        console.log(err)
    }
}
ShowProducts(0)

// 节流
const throttle = (fn, time) => {
    let flag = true
    return function () {
        if (flag == false) return
        flag = false
        setTimeout(() => {
            fn.apply(this)
            flag = true
        }, time)
    }
}


/**
 * 点击查看更多加载商品数据
 */
function ShowMoreProduct() {
    let moreBtn = document.querySelector('.load>.btn')
    let flag = 0;
    moreBtn.addEventListener('click', throttle(function () {
        // alert(1)
        ShowProducts(++flag)
        window.onscroll = function () {
            if (document.documentElement.scrollTop + document.documentElement.clientHeight >= ((document.documentElement.scrollHeight) - 320)) {
                setTimeout(ShowProducts(++flag), 300)
            }
        }

    }, 500))
}
ShowMoreProduct()



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
 * 跳转详情页面
 */
 function turnToDetail(order){
    //新窗口跳转详情页面并将id放在url地址中传参
    window.open(`details.html?id=${order}`)
}