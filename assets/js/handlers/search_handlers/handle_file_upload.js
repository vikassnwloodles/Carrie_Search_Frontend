window.bindFileUploadHandler = function () {

    $('#file-upload-button').click(function () {
        $('#file-upload').click();
    });

    // Handle file metadata on selection
    $('#file-upload').on('change', function () {
        const file = this.files[0]; // Get the first file
        if (file) {
            const fullName = file.name;
            const shortNameLen = 40
            const shortName = fullName.length > shortNameLen ? fullName.slice(0, shortNameLen) + '...' : fullName;
            const fileSize = (file.size / 1024).toFixed(2)
            const fileType = file.type

            if (
                fileType !== "application/pdf" &&
                fileType !== "text/plain" &&
                fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                !fileType.startsWith("image/")
            ) {
                const toastOptions = [{
                    title: "Invalid File Type",
                    message: "Only PDF, DOCX, TXT, and image files are allowed.",
                    type: "warning"
                }]
                showToast({ toastOptions });
                $('#file-upload').val('');
                return;
            }

            $("#uploaded_filename").text(shortName)
            $("#uploaded_filesize").text(`${fileSize} KB`)
            $("#file-metadata-box").removeClass("hidden")
            $("#ai_search").removeClass("py-5").addClass("py-20")
        } else {
            // $('#file-info').html('No file selected');
            console.log("No file selected")
        }
    });


    window.hideUploadedFileMetadataBox = function () {
        $("#file-metadata-box").addClass("hidden")
        $("#ai_search").addClass("py-5").removeClass("py-20")
        $('#file-upload').val('');
    }


    $("#close_uploaded_file_metadata_box").on("click", function (e) {
        hideUploadedFileMetadataBox()
    })
}