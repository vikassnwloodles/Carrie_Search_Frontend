import "../../html_content/search_toast_box.js"
import "../../html_content/related_questions_container.js"


window.bindSearchHandler = function () {

    let selectedModel = "sonar";
    let isProModeEnabled = false;
    let isDeepResearchEnabled = false;
    let isLabsEnabled = false;
    let selectedSource = "web";


    $('#pro-mode-button').click(function () {
        $('#model-select-container').removeClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#deep-research-button').removeClass('text-blue-500').addClass('text-gray-500')
    });

    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });


    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });



    window.handleAISearchSubmission = function () {
        if ($('#search-form-btn i').hasClass('fa-stop')) {
            if (ongoingSearchRequest) {
                ongoingSearchRequest.abort();
                ongoingSearchRequest = null;

                $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');

                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Search aborted.");
                // $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
                $(`#${loadingHtmlContainerId}`).replaceWith($searchToastBox.prop("outerHTML"));
            }
            return;
        }


        if ($('#main-logo').hasClass('text-8xl')) {
            $('#center-content-wrapper').removeClass('justify-center flex-1').addClass('justify-start pt-8');
            $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6');
        }

        const fileSelected = $('#file-upload')[0].files[0];
        const token = localStorage.getItem('accessToken');
        // const searchQueryData = $('#ai_search').val();
        // const searchQueryData = $('#ai_search').text().trim();
        const searchQueryData = $('#ai_search').html().replace(/<br\s*\/?>/gi, '\n');

        if (searchQueryData === "") return;

        hideUploadedFileMetadataBox();
        $("#ai_search").text("").blur();
        autoGrowSearchBox(document.getElementById("ai_search"));
        $("#ai_search").focus();
        $(".main-logo").addClass("hidden");
        $("#footer").addClass("hidden");
        $("#dummy-footer").removeClass("hidden");
        $("#search-form").css({ "position": "fixed", "bottom": "-20px" });
        // $("#ai_search").attr("placeholder", "Inquire Further, Ask Another Question");
        $("#ai_search").attr("data-placeholder", "Inquire Further, Ask Another Question");
        $('#search-form-btn i').removeClass('fa-arrow-right').addClass('fa-stop');

        // const dynamicHeight = $('#dynamic-content-container').height();
        // const searchToastBoxHeight = getHtmlStringHeight(searchToastBox.trim());
        // $('#search-results-container').css('margin-bottom', dynamicHeight - searchToastBoxHeight - 32 + 'px');
        $('#dynamic-content-container').animate({
            scrollTop: $('#dynamic-content-container')[0].scrollHeight
        }, 500);
        $('#center-content-wrapper').removeClass('justify-center');

        if (!token) {
            const $searchToastBox = $(searchToastBox.trim());
            $searchToastBox.text("Please log in to perform a search.");
            $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');
            return;
        }

        if (fileSelected) {
            const isImage = fileSelected.type.startsWith("image/");
            const fieldName = isImage ? "image" : "file";
            const url = window.env.BASE_URL + (isImage ? "/api/upload-image/" : "/api/upload-doc/");
            const formData = new FormData();
            formData.append(fieldName, fileSelected, fileSelected.name);

            $.ajax({
                url: url,
                method: "POST",
                timeout: 0,
                headers: { "Authorization": "Bearer " + token },
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                data: formData
            }).done(function (response) {
                var responseData = JSON.parse(response);
                const prompt = (responseData.text_content ? `${responseData.text_content}\n\n\n${searchQueryData}` : searchQueryData);
                var form = new FormData();
                form.append("prompt", prompt);
                form.append("image_url", responseData.image_url);
                form.append("model", selectedModel);
                form.append("search_mode", selectedSource);
                form.append("pro", isProModeEnabled);
                form.append("deep_research", isDeepResearchEnabled);
                form.append("labs", isLabsEnabled);
                form.append("return_images", true);

                searchAjax(form, token);
                $('#file-upload').val('');
            }).fail(function () {
                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Image upload failed. Please try again.");
                $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            });

        } else {
            var form = new FormData();
            form.append("prompt", searchQueryData);
            form.append("model", selectedModel);
            form.append("search_mode", selectedSource);
            form.append("pro", isProModeEnabled);
            form.append("deep_research", isDeepResearchEnabled);
            form.append("labs", isLabsEnabled);
            form.append("return_images", true);

            searchAjax(form, token);
        }
    }



    $('#search-form').on('submit', function (e) {
        e.preventDefault();
        const searchQueryData = $('#ai_search').html().replace(/<br\s*\/?>/gi, '\n');
        renderSearchResult(searchQueryData)
    });

    window.handleKeyDownOnSearchBox = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();      // ⛔ Prevent default newline behavior
            if ($('#search-form-btn i').hasClass('fa-arrow-right')) {
                const searchQueryData = $('#ai_search').html().replace(/<br\s*\/?>/gi, '\n');
                renderSearchResult(searchQueryData)
            }
        }
    }


    // ################### DROPDOWNS ###################
    const $sourceDropdown = $('#source-dropdown');
    const $proModeDropdown = $('#pro-mode-dropdown');
    const $deepResearchDropdown = $('#deep-research-dropdown');
    const $labsDropdown = $('#labs-dropdown');
    const $modelDropdown = $('#model-dropdown');

    const dropdownList = [
        $sourceDropdown,
        $proModeDropdown,
        $deepResearchDropdown,
        $labsDropdown,
        $modelDropdown
    ]

    // Function to close all dropdowns
    window.closeAllDropdowns = function ({ skipDropdown } = {}) {
        // $modelDropdown.addClass('hidden');
        // $sourceDropdown.addClass('hidden');
        // $proModeDropdown.addClass('hidden');
        // $deepResearchDropdown.addClass('hidden');
        // $labsDropdown.addClass('hidden');
        dropdownList.forEach(dropdown => {
            if (dropdown !== skipDropdown) dropdown.addClass("hidden")
        })
    }


    // --- Source Selection Dropdown Logic ---
    const $sourceSelectButton = $('#source-select-button');

    const $proModeButton = $('#pro-mode-button');

    const $deepResearchButton = $('#deep-research-button');

    const $labsButton = $('#labs-button');

    const $managePlan = $('#manage-plan');

    const $modelSelectButton = $('#model-select-button');


    // Toggle dropdown visibility for source
    $sourceSelectButton.on('click', function (e) {
        // e.stopPropagation();
        // closeAllDropdowns({ skipDropdown: $sourceDropdown }); // Close others first
        $sourceDropdown.toggleClass('hidden');
    });


    $(document).on('click', function (e) {
        // if (!$modelDropdown.hasClass('hidden') && !$(e.target).closest('#model-dropdown').length && !$(e.target).closest('#model-select-button').length) {
        //     $modelDropdown.addClass('hidden');
        // }

        // Check if click is outside any dropdown or their trigger buttons
        const isClickOutside = (dropdown, button) =>
            !dropdown.hasClass('hidden') &&
            !$(e.target).closest(dropdown).length &&
            !$(e.target).closest(button).length;

        if (isClickOutside($modelDropdown, $modelSelectButton)) {
            $modelDropdown.addClass('hidden');
        }
        if (isClickOutside($sourceDropdown, $sourceSelectButton)) {
            $sourceDropdown.addClass('hidden');
        }
        if (isClickOutside($proModeDropdown, $proModeButton)) {
            $proModeDropdown.addClass('hidden');
        }
        if (isClickOutside($deepResearchDropdown, $deepResearchButton)) {
            $deepResearchDropdown.addClass('hidden');
        }
        if (isClickOutside($labsDropdown, $labsButton)) {
            $labsDropdown.addClass('hidden');
        }
    });

    function showContextMenuAbove(target) {
        const offset = target.offset();
        const menu = $modelDropdown;

        const menuHeight = menu.outerHeight();
        const menuWidth = menu.outerWidth();

        menu.css({
            position: "fixed",
            top: offset.top - menuHeight - 8 + "px",
            left: offset.left - menuWidth + 32 + "px"
        })
    }

    $modelSelectButton.on("click", function () {
        showContextMenuAbove($(this));
        $modelDropdown.toggleClass('hidden');
    });

    // $(document).on('click', '#model-select-button', function (e) {
    //     e.stopPropagation();
    //     // const $modelDropdown = $('#model-dropdown'); // ✅ fresh reference
    //     $modelDropdown.toggleClass('hidden');
    //     closeAllDropdowns({skipDropdown: $modelDropdown})
    // });

    // Handle source selection
    $sourceDropdown.on('click', '.source-option', function () {
        selectedSource = $(this).data('source-value');
        // Optionally, visually indicate the selected source (e.g., add a class)
        $('.source-option').removeClass('bg-teal-100'); // Remove highlight from previous selection
        $(this).addClass('bg-teal-100'); // Highlight current selection
        $sourceDropdown.addClass('hidden'); // Hide dropdown after selection
    });
    // Set initial highlight for default source
    $('.source-option[data-source-value="' + selectedSource + '"]').addClass('bg-teal-100');


    $modelDropdown.on('click', '.model-option', function () {
        let $clicked = $(this);
        selectedModel = $clicked.data('model-value');

        $modelDropdown.find(".model-option").each(function () {
            $(this).find("p").eq(0).addClass("text-gray-800");
            $(this).find("p").eq(1).addClass("text-gray-600");
        });

        $clicked.find("p").eq(0).removeClass("text-gray-800").addClass("text-blue-500");
        $clicked.find("p").eq(1).removeClass("text-gray-600").addClass("text-blue-500");

        $modelDropdown.addClass('hidden');
    });

    // window.autoGrowSearchBox = function (textarea) {
    //     textarea.style.height = "auto";
    //     textarea.style.height = textarea.scrollHeight + "px";
    // }

    window.autoGrowSearchBox = function (el) {
        // Reset height to allow shrink
        el.style.height = "auto";

        // Get full height needed
        const scrollHeight = el.scrollHeight;

        // Set new height
        el.style.height = scrollHeight + "px";
    };

}


