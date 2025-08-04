import "../../html_content/search_toast_box.js"


window.bindSearchHandler = function () {

    let selectedModel = "sonar";
    let isProModeEnabled = false;
    let isDeepResearchEnabled = false;
    let isLabsEnabled = false;
    let selectedSource = "web";


    $('#pro-mode-button').click(function () {
        alert("hi")
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


    function renderSearchResults(data) {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness
        const withLineBreaks = data.query.replace(/\n/g, "<br>");
        let resultsHtml = `<div class="animate-fade-in text-left mb-8 p-6 bg-white rounded-lg border border-gray-200">
                <!-- <h2 class="text-2xl font-bold mb-4">Results for: "${data.query}"</h2> -->
                <div class="w-full border border-gray-200 bg-white rounded-xl p-4 mb-8">

                    <!-- Text content -->
                    <div id="text-container"
                        class="text-container-${uniqueId} overflow-hidden transition-all duration-300 text-gray-800 leading-relaxed"
                        style="max-height: 120px;">
                        <p id="long-text" class="text-base">
                            <strong class="block text-md mb-2">${withLineBreaks}</strong>
                        </p>
                    </div>

                    <!-- Toggle button -->
                    <button id="toggle-btn"
                        class="toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 mt-3 hover:underline focus:outline-none">
                        <span class="toggle-text-${uniqueId}" id="toggle-text">Show more</span>
                        <svg id="toggle-icon" xmlns="http://www.w3.org/2000/svg" class="toggle-icon-${uniqueId} w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path class="toggle-path-${uniqueId}" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <script>
                            (function() {
                                let expanded = false;
                                $('.toggle-btn-${uniqueId}').on('click', function () {
                                    expanded = !expanded;
                                    $('.text-container-${uniqueId}').css("max-height", expanded ? "1000px" : "120px");
                                    const iconPath = expanded
                                        ? "M19 15l-7-7-7 7"
                                        : "M19 9l-7 7-7-7";
                                    $('.toggle-path-${uniqueId}').attr("d", iconPath);
                                    $('.toggle-text-${uniqueId}').text(expanded ? "Show less" : "Show more");
                                });
                            })();
                        </script>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">`;

        data.links.forEach(link => {
            resultsHtml += `
                    <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                        <h3 class="font-semibold text-teal-700">${link.title}</h3>
                        <a href="${link.url}" target="_blank" class="text-sm text-gray-500 truncate block">${link.url}</a>
                    </div>`;
        });

        resultsHtml += `</div>`;

        if (data.images && data.images.length > 0) {
            resultsHtml += `<h3 class="text-xl font-semibold mt-6 mb-4">Related Images:</h3>
                                <div class="image-carousel-wrapper">
                                    <button class="carousel-arrow left" id="image-carousel-left-arrow"><i class="fas fa-chevron-left"></i></button>
                                    <div class="image-carousel-container" id="image-carousel-container">`;
            data.images.forEach(image => {
                resultsHtml += `
                        <a href="${image.url}" target="_blank" class="image-card">
                            <img src="${image.src}" alt="Search result image">
                        </a>`;
            });
            resultsHtml += `    </div>
                                    <button class="carousel-arrow right" id="image-carousel-right-arrow"><i class="fas fa-chevron-right"></i></button>
                                </div>`;
        }

        // 👇 Insert this before resultsHtml += final block
        data.content = data.content.replace(/<table([\s\S]*?)<\/table>/g, function (match) {
            return `<div class="overflow-x-auto w-full my-4 rounded-md border border-gray-200">${match}</div>`;
        });


        resultsHtml += `<div class="bg-white p-6 rounded-lg border border-gray-200 mb-4"><p>${data.content}</p></div></div>`;

        $('#search-results-container').append(resultsHtml).show();

        $('#image-carousel-left-arrow').on('click', function () {
            $('#image-carousel-container').animate({
                scrollLeft: $('#image-carousel-container').scrollLeft() - 750 // Scroll left by 750px
            }, 400);
        });

        $('#image-carousel-right-arrow').on('click', function () {
            $('#image-carousel-container').animate({
                scrollLeft: $('#image-carousel-container').scrollLeft() + 750 // Scroll right by 750px
            }, 400);
        });

    }


    function searchAjax(form, token) {
        var links = [];
        var content = null;
        var images = [];

        // const loadingHtml = `<div class="animate-fade-in text-center text-gray-500 p-6 bg-white rounded-lg border border-gray-200" id="loading-message">Searching...</div>`;

        const $searchToastBox = $(searchToastBox.trim());
        $searchToastBox.attr("id", "loading-message").text("Please standby, Pete is working to make your life and work easier...!")
        $searchToastBox.addClass("animate-fade-in text-gray-500").removeClass("text-red-500 mb-8")
        const loadingHtml = $searchToastBox.prop("outerHTML");
        $('#search-results-container').append(loadingHtml).show();

        var settings = {
            "url": window.env.BASE_URL + "/api/search/",
            "method": "POST",
            "timeout": 0,
            "headers": { "Authorization": "Bearer " + token },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (responseData) {
            $('#loading-message').remove();
            var response = JSON.parse(responseData);

            if (response && response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
                var searchContent = response.choices[0].message.content;

                if (response.search_results) {
                    for (let index = 0; index < response.search_results.length; index++) {
                        const element = response.search_results[index];
                        links.push({ title: element.title, url: element.url });
                    }
                }


                if (response.images) {
                    for (let index = 0; index < response.images.length; index++) {
                        const img = response.images[index];
                        images.push({ src: img.image_url, url: img.origin_url });
                    }
                }

                content = structuredData(searchContent);

                const mockResponse = {
                    query: form.get("prompt"),
                    links: links,
                    images: images,
                    content: content
                };
                renderSearchResults(mockResponse);

            } else {
                $('#loading-message').remove();
                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Search failed, please try again.")
                $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            }

            $('#search-results-container').css('margin-bottom', "150px");

        }).fail(function (e) {
            $('#loading-message').remove();
            if (e.responseText) {
                var error_msg = JSON.parse(e.responseText)
            }
            if (error_msg?.error) {
                const toastOptions = [{
                    status_code: 402,
                    title: "Subscription Required",
                    message: "You’ve reached your free usage cap. Subscribe to continue searching.",
                    type: "info"
                }]

                showToast({ response: e, toastOptions })
                renderPricing()
            }
            else {
                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Search failed, please try again.")
                $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            }
        }).always(function () {
            // ✅ runs on both success and failure
            // $('#search-results-container').css('margin-bottom', "150px");
        });
    }


    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });



    function handleAISearchSubmission() {
        if ($('#main-logo').hasClass('text-8xl')) {
            $('#center-content-wrapper').removeClass('justify-center flex-1').addClass('justify-start pt-8');
            $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6');
        }

        const fileSelected = $('#file-upload')[0].files[0];
        const token = localStorage.getItem('accessToken');
        const searchQueryData = $('#ai_search').val();

        if (searchQueryData === "") return;

        hideUploadedFileMetadataBox();
        $("#ai_search").val("").blur();
        autoGrowSearchBox(document.getElementById("ai_search"));
        $("#ai_search").focus();
        $(".main-logo").addClass("hidden");
        $("#footer").addClass("hidden");
        $("#search-form").css({ "position": "fixed", "bottom": "-20px" });
        $("#ai_search").attr("placeholder", "Inquire Further, Ask Another Question");

        const dynamicHeight = $('#dynamic-content-container').height();
        const searchToastBoxHeight = getHtmlStringHeight(searchToastBox.trim());
        $('#search-results-container').css('margin-bottom', dynamicHeight - searchToastBoxHeight - 32 + 'px');
        $('#dynamic-content-container').animate({
            scrollTop: $('#dynamic-content-container')[0].scrollHeight
        }, 500);

        if (!token) {
            const $searchToastBox = $(searchToastBox.trim());
            $searchToastBox.text("Please log in to perform a search.");
            $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
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
        handleAISearchSubmission();
    });







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


    window.handleKeyDownOnSearchBox = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();      // ⛔ Prevent default newline behavior
            handleAISearchSubmission();           // ✅ Call your message sending logic
        }
    }

    window.autoGrowSearchBox = function (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

}


