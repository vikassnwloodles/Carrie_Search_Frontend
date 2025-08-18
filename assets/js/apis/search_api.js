// window.call_search_api = function (searchQuery, imageUrl = "", searchResultId = null) {
window.call_search_api = function ({ searchQuery, imageUrl = "", searchResultId = null }) {
    const token = localStorage.getItem('accessToken');
    var form = new FormData();
    form.append("prompt", searchQuery);
    form.append("image_url", imageUrl);
    form.append("search_result_id", searchResultId);

    return $.ajax({
        url: window.env.BASE_URL + "/api/search/",
        method: "POST",
        timeout: 0,
        headers: {
            "Authorization": "Bearer " + token
        },
        data: form,
        processData: false, // Important for FormData
        contentType: false  // Let jQuery set it automatically
    });
}
