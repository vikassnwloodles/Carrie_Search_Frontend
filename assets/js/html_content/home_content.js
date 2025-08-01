window.home_content = `
<div id="search-results-container" class="w-full max-w-4xl hidden"></div>

<form id="search-form" class="w-full max-w-3xl pb-12">
    <div class="relative flex items-center">
        <div id="searchbox_parent_div"
        class="w-full border border-gray-200 rounded-xl p-2 pb-12 bg-white shadow-sm transition-shadow focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500"
        onclick="document.getElementById('ai_search').focus()"
        >
            <textarea id="ai_search" type="text" placeholder="Search, Ask, or Write Anything!"
                onkeydown="handleKeyDownOnSearchBox(event)"
                oninput="autoGrowSearchBox(this)"
                class="max-h-[40vh] resize-none w-full rounded-xl pt-2 pl-16 pr-32 md:pl-20 md:pr-40 text-lg bg-white focus:outline-none transition-shadow"></textarea>
        </div>
        <div class="absolute left-4 flex items-center space-x-1 sm:space-x-2">


        </div>


        <!-- File Metadata Box -->
        <div id="file-metadata-box"
            class="top-3 left-3 absolute p-2 ml-3  bg-white border border-gray-300 rounded-xl shadow-sm hidden">
            <div style="float: left;">
                <div class="bg-teal-600 rounded-md w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-file-pdf text-white text-2xl"></i>
                </div>
            </div>
            <div style="float: left; margin-left: 10px; margin-right: 10px;">
                <div class="text-xs text-gray-500 font-bold" id="uploaded_filename">test.pdf
                </div>
                <div class="text-xs text-gray-500" id="uploaded_filesize">52.5 KB</div>
            </div>
            <button type="button" id="close_uploaded_file_metadata_box" style="float: left;">
                <i class="fas fa-times text-gray-600 text-base"></i>
            </button>
        </div>


<div class="absolute right-4 flex items-center space-x-1 sm:space-x-2">
    <button type="button" id="file-upload-button" class="text-gray-500 hover:text-black p-1 sm:p-2">
        <i class="fas fa-paperclip text-base sm:text-xl"></i>
    </button>
    <input id="file-upload" type="file" class="hidden" />

    <button type="button" id="mic-button" class="text-gray-500 hover:text-black p-1 sm:p-2">
        <i class="fa-solid fa-microphone-lines text-base sm:text-xl" id="mic-icon"></i>
    </button>
    <button type="submit"
        class="bg-teal-600 text-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-teal-700 transition-colors">
        <i class="fas fa-arrow-right text-base sm:text-xl"></i>
    </button>
</div>

    </div>
</form>
`