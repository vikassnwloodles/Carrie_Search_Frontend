import "../utils.js"
import "../html_content/pricing_content.js"
import "../handlers/handle_pricing.js"


window.renderPricing = function (){
    handleRenderPricing()
}

$("#pricing-link").on("click", function (e) {
    e.preventDefault()
    renderPricing()
})