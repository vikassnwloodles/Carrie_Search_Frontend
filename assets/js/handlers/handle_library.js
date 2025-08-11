import "../utils.js";

// ===== Modular Functions =====

// Builds one history card
function renderLibraryItem(item) {
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    const searchDate = new Date(item.created_at).toLocaleString();

    // Parse and wrap tables
    const parsedContent = structuredData(item.response.choices[0].message.content || 'No detailed content available.');
    const safeContent = parsedContent.replace(/<table([\s\S]*?)<\/table>/g, match => {
        return `<div class="overflow-x-auto w-full my-4 rounded-md border border-gray-200">${match}</div>`;
    });

    return `
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm library-item" data-unique-id="${uniqueId}">
            <div class="pl-4 pt-4 pb-8 pr-2 mb-4 relative border rounded-lg">
                <div class="relative overflow-hidden history-query-container" data-unique-id="${uniqueId}" style="max-height: 120px;">
                    <h3 class="font-semibold text-lg text-teal-700">${item.prompt}</h3>
                </div>
                <button class="absolute bottom-0 toggle-btn text-teal-600 flex items-center gap-1 hover:underline focus:outline-none" data-unique-id="${uniqueId}">
                    <span class="toggle-text">Show more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path class="toggle-path" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-500 mb-2">Searched on: ${searchDate}</p>
            <div class="prose max-w-none text-sm">${safeContent}</div>
        </div>
    `;
}

// Renders full library content
function renderLibraryContent(data) {
    let html = `<div class="max-w-4xl mx-auto text-left py-10 animate-fade-in">
        <h1 class="text-4xl font-bold mb-8">Your Search History</h1>`;

    if (data && data.length > 0) {
        html += `<div class="space-y-4">`;
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        data.forEach(item => {
            html += renderLibraryItem(item);
        });
        html += `</div>`;
    } else {
        html += `<p class="text-lg text-gray-700">No search history found.</p>`;
    }
    html += `</div>`;

    loadPageContent({ html_content: html });
    attachLibraryEvents(); // Bind events after content load
}

// Handles show more/less toggle
function attachLibraryEvents() {
    $(".toggle-btn").each(function () {
        const uniqueId = $(this).data("unique-id");
        const textContainer = $(`.history-query-container[data-unique-id="${uniqueId}"]`);
        const toggleBtn = $(this);
        let expanded = false;

        // Check overflow
        textContainer.css("max-height", "none");
        const actualHeight = textContainer[0].scrollHeight;
        textContainer.css("max-height", "120px");
        if (actualHeight <= 120) {
            toggleBtn.hide();
        }

        toggleBtn.on("click", function () {
            expanded = !expanded;
            textContainer.css("max-height", expanded ? "none" : "120px");
            toggleBtn.find(".toggle-path").attr("d", expanded ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7");
            toggleBtn.find(".toggle-text").text(expanded ? "Show less" : "Show more");
        });
    });
}

// ===== Entry Point =====
window.handleRenderLibrary = function () {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        loadPageContent({
            html_content: '<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Please log in to view your Library.</h2></div>'
        });
        return;
    }

    loadPageContent({
        html_content: '<div class="max-w-4xl mx-auto text-center py-10" id="library-loading"><h2 class="text-2xl font-bold mb-4">Loading Library...</h2></div>'
    });

    $.ajax({
        url: window.env.BASE_URL + "/api/library/",
        method: "GET",
        timeout: 0,
        headers: { "Authorization": "Bearer " + token }
    }).done(function (response) {
        $('#library-loading').remove();
        renderLibraryContent(response);
    }).fail(function (jqXHR) {
        $('#library-loading').remove();
        let errorMessage = '<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Failed to load Library. Please try again later.</h2>';
        if (jqXHR.status === 401) {
            errorMessage += '<p class="text-gray-600">Your session might have expired. Please log in again.</p>';
        }
        errorMessage += '</div>';
        loadPageContent({ html_content: errorMessage });
    });
};
