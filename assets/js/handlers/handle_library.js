import "../utils.js"


function renderLibraryContent(data) {
    let libraryHtml = `<div class="max-w-4xl mx-auto text-left py-10 animate-fade-in">
            <h1 class="text-4xl font-bold mb-8">Your Search History</h1>`;

    if (data && data.length > 0) {
        libraryHtml += `<div class="space-y-4">`;

        // Sort by newest first
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        data.forEach(item => {
            const searchDate = new Date(item.created_at).toLocaleString();

            // Get and sanitize structured content
            const parsedContent = structuredData(item.response.choices[0].message.content || 'No detailed content available.');

            // Wrap all <table> elements with a scrollable container
            const safeContent = parsedContent.replace(/<table([\s\S]*?)<\/table>/g, match => {
                return `<div class="overflow-x-auto w-full my-4 rounded-md border border-gray-200">${match}</div>`;
            });

            libraryHtml += `
                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 class="font-semibold text-lg text-teal-700">${item.prompt}</h3>
                    <p class="text-sm text-gray-500 mb-2">Searched on: ${searchDate}</p>
                    <div class="prose max-w-none text-sm">${safeContent}</div>
                </div>`;
        });

        libraryHtml += `</div>`;
    } else {
        libraryHtml += `<p class="text-lg text-gray-700">No search history found.</p>`;
    }

    libraryHtml += `</div>`;
    loadPageContent({html_content: libraryHtml});
}


window.handleRenderLibrary = function () {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        loadPageContent({html_content: '<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Please log in to view your Library.</h2></div>'});
        return;
    }

    loadPageContent({html_content: '<div class="max-w-4xl mx-auto text-center py-10" id="library-loading"><h2 class="text-2xl font-bold mb-4">Loading Library...</h2></div>'});

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
        loadPageContent({html_content: errorMessage});
    });
}
