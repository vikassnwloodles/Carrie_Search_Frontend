import "../handlers/handle_forgot_password.js"


window.renderForgotPassword = function () {
    showForgotPasswordModal()
}


$("#showForgot").on("click", function (e) {
    e.preventDefault();
    renderForgotPassword()
})
