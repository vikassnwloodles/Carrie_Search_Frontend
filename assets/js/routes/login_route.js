import "../handlers/handle_login.js"


$("#login-link").on("click", function (e) {
    e.preventDefault()
    renderLogin()
})
