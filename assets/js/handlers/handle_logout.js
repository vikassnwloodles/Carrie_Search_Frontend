// function updateHeaderAfterLogout(){
//     $("#login-link").removeClass("hidden")
//     $("#signup-link").removeClass("hidden")
//     $("#logout-link").addClass("hidden")
// }
import "../utils.js"

window.renderLogout = function () {
    localStorage.removeItem('accessToken');
    updateAuthUI()
}
