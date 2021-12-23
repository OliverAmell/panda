/**
 * login
 */
 function onLogin() {
    let user = document.querySelector('input[name="username"]')//用户名框
    let key = document.querySelector('input[name="password"]')//密码框
    let logIn = document.querySelector('#loginBtn')//登录按钮
    let register = document.querySelector('#registerBtn')//注册按钮

    localStorage.setItem('dataLog', JSON.stringify([]))

    logIn.addEventListener('click', function () {
        let userValue = user.value
        let keyValue = key.value
        let dataLog = JSON.parse(localStorage.getItem('dataLog'))
        // console.log(dataLog.length);

        if (userValue == '' || keyValue == '') {
            alert('用户名和密码不能为空')
        }

        if (dataLog.length == 0 && userValue != '' && keyValue != '') {
            alert('您不是我们的客户,请先注册')
        } else if (dataLog.length != 0) {
            if (dataLog.find((item) => item.password == keyValue)) {
                alert('登陆成功，为您跳转购物车')
                location.href = `cart.html?name=${userValue}`
            } else {
                alert('请输入正确的用户名和密码')
            }
        }
    })

    register.addEventListener('click', function () {
        let userValue = user.value
        let keyValue = key.value
        let userList = JSON.parse(localStorage.getItem('dataLog'))
        let newUser = {
            user: userValue,
            password: keyValue
        }

        // 判断是否已经存在，
        let isNew = userList.find((item) => item.password == keyValue)
        if (userValue == '' || keyValue == '') {
            alert('用户名和密码不能为空')
        }
        if (userValue != '' && keyValue != '') {
            if (isNew) {
                // 如果已经存在
                alert('您已经是本平台客户，请不要重复注册')
            } else {
                //如果不存在
                userList.push(newUser)
                localStorage.setItem('dataLog', JSON.stringify(userList))
                alert('注册成功，您可以登录了')
            }
        }

    })

}

onLogin()