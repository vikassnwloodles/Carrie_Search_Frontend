import "../handlers/handle_logout.js"


$("#logout-link").on("click", function (e) {
    e.preventDefault()
    renderLogout()
})
