import "../utils.js"


function renderLibraryContent(data) {
    let libraryHtml = `<div class="max-w-4xl mx-auto text-left py-10 animate-fade-in">
            <h1 class="text-4xl font-bold mb-8">Your Search History</h1>`;

    if (data && data.length > 0) {
        libraryHtml += `<div class="space-y-4">`;

        // Sort by newest first
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        data.forEach(item => {
            const uniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness
            const searchDate = new Date(item.created_at).toLocaleString();

            // Get and sanitize structured content
            const parsedContent = structuredData(item.response.choices[0].message.content || 'No detailed content available.');

            // Wrap all <table> elements with a scrollable container
            const safeContent = parsedContent.replace(/<table([\s\S]*?)<\/table>/g, match => {
                return `<div class="overflow-x-auto w-full my-4 rounded-md border border-gray-200">${match}</div>`;
            });

            libraryHtml += `
                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div class="pl-4 pt-4 pb-8 pr-2 mb-4 relative border rounded-lg">
                    <div id="history-query-container-${uniqueId}" class="relative overflow-hidden">
                        <h3 class="font-semibold text-lg text-teal-700">${item.prompt}</h3>

                        </div>
                                                <!-- Toggle button -->
                        <button id="toggle-btn"
                            class="absolute bottom-0 toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 hover:underline focus:outline-none">
                            <!-- class="toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 mt-3 hover:underline focus:outline-none"> -->
                            <span class="toggle-text-${uniqueId}" id="toggle-text">Show more</span>
                            <svg id="toggle-icon" xmlns="http://www.w3.org/2000/svg" class="toggle-icon-${uniqueId} w-5 h-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path class="toggle-path-${uniqueId}" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                                            <script>
                    (function () {
                        const textContainer = $('#history-query-container-${uniqueId}');
                        const toggleBtn = $('.toggle-btn-${uniqueId}');
                        let expanded = false;

                        // Temporarily expand to check actual height
                        textContainer.css("max-height", "none");
                        const actualHeight = textContainer[0].scrollHeight;
                        textContainer.css("max-height", "120px");

                        if (actualHeight <= 120) {
                        toggleBtn.hide(); // Hide toggle if content doesn't overflow
                        } else {
                        toggleBtn.show(); // Ensure toggle is visible if needed
                        }

                        toggleBtn.add($('#query-edit-icon-${uniqueId}')).add($('#cancel-edit-${uniqueId}')).on('click', function (e) {
                        // expanded = !expanded;
                        // If the edit icon was clicked, force expanded to true
                        // if ($(e.currentTarget).is('#query-edit-icon-${uniqueId}')) {
                        // expanded = true;
                        // } else {
                        // expanded = !expanded;
                        // }

                        if (expanded === false){
                            if (!$(e.currentTarget).is('#cancel-edit-${uniqueId}')) {
                                expanded = true
                                if($(e.currentTarget).is('#query-edit-icon-${uniqueId}')){
                                    // $('#history-query-container-${uniqueId}')[0].scrollIntoView(false);
                                    
                                    let offset = $('#dynamic-content-container').outerHeight(true)-$('#search-form').outerHeight(true)-80
                                    // alert(offset)
                                    $('#dynamic-content-container')[0].scrollTop += (actualHeight-offset);
                                }
                            }
                        }
                        else{
                            if (!$(e.currentTarget).is('#query-edit-icon-${uniqueId}')) {
                                expanded = false
                                // $('#individual-search-result-${uniqueId}')[0].scrollIntoView(true);
                            }
                        }

                        // textContainer.css("max-height", expanded ? "1000px" : "120px");
                        textContainer.css("max-height", expanded ? "none" : "120px");
                        const iconPath = expanded
                            ? "M19 15l-7-7-7 7"
                            : "M19 9l-7 7-7-7";
                        $('.toggle-path-${uniqueId}').attr("d", iconPath);
                        $('.toggle-text-${uniqueId}').text(expanded ? "Show less" : "Show more");
                        });
                    })();
                    </script>
                    </div>
                    <p class="text-sm text-gray-500 mb-2">Searched on: ${searchDate}</p>
                    <div class="prose max-w-none text-sm">${safeContent}</div>
                </div>`;
        });

        libraryHtml += `</div>`;
    } else {
        libraryHtml += `<p class="text-lg text-gray-700">No search history found.</p>`;
    }

    libraryHtml += `</div>`;
    loadPageContent({ html_content: libraryHtml });
}


window.handleRenderLibrary = function () {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        loadPageContent({ html_content: '<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Please log in to view your Library.</h2></div>' });
        return;
    }

    loadPageContent({ html_content: '<div class="max-w-4xl mx-auto text-center py-10" id="library-loading"><h2 class="text-2xl font-bold mb-4">Loading Library...</h2></div>' });

    var form = new FormData();
    var settings = {
        "url": window.env.BASE_URL + "/api/library/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        $('#library-loading').remove();
        renderLibraryContent(JSON.parse(response));
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#library-loading').remove();
        let errorMessage = '<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Failed to load Library. Please try again later.</h2>';
        if (jqXHR.status === 401) {
            errorMessage += '<p class="text-gray-600">Your session might have expired. Please log in again.</p>';
        }
        errorMessage += '</div>';
        loadPageContent({ html_content: errorMessage });
    });
}
