window.renderSearchExportOptions = function (searchResultId, uniqueId) {
    setTimeout(() => {
        attachEventHandlers(uniqueId, searchResultId)
    }, 0);

    return `
    <div
        class="absolute bottom-0 left-0 flex space-x-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200 text-sm">

        <div class="" x-data="{ dropdownOpen: false, modalOpen: false, profileModal: false, changePasswordModal: false }"
            @close-profile-modal.window="profileModal = false"
            @close-change-password-modal.window="changePasswordModal = false">

            <button @click="dropdownOpen = !dropdownOpen" class="relative flex items-center space-x-2 focus:outline-none">
                <!-- Export Icon -->
                <div class="relative group/export">
                    <div id="chat-export-icon-1755018910435"
                        class="flex items-center justify-center p-2 bg-white h-8 gap-1 rounded-md text-gray-600  hover:text-teal-600 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round"
                            stroke-linejoin="round" class="tabler-icon tabler-icon-file-export ">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                            <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3">
                            </path>
                        </svg>
                        <strong class="font-medium">Export</strong>
                    </div>
                </div>
            </button>

            <!-- Dropdown Menu -->
            <div x-data="{ loadingManagePlan: false }" x-show="dropdownOpen" @click.away="dropdownOpen = false"
                @set-loading.window="loadingManagePlan = true" @unset-loading.window="loadingManagePlan = false"
                id="dropdown-menu"
                class="absolute bottom-10 left-0 w-45 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                style="display: none;">
                <!-- EXPORT PDF -->
                <a href="javascript:void(0)" @click="dropdownOpen = false" onclick="handleChatExportAsPDF('${searchResultId}')"
                    class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                    <i class="fas fa-file-pdf text-red-500"></i>
                    <span>PDF</span>
                </a>

                <!-- EXPORT MARKDOWN -->
                <a href="javascript:void(0)" @click="dropdownOpen = false"
                    onclick="handleChatExportAsMarkdown('${uniqueId}')"
                    class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                    <i class="fas fa-file-code text-orange-500"></i>
                    <span>Markdown</span>
                </a>

                <!-- EXPORT DOCX -->
                <a href="javascript:void(0)" @click="dropdownOpen = false" onclick="handleChatExportAsDocx('${uniqueId}')"
                    class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                    <i class="fas fa-file-word text-blue-500"></i>
                    <span>DOCX</span>
                </a>
            </div>
        </div>

        <!-- Share Icon -->
        <div class="relative group/edit">
            <div onclick="handleShareChat('${searchResultId}', '${uniqueId}')"
                class="flex items-center justify-center p-2 bg-white h-8 gap-1 rounded-md text-gray-600  hover:text-teal-600 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round"
                    class="tabler-icon tabler-icon-share-3 ">
                    <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z">
                    </path>
                </svg>
                <strong class="font-medium">Share</strong>
            </div>
            <div id="share-chat-tooltip-${uniqueId}"
                class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-200 pointer-events-none z-[999]">
                Link copied. Paste to share
            </div>
        </div>

        <!-- Share Icon -->
        <div class="relative group/edit">
            <div id="rewrite-btn-${uniqueId}"
                class="flex items-center justify-center p-2 bg-white h-8 gap-1 rounded-md text-gray-600  hover:text-teal-600 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round"
                    class="tabler-icon tabler-icon-repeat ">
                    <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
                    <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
                </svg>
                <strong class="font-medium">Rewrite</strong>
            </div>
            <div id="share-chat-tooltip-${uniqueId}"
                class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-200 pointer-events-none z-[999]">
                Link copied. Paste to share
            </div>
        </div>

    </div>
    `
}



function attachEventHandlers(uniqueId, searchResultId) {
    // HANDLE REWRITE
    $(document).on("click", `#rewrite-btn-${uniqueId}`, function () {
        {
            $("#rewrite-btn-" + uniqueId).addClass("pointer-events-none")
            $("#response-text-inner-" + uniqueId).html("Rewriting...");
            const searchQuery = $("#query-text-" + uniqueId).html()
                .replace(/<([a-z]+)[^>]*>(?:\s|&nbsp;|\u200B)*<\/\1 >/gi, '')
                .replace(/<br\s*\/ ?>/gi, '\n')
                .replace(/<\/p >/gi, '\n\n')
                .replace(/<\/li >/gi, '\n')
                .replace(/<\/ul >/gi, '\n')
                .replace(/<\/ol >/gi, '\n')
                .replace(/<hr\b[^>]*\/ ?>/gi, '\n')
                .trim();


            call_search_api({searchQuery, searchResultId})
                .then(response => {
                    const searchContent = response.choices[0].message.content
                    const citationsMetadata = response.citations_metadata;
                    const content = structuredData(searchContent, citationsMetadata);

                    $("#response-text-inner-" + uniqueId).html(content);
                })
                .catch(error => {
                    showToast({ response: error })
                })
                .always(() => {
                    $("#rewrite-btn-" + uniqueId).removeClass("pointer-events-none")
                });
        }
    });
}