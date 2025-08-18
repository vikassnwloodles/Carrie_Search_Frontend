window.call_upload_file_api = function (fileSelected) {
    const token = localStorage.getItem('accessToken'); // Get token

    const isImage = fileSelected.type.startsWith("image/");
    const fieldName = isImage ? "image" : "file";
    const url = window.env.BASE_URL + (isImage ? "/api/upload-image/" : "/api/upload-doc/");
    const formData = new FormData();
    formData.append(fieldName, fileSelected, fileSelected.name);

    return $.ajax({
        url: url,
        method: "POST",
        timeout: 0,
        headers: { "Authorization": "Bearer " + token },
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: formData
    });
}
