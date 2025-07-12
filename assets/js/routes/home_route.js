import "../utils.js"
import "../html_content/home_content.js"
import "../handlers/search_handlers/handle_search.js"
import "../handlers/search_handlers/handle_file_upload.js"


window.renderHome = function () {
    loadPageContent({ html_content: home_content, is_homepage: true })
    bindFileUploadHandler()
    bindSearchHandler()
}


$(".to-home").on("click", function(e){
    e.preventDefault()
    renderHome()
})