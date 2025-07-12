import "../utils.js"
import "../html_content/signup_content.js"


window.renderSignup = function () {
    loadPageContent({html_content: signupContent})
}


$("#signup-link").on("click", function(e){
    e.preventDefault()
    renderSignup()
})