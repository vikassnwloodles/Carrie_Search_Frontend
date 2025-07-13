import "../handlers/handle_login.js"


window.renderLogin = function () {
    showLoginModal()
}


$("#login-link").on("click", function (e) {
    e.preventDefault()
    renderLogin()
})
