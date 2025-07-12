import "../utils.js"
import "../html_content/how_carrie_works_content.js"


window.renderHowCarrieWorks = function () {
    loadPageContent({html_content: howCarrieWorksContent})
}


$(".how-carrie-works-link").on("click", function(e){
    e.preventDefault()
    renderHowCarrieWorks()
})