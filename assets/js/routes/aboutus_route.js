import "../utils.js"
import "../html_content/aboutus_content.js"


window.renderAboutus = function () {
    loadPageContent({html_content: aboutus_content})
}


$("#about-us-link").on("click", function(e){
    e.preventDefault()
    renderAboutus()
})