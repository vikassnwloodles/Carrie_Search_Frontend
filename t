[1mdiff --git a/assets/js/html_content/home_content.js b/assets/js/html_content/home_content.js[m
[1mindex 01f31cb..1197d5c 100644[m
[1m--- a/assets/js/html_content/home_content.js[m
[1m+++ b/assets/js/html_content/home_content.js[m
[36m@@ -7,51 +7,9 @@[m [mwindow.home_content = `[m
             class="w-full border border-gray-200 rounded-xl py-5 pl-16 pr-32 md:pl-20 md:pr-40 text-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />[m
         <div class="absolute left-4 flex items-center space-x-1 sm:space-x-2">[m
 [m
[31m-            <div class="relative group">[m
[31m-                <!-- Group is now on the button -->[m
[31m-                <button type="button" id="pro-mode-button" class="text-blue-500 hover:text-cyan-500 p-1 sm:p-2">[m
[31m-                    <svg xmlns="http://www.w3.org/2000/svg"[m
[31m-                        class="icon icon-tabler icon-tabler-search w-5 h-5 sm:w-6 sm:h-6" width="24" height="24"[m
[31m-                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"[m
[31m-                        stroke-linecap="round" stroke-linejoin="round">[m
[31m-                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>[m
[31m-                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>[m
[31m-                        <path d="M21 21l-6 -6"></path>[m
[31m-                    </svg>[m
[31m-                </button>[m
[32m+[m[41m  [m
 [m
[31m-                <!-- Tooltip triggers on button hover -->[m
[31m-                <div[m
[31m-                    class="absolute bottom-10 z-10 left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-black text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">[m
[31m-                    <div class="font-semibold mb-1">Search</div>[m
[31m-                    <div class="mb-2">Fast answers to everyday questions</div>[m
[31m-                    <div class="mb-1">3x more sources with powerful models and increased limits[m
[31m-                    </div>[m
[31m-                </div>[m
[31m-            </div>[m
 [m
[31m-            <div class="relative group">[m
[31m-                <button type="button" id="deep-research-button"[m
[31m-                    class="text-gray-500 hover:text-cyan-500 p-1 sm:p-2">[m
[31m-                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"[m
[31m-                        color="currentColor"[m
[31m-                        class="transition-colors duration-300 text-text-100/70 group-hover/segmented-control:text-text-100"[m
[31m-                        fill="currentColor" fill-rule="evenodd">[m
[31m-                        <path[m
[31m-                            d="M8.175 13.976a.876.876 0 0 1 1.172-.04l.065.061.582.59c.196.194.395.388.596.576l.39.358c1.942 1.753 3.844 2.937 5.357 3.477.81.29 1.444.369 1.884.31.404-.055.61-.216.731-.446.135-.256.209-.678.116-1.31-.08-.546-.275-1.191-.59-1.91l-.141-.313-.034-.083a.875.875 0 0 1 1.575-.741l.042.079.161.353c.36.823.61 1.623.719 2.362.122.836.071 1.675-.3 2.38-.431.818-1.186 1.247-2.044 1.363-.823.111-1.756-.056-2.707-.396-1.912-.681-4.17-2.154-6.357-4.207a30.378 30.378 0 0 1-.63-.61l-.608-.615-.058-.068a.875.875 0 0 1 .079-1.17Zm.624-5.822a.876.876 0 0 1 1.216 1.258c-.396.383-.788.775-1.165 1.178-1.95 2.077-3.26 4.133-3.835 5.747-.29.81-.37 1.444-.31 1.884.055.404.215.61.444.731l.104.048c.261.103.654.149 1.207.068.623-.09 1.378-.333 2.224-.731a.875.875 0 0 1 .745 1.583c-.948.446-1.871.756-2.716.88-.784.114-1.57.078-2.246-.234l-.134-.066c-.817-.431-1.246-1.186-1.362-2.044-.112-.823.056-1.756.395-2.707.64-1.792 1.973-3.889 3.83-5.945l.377-.411c.402-.43.816-.843 1.226-1.239Zm8.5-4.954c.832-.122 1.67-.073 2.372.302h-.001c.814.432 1.243 1.185 1.36 2.042.11.823-.057 1.756-.396 2.707-.682 1.911-2.154 4.17-4.207 6.356h-.001c-.403.429-.818.846-1.236 1.236l-.068.057a.875.875 0 0 1-1.127-1.336l.582-.562c.193-.193.385-.39.573-.592l.359-.39c1.752-1.942 2.937-3.844 3.476-5.357.29-.811.37-1.444.31-1.884-.055-.404-.216-.61-.446-.731l-.003-.002c-.248-.132-.663-.207-1.293-.114-.62.09-1.37.332-2.208.73l-.083.034a.876.876 0 0 1-.667-1.615l.351-.161c.819-.36 1.616-.612 2.353-.72Zm-5.292 7.507a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM5.544 2.971c.823-.112 1.756.056 2.707.395 1.911.682 4.17 2.154 6.356 4.207.214.201.426.406.632.612l.604.625.057.068a.875.875 0 0 1-1.271 1.19l-.065-.063-.562-.582c-.193-.193-.39-.385-.592-.573-2.077-1.95-4.133-3.26-5.747-3.835-.811-.29-1.444-.37-1.884-.31-.404.055-.61.215-.731.444l-.002.004c-.132.248-.207.664-.114 1.294.08.543.275 1.184.588 1.898l.142.31.034.083a.875.875 0 0 1-1.572.746l-.043-.079-.161-.352c-.36-.819-.612-1.615-.72-2.352-.122-.832-.073-1.67.302-2.372.431-.814 1.185-1.242 2.042-1.358Z">[m
[31m-                        </path>[m
[31m-                    </svg>[m
[31m-                </button>[m
[31m-                <!-- Tooltip triggers on button hover -->[m
[31m-                <div[m
[31m-                    class="absolute bottom-10 z-10 left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-black text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">[m
[31m-                    <div class="font-semibold mb-1">Research</div>[m
[31m-                    <div class="mb-2">Deep research on any topic</div>[m
[31m-                    <div class="mb-1">In-depth reports with more sources, charts, and advanced[m
[31m-                        reasoning[m
[31m-                    </div>[m
[31m-                </div>[m
[31m-            </div>[m
 [m
         </div>[m
 [m
[36m@@ -73,113 +31,21 @@[m [mwindow.home_content = `[m
         </div>[m
 [m
 [m
[31m-        <div class="absolute right-4 flex items-center space-x-1 sm:space-x-2">[m
[31m-            <!-- <div class="relative" id="model-select-container">[m
[31m-                <button type="button" id="model-select-button" class="text-gray-500 hover:text-black p-1 sm:p-2">[m
[31m-                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"[m
[31m-                        stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round"[m
[31m-                        stroke-linejoin="round" class="tabler-icon tabler-icon-cpu ">[m
[31m-                        <path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z">[m
[31m-                        </path>[m
[31m-                        <path d="M9 9h6v6h-6z"></path>[m
[31m-                        <path d="M3 10h2"></path>[m
[31m-                        <path d="M3 14h2"></path>[m
[31m-                        <path d="M10 3v2"></path>[m
[31m-                        <path d="M14 3v2"></path>[m
[31m-                        <path d="M21 10h-2"></path>[m
[31m-                        <path d="M21 14h-2"></path>[m
[31m-                        <path d="M14 21v-2"></path>[m
[31m-                        <path d="M10 21v-2"></path>[m
[31m-                    </svg>[m
[31m-                </button>[m
[32m+[m[32m<div class="absolute right-4 flex items-center space-x-1 sm:space-x-2">[m
[32m+[m[32m    <button type="button" id="file-upload-button" class="text-gray-500 hover:text-black p-1 sm:p-2">[m
[32m+[m[32m        <i class="fas fa-paperclip text-base sm:text-xl"></i>[m
[32m+[m[32m    </button>[m
[32m+[m[32m    <input id="file-upload" type="file" class="hidden" />[m
 [m
[31m-                <div id="model-dropdown"[m
[31m-                    class="absolute right-0 mt-2 w-72 ring-1 ring-black/5 bg-white rounded-lg shadow-lg z-30 hidden">[m
[31m-                    <div class="p-3">[m
[31m-                        <div class="bg-gray-100 rounded-md p-2 mb-2">[m
[31m-                            <p class="font-semibold text-gray-800 inline-block bg-teal-100 px-2 py-1 rounded-md">[m
[31m-                                Search</p>[m
[31m-                        </div>[m
