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

            // HANDLING DYNAMIC ICON ASSIGNMENT
            let fileIconName = "fa-file"; // default

            if (fileType === "application/pdf") {
                fileIconName = "fa-file-pdf";
            }
            else if (fileType === "text/plain") {
                fileIconName = "fa-file-lines"; // icon for plain text
            }
            else if (fileType === "text/csv") {
                fileIconName = "fa-file-csv"; // Font Awesome Pro only
                // fallback if using Free version:
                // fileIconName = "fa-file-excel";
            }
            else if (fileType.startsWith("image/")) {
                fileIconName = "fa-file-image";
            }
            else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                fileIconName = "fa-file-word";
            }
            else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                fileIconName = "fa-file-excel";
            }
            else if (fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                fileIconName = "fa-file-powerpoint";
            }


            if (
                fileType !== "application/pdf" &&
                fileType !== "text/plain" &&
                fileType !== "text/csv" &&
                fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                fileType !== "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
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
            $('#uploaded-file-icon')
                .removeClass(function (i, c) {
                    return (c.match(/fa-\S+/g) || []).join(' ');
                })
                .addClass(fileIconName); // your custom class

            $("#file-metadata-box").removeClass("hidden")
            // $("#ai_search").removeClass("py-5").addClass("py-20")
            $("#searchbox_parent_div").addClass("py-20")

        } else {
            // $('#file-info').html('No file selected');
            console.log("No file selected")
        }
    });


    window.hideUploadedFileMetadataBox = function () {
        $("#file-metadata-box").addClass("hidden")
        // $("#ai_search").addClass("py-5").removeClass("py-20")
        $("#searchbox_parent_div").removeClass("py-20")
        $('#file-upload').val('');
    }


    $("#close_uploaded_file_metadata_box").on("click", function (e) {
        hideUploadedFileMetadataBox()
    })
}