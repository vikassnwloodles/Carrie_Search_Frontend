window.home_content = `
<div id="search-results-container" class="w-full max-w-4xl hidden"></div>

    <form id="search-form" class="w-full max-w-3xl pb-12">
        <div class="relative flex items-center">
            <input id="ai_search" type="text" placeholder="Search, Ask, or Write Anything!"
                class="w-full border border-gray-200 rounded-xl py-5 pl-16 pr-32 md:pl-20 md:pr-40 text-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
            <div class="absolute left-4 flex items-center space-x-1 sm:space-x-2">

                <div class="relative group">
                    <!-- Group is now on the button -->
                    <button type="button" id="pro-mode-button" class="text-blue-500 hover:text-cyan-500 p-1 sm:p-2">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-search w-5 h-5 sm:w-6 sm:h-6" width="24" height="24"
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                            <path d="M21 21l-6 -6"></path>
                        </svg>
                    </button>

                    <!-- Tooltip triggers on button hover -->
                    <div
                        class="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-black text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                        <div class="font-semibold mb-1">Search</div>
                        <div class="mb-2">Fast answers to everyday questions</div>
                        <div class="mb-1">3x more sources with powerful models and increased limits
                        </div>
                    </div>
                </div>

                <div class="relative group">
                    <button type="button" id="deep-research-button"
                        class="text-gray-500 hover:text-cyan-500 p-1 sm:p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            color="currentColor"
                            class="transition-colors duration-300 text-text-100/70 group-hover/segmented-control:text-text-100"
                            fill="currentColor" fill-rule="evenodd">
                            <path
                                d="M8.175 13.976a.876.876 0 0 1 1.172-.04l.065.061.582.59c.196.194.395.388.596.576l.39.358c1.942 1.753 3.844 2.937 5.357 3.477.81.29 1.444.369 1.884.31.404-.055.61-.216.731-.446.135-.256.209-.678.116-1.31-.08-.546-.275-1.191-.59-1.91l-.141-.313-.034-.083a.875.875 0 0 1 1.575-.741l.042.079.161.353c.36.823.61 1.623.719 2.362.122.836.071 1.675-.3 2.38-.431.818-1.186 1.247-2.044 1.363-.823.111-1.756-.056-2.707-.396-1.912-.681-4.17-2.154-6.357-4.207a30.378 30.378 0 0 1-.63-.61l-.608-.615-.058-.068a.875.875 0 0 1 .079-1.17Zm.624-5.822a.876.876 0 0 1 1.216 1.258c-.396.383-.788.775-1.165 1.178-1.95 2.077-3.26 4.133-3.835 5.747-.29.81-.37 1.444-.31 1.884.055.404.215.61.444.731l.104.048c.261.103.654.149 1.207.068.623-.09 1.378-.333 2.224-.731a.875.875 0 0 1 .745 1.583c-.948.446-1.871.756-2.716.88-.784.114-1.57.078-2.246-.234l-.134-.066c-.817-.431-1.246-1.186-1.362-2.044-.112-.823.056-1.756.395-2.707.64-1.792 1.973-3.889 3.83-5.945l.377-.411c.402-.43.816-.843 1.226-1.239Zm8.5-4.954c.832-.122 1.67-.073 2.372.302h-.001c.814.432 1.243 1.185 1.36 2.042.11.823-.057 1.756-.396 2.707-.682 1.911-2.154 4.17-4.207 6.356h-.001c-.403.429-.818.846-1.236 1.236l-.068.057a.875.875 0 0 1-1.127-1.336l.582-.562c.193-.193.385-.39.573-.592l.359-.39c1.752-1.942 2.937-3.844 3.476-5.357.29-.811.37-1.444.31-1.884-.055-.404-.216-.61-.446-.731l-.003-.002c-.248-.132-.663-.207-1.293-.114-.62.09-1.37.332-2.208.73l-.083.034a.876.876 0 0 1-.667-1.615l.351-.161c.819-.36 1.616-.612 2.353-.72Zm-5.292 7.507a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM5.544 2.971c.823-.112 1.756.056 2.707.395 1.911.682 4.17 2.154 6.356 4.207.214.201.426.406.632.612l.604.625.057.068a.875.875 0 0 1-1.271 1.19l-.065-.063-.562-.582c-.193-.193-.39-.385-.592-.573-2.077-1.95-4.133-3.26-5.747-3.835-.811-.29-1.444-.37-1.884-.31-.404.055-.61.215-.731.444l-.002.004c-.132.248-.207.664-.114 1.294.08.543.275 1.184.588 1.898l.142.31.034.083a.875.875 0 0 1-1.572.746l-.043-.079-.161-.352c-.36-.819-.612-1.615-.72-2.352-.122-.832-.073-1.67.302-2.372.431-.814 1.185-1.242 2.042-1.358Z">
                            </path>
                        </svg>
                    </button>
                    <!-- Tooltip triggers on button hover -->
                    <div
                        class="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-black text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                        <div class="font-semibold mb-1">Research</div>
                        <div class="mb-2">Deep research on any topic</div>
                        <div class="mb-1">In-depth reports with more sources, charts, and advanced
                            reasoning
                        </div>
                    </div>
                </div>

            </div>


            <!-- File Metadata Box -->
            <div id="file-metadata-box"
                class="top-3 left-3 absolute p-2  bg-white border border-gray-300 rounded-xl shadow-sm hidden">
                <div style="float: left;">
                    <i class="fas fa-file text-teal-600 text-base sm:text-xl"></i>
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
                <div class="relative" id="model-select-container">
                    <button type="button" id="model-select-button" class="text-gray-500 hover:text-black p-1 sm:p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round"
                            stroke-linejoin="round" class="tabler-icon tabler-icon-cpu ">
                            <path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z">
                            </path>
                            <path d="M9 9h6v6h-6z"></path>
                            <path d="M3 10h2"></path>
                            <path d="M3 14h2"></path>
                            <path d="M10 3v2"></path>
                            <path d="M14 3v2"></path>
                            <path d="M21 10h-2"></path>
                            <path d="M21 14h-2"></path>
                            <path d="M14 21v-2"></path>
                            <path d="M10 21v-2"></path>
                        </svg>
                    </button>

                    <div id="model-dropdown"
                        class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-30 hidden">
                        <div class="p-3">
                            <div class="bg-gray-100 rounded-md p-2 mb-2">
                                <p class="font-semibold text-gray-800 inline-block bg-teal-100 px-2 py-1 rounded-md">
                                    Search</p>
                            </div>
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 model-option"
                                data-model-value="sonar">
                                <p class="font-semibold text-blue-500">Sonar</p>
                                <p class="text-sm text-blue-500">Perplexity's fast search model</p>
                            </div>
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 model-option"
                                id="sonar-pro-dropdown" data-model-value="sonar-pro">
                                <p class="font-semibold text-gray-800">Sonar Pro</p>
                                <p class="text-sm text-gray-600">Perplexity's advanced search model</p>
                            </div>
                        </div>
                        <hr class="border-gray-200">
                        <div class="p-3">
                            <div class="bg-gray-100 rounded-md p-2 mb-2">
                                <p class="font-semibold text-gray-800 inline-block bg-teal-100 px-2 py-1 rounded-md">
                                    Reasoning</p>
                            </div>
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 model-option"
                                data-model-value="sonar-reasoning">
                                <p class="font-semibold text-gray-800">Sonar Reasoning</p>
                                <p class="text-sm text-gray-600">Perplexity's base reasoning model</p>
                            </div>
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 model-option"
                                data-model-value="sonar-reasoning-pro">
                                <p class="font-semibold text-gray-800">Sonar Reasoning Pro</p>
                                <p class="text-sm text-gray-600">Perplexity's advanced reasoning model
                                </p>
                            </div>
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 model-option"
                                data-model-value="r1-1776">
                                <p class="font-semibold text-gray-800">R1 1776</p>
                                <p class="text-sm text-gray-600">Perplexity's unbiased reasoning model
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <button type="button" id="source-select-button" class="text-gray-500 hover:text-black p-1 sm:p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round"
                            stroke-linejoin="round" class="tabler-icon tabler-icon-world ">
                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                            <path d="M3.6 9h16.8"></path>
                            <path d="M3.6 15h16.8"></path>
                            <path d="M11.5 3a17 17 0 0 0 0 18"></path>
                            <path d="M12.5 3a17 17 0 0 1 0 18"></path>
                        </svg>
                    </button>
                    <div id="source-dropdown"
                        class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-30 hidden">
                        <div class="p-3 space-y-2">
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 source-option"
                                data-source-value="web">
                                <p class="font-semibold text-gray-800">Web</p>
                                <p class="text-sm text-gray-600">Search across the entire Internet</p>
                            </div>
                            <div class="cursor-pointer hover:bg-gray-100 rounded-md p-2 source-option"
                                data-source-value="academic">
                                <p class="font-semibold text-gray-800">Academic</p>
                                <p class="text-sm text-gray-600">Search academic papers</p>
                            </div>
                        </div>
                    </div>
                </div>

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