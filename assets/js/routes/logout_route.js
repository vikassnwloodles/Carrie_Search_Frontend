import "../handlers/handle_logout.js"


function renderLogout() {
    handleRenderLogout()
}

$("#logout-link").on("click", function (e) {
    e.preventDefault()
    renderLogout()
})
