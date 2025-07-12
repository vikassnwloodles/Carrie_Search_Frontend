window.bindSearchHandler = function () {

    let selectedModel = "sonar";
    let isProModeEnabled = false;
    let isDeepResearchEnabled = false;
    let isLabsEnabled = false;
    let selectedSource = "web";


    function renderSearchResults(data) {
        let resultsHtml = `<div class="animate-fade-in text-left mb-8 p-6 bg-white rounded-lg border border-gray-200">
                <h2 class="text-2xl font-bold mb-4">Results for: "${data.query}"</h2>
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
        console.log("Performing search with prompt:", form.get("prompt"));
        var links = [];
        var content = null;
        var images = [];

        const loadingHtml = `<div class="animate-fade-in text-center text-gray-500 p-6 bg-white rounded-lg border border-gray-200" id="loading-message">Searching...</div>`;

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
                $('#search-results-container').append('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Search failed, please try again.</p>');
            }

        }).fail(function (e) {
            $('#loading-message').remove();
            if (e.responseText) {
                var error_msg = JSON.parse(e.responseText)
            }
            if (error_msg.error) {
                $('#search-results-container').append(`<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">${error_msg.error}</p>`);
                showErrorToast({ title: "", res: e, message: error_msg.error })
                loadPageContent(pricingContentTemplate);
                checkSubscriptionStatus();
            }
            else {
                $('#search-results-container').append('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Search failed, please try again.</p>');
            }
        }).always(function () {
            // ✅ runs on both success and failure
            $('#search-results-container').css('margin-bottom', "150px");
        });
    }


    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });


    $('#search-form').on('submit', function (e) {
        e.preventDefault();

        if ($('#main-logo').hasClass('text-8xl')) {
            $('#center-content-wrapper').removeClass('justify-center flex-1').addClass('justify-start pt-8');
            $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6');
        }

        const fileSelected = $('#file-upload')[0].files[0];
        const token = localStorage.getItem('accessToken');
        const searchQueryData = $('#ai_search').val();
        if (searchQueryData === "") {
            return
        }
        else {
            $("#ai_search").val("").blur()
            $("#ai_search").focus()  // Using blur and focus to hide Chrome's autocomplete popup that stays at the old position when the search box is moved to the bottom
            $(".main-logo").addClass("hidden")
            $("#footer").addClass("hidden")
            $("#search-form").css({ "position": "fixed", "bottom": "-20px" })
            const dynamicHeight = $('#dynamic-content-container').height(); // or .height()
            const headerHeight = $('#header').outerHeight(); // or .height()
            $('#search-results-container').css('margin-bottom', dynamicHeight - headerHeight - 32 + 'px');
            $('#dynamic-content-container').animate({
                scrollTop: $('#dynamic-content-container')[0].scrollHeight
            }, 500); // 500ms animation
        }

        if (!token) {
            $('#search-results-container').append('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Please log in to perform a search.</p>').show();
            // $('#search-results-container').append('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Please log in to perform a search.</p>').show();
            return;
        }

        if (fileSelected) {
            alert("file selected")
            const isImage = fileSelected.type.startsWith("image/");
            const fieldName = isImage ? "image" : "file";
            const url = window.env.BASE_URL + (isImage ? "/api/upload-image/" : "/api/upload-doc/");

            const formData = new FormData();
            formData.append(fieldName, fileSelected, fileSelected.name);

            var settings = {
                "url": url,
                "method": "POST",
                "timeout": 0,
                "headers": { "Authorization": "Bearer " + token },
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": formData
            };

            $.ajax(settings).done(function (response) {
                var responseData = JSON.parse(response);
                var form = new FormData();
                const prompt = (responseData.text_content ? `${responseData.text_content}\n\n\n${searchQueryData}` : searchQueryData)
                console.log(prompt)
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
                $('#search-results-container').append('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Image upload failed. Please try again.</p>');
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
    });
}