import "./html_content/search_query_container.js"
import "./html_content/search_images_container.js"
import "./html_content/search_response_container.js"
import "./html_content/search_export_options.js"
import "./html_content/citation_html.js"
import "../js/apis/upload_file_api.js"
import "../js/apis/search_api.js"


const urlParams = new URLSearchParams(window.location.search);
window.reset_password_uidb64 = urlParams.get('uidb64');
window.reset_password_token = urlParams.get('token');


// window.loadPageContent = function (content) {
//     const fullContent = `<div class="w-full flex flex-col items-center justify-start pt-8">${pageLogoHtml}${content}</div>`;
//     $('#center-content-wrapper').html(fullContent).removeClass('justify-center flex-1').addClass('justify-start');
//     $('#search-results-container').hide();
//     $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6 hidden');
//     $('#search-form').hide();
//     $('#signup-message').removeClass('bg-green-100 bg-red-100 text-green-700 text-red-700').addClass('hidden').text('');
// }


window.loadPageContent = function ({ html_content, is_homepage = false }) {
    html_content = `${headerLogo}${html_content}`
    if (is_homepage) {
        // $('#center-content-wrapper').html(html_content).addClass('justify-center flex-1').removeClass('justify-start');
        // $('#center-content-wrapper').html(html_content).addClass('flex-1').removeClass('justify-start');

        // $('#center-content-wrapper').html(html_content).addClass('mt-24 flex-1').removeClass('justify-start');

        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        if (isMobile) {
            // For phones
            // console.log("here mobile")
            $('#center-content-wrapper')
                .html(html_content)
                .addClass('flex-1')
                .removeClass('justify-start');
        } else {
            // For laptops
            // console.log("here laptop")
            // $('#center-content-wrapper')
            //     .html(html_content)
            //     .addClass('mt-24 flex-1')
            //     .removeClass('justify-start');
            $('#center-content-wrapper').html(html_content).addClass('justify-center flex-1').removeClass('justify-start');
        }



        $(".main-logo").css({ "margin-bottom": "20px" })
    }
    else {
        const fullContent = `<div class="w-full flex flex-col items-center justify-start pt-8">${html_content}</div>`;
        $('#center-content-wrapper').html(fullContent).removeClass('justify-center flex-1').addClass('justify-start');
    }
}


function parsebold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function parseItalic(text) {
    return text.replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function removeFootnotes(text) {
    return text.replace(/\s*\[\d+\](\[\d+\])*\s*$/, '').trim();
}

function buildTable(rows, citationsMetadata) {
    if (rows.length < 2) {
        return '';
    }

    var tableHtml = '<table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">';
    var headerRow = rows[0];
    var dataRows = rows.slice(2);

    tableHtml += '<thead class="bg-gray-50"><tr>';
    var headerCells = headerRow.substring(1, headerRow.length - 1).split('|');
    $.each(headerCells, function (idx, cellContent) {
        tableHtml += '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">' + parseItalic(parsebold(removeFootnotes(cellContent))) + '</th>';
    });
    tableHtml += '</tr></thead>';

    tableHtml += '<tbody class="bg-white divide-y divide-gray-200">';
    $.each(dataRows, function (idx, rowStr) {
        tableHtml += '<tr>';
        var cells = rowStr.substring(1, rowStr.length - 1).split('|');
        $.each(cells, function (cellIdx, cellContent) {
            // GET MAIN TEXT AND CITATIONS HTML
            const [mainText, citationsHtml] = getMainTextAndCitationsHtml(cellContent, citationsMetadata)
            tableHtml += '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' + parseItalic(parsebold(removeFootnotes(mainText))) + citationsHtml + '</td>';
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody>';

    tableHtml += '</table>';
    return tableHtml;
}


window.structuredData = function (rawText, citationsMetadata) {
    var rawText = rawText.replace(/<think>.*?<\/think>/gs, '');
    // Remove newlines immediately after \[ or before \]
    // rawText = rawText.replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => `\\[${expr.replace(/\n/g,'')}\\]`);
    rawText = rawText.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, expr) => `\\[${expr}\\]`);

    var lines = rawText.split('\n');

    // // REPLACING --- WITH <hr> (<hr> is HTML equivalent to ---)
    // for (var i = 0; i < lines.length; i++) {
    //     if (lines[i].trim() === '---') {
    //         lines[i] = '<hr class="my-6 border-t border-gray-300">';
    //     }
    // }

    var htmlBuilder = [];
    var inList = false;
    var inTable = false;
    var inCodeBlock = false;
    var currentTableLines = [];
    var currentCodeLines = [];
    var codeLang = '';


    function handleHeading(level, text) {
        // Close list if open
        if (inList) {
            htmlBuilder.push('</ul>');
            inList = false;
        }
        // Close table if open
        if (inTable) {
            htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
            currentTableLines = [];
            inTable = false;
        }
        // Map heading levels to Tailwind classes
        const headingClasses = {
            1: 'text-3xl font-bold mt-6 mb-3',
            2: 'text-2xl font-semibold mt-4 mb-2',
            3: 'text-xl font-semibold mt-4 mb-2',
            4: 'text-lg font-semibold mt-3 mb-1.5',
            5: 'text-base font-semibold mt-2 mb-1',
            6: 'text-sm font-semibold mt-1 mb-0.5'
        };
        htmlBuilder.push(
            `<h${level} class="${headingClasses[level] || 'text-base font-semibold'}">${parseItalic(parsebold(text))}</h${level}>`
        );
    }


    $.each(lines, function (i, line) {
        var trimmedLine = line.trim();

        // REPLACING --- WITH <hr> (<hr> is HTML equivalent to ---)
        if (trimmedLine === '---') {
            htmlBuilder.push('<hr class="my-6 border-t border-gray-300">')
            return
        }

        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                htmlBuilder.push('<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-2"><code class="language-' + codeLang + '">' + currentCodeLines.join('\n') + '</code></pre>');
                currentCodeLines = [];
                inCodeBlock = false;
                codeLang = '';
            } else {
                inCodeBlock = true;
                codeLang = trimmedLine.substring(3).trim() || 'plaintext';
            }
            return;
        }

        if (inCodeBlock) {
            currentCodeLines.push(line);
            return;
        }

        if (!trimmedLine) {
            if (inList) {
                htmlBuilder.push('</ul>');
                inList = false;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
                currentTableLines = [];
                inTable = false;
            }
            return;
        }

        // if (trimmedLine.startsWith('### ')) {
        //     if (inList) {
        //         htmlBuilder.push('</ul>');
        //         inList = false;
        //     }
        //     if (inTable) {
        //         htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
        //         currentTableLines = [];
        //         inTable = false;
        //     }
        //     htmlBuilder.push('<h3 class="text-xl font-semibold mt-4 mb-2">' + parseItalic(parsebold(trimmedLine.substring(4).trim())) + '</h3>');
        // } else if (trimmedLine.startsWith('## ')) {
        //     if (inList) {
        //         htmlBuilder.push('</ul>');
        //         inList = false;
        //     }
        //     if (inTable) {
        //         htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
        //         currentTableLines = [];
        //         inTable = false;
        //     }
        //     htmlBuilder.push('<h2 class="text-2xl font-semibold mt-4 mb-2">' + parseItalic(parsebold(trimmedLine.substring(3).trim())) + '</h2>');
        // } 


        // Usage: dynamically detect heading level
        const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;       // number of #
            const text = headingMatch[2].trim();
            handleHeading(level, text);
        }
        else if (trimmedLine.startsWith('- ')) {
            if (!inList) {
                htmlBuilder.push('<ul class="list-disc list-inside ml-4 my-2">');
                inList = true;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
                currentTableLines = [];
                inTable = false;
            }

            // GET MAIN TEXT AND CITATIONS HTML
            const [mainText, citationsHtml] = getMainTextAndCitationsHtml(trimmedLine, citationsMetadata)

            htmlBuilder.push('<li class="text-gray-700">' + parseItalic(parsebold(mainText.substring(2).trim())) + citationsHtml + '</li>');
        }

        else if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            if (inList) {
                htmlBuilder.push('</ul>');
                inList = false;
            }
            currentTableLines.push(trimmedLine);
            inTable = true;
        }

        else {
            if (inList) {
                htmlBuilder.push('</ul>');
                inList = false;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
                currentTableLines = [];
                inTable = false;
            }

            // GET MAIN TEXT AND CITATIONS HTML
            const [mainText, citationsHtml] = getMainTextAndCitationsHtml(trimmedLine, citationsMetadata)

            htmlBuilder.push('<p class="text-gray-700 leading-relaxed my-2">' + parseItalic(parsebold(mainText)) + citationsHtml + '</p>');
        }
    });

    if (inList) {
        htmlBuilder.push('</ul>');
    }
    if (inTable) {
        htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
    }
    if (inCodeBlock && currentCodeLines.length > 0) {
        htmlBuilder.push('<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-2"><code class="language-' + codeLang + '">' + currentCodeLines.join('\n') + '</code></pre>');
    }


    let content = htmlBuilder.join('');

    // wrap tables
    content = content.replace(/<table([\s\S]*?)<\/table>/g, function (match) {
        return `<div class="overflow-x-auto w-full my-4 rounded-md border border-gray-200">${match}</div>`;
    });

    // create a temporary container element
    const container = document.createElement('div');
    container.innerHTML = content;

    // render KaTeX formulas inside the container
    renderMathInElement(container, {
        delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
    });

    // return the processed HTML string
    return container.innerHTML;
}


function getMainTextAndCitationsHtml(trimmedLine, citationsMetadata) {
    // EXTRACT CITATION NUMBERS SUCH AS 1, 2... FROM `trimmedLine`
    let citationNumbers = (trimmedLine.match(/\[(\d+)\]/g) || []).map(c => parseInt(c.replace(/\[|\]/g, ""), 10));
    // REMOVE THE [n] MARKERS FROM THE MAIN TEXT
    const mainText = trimmedLine.replace(/\[\d+\]/g, "").trim();
    let citationsHtml = "";
    if (citationNumbers.length > 0) {
        // FILTER OUT CITATIONS METADATA BASE ON EXTRACTED CITATION NUMBERS
        const citationsMetadataFiltered = citationNumbers.map(number => citationsMetadata[number - 1])
        citationsHtml = getCitationHtml(citationsMetadataFiltered)
    }
    return [mainText, citationsHtml];
}


window.fetchSubscriptionStatus = function () {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            reject({ message: 'No token found', status: 'unauthenticated' });
            return;
        }

        $.ajax({
            url: window.env.BASE_URL + "/api/subscriptions/get-pro-status",
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .done((response) => resolve(response))
            .fail((jqXHR) => {
                const message =
                    jqXHR.status === 401
                        ? 'Session expired. Please log in again.'
                        : 'Failed to fetch subscription status.';
                reject({ message, status: jqXHR.status });
            });
    });
}

const initialCenterContent = $('#center-content-wrapper').html();

function handleSessionExpired(duration) {
    const title = "Session Expired!"
    const message = "Your session has been expired! You are about to log out."
    const type = "warning"
    showBaseToast({ title, message, type, duration })
    localStorage.removeItem('accessToken');
    setTimeout(() => {
        updateAuthUI()
    }, duration);
}


function showBaseToast({ title, message, type, duration = 5000, text_center = true }) {
    let color = type === "success" ? "green" : type === "warning" ? "yellow" : type === "error" ? "red" : type === "info" ? "blue" : "gray";
    let classes1 = `hidden ${text_center != true ? 'text-center' : ''}`
    let classes2 = `bg-${color}-100 text-${color}-700 p-3 rounded-lg`
    $('#app-message-container').removeClass(classes1).addClass(classes2).html(`<p class="font-bold">${title}</p><p>${message}</p>`);
    setTimeout(() => {
        $('#app-message-container').addClass(classes1).removeClass(classes2).html('');
    }, duration);
}

// window.showToast = function ({ response, title = "Something went wrong!", message = "", type = "error", duration = 5000, text_center = true } = {}) {
//     const status = response?.status ?? -1; // fallback to -1 if undefined
//     if (status == 401) handleSessionExpired(duration);
//     else if (status === 0) showBaseToast({ title: "Server Unreachable", message: "Could not connect to the server. Please try again later.", type: "error", duration, text_center });
//     else showBaseToast({ title, message, type, duration, text_center });
// }

window.showToast = function ({ response, toastOptions, duration = 5000 }) {
    const status = response?.status;
    if (toastOptions) {
        const toastData = toastOptions.find(option => option.status_code === status);
        if (toastData) {
            if (toastData.title === undefined) toastData.title = (toastData.type === "success" ? "Success!" : "Something went wrong!")
            showBaseToast(toastData);
            return;
        }
    }
    if (status === 401) handleSessionExpired(duration);
    else if (status === 0) showBaseToast({ title: "Server Unreachable", message: "Could not connect to the server. Please try again later.", type: "error", duration });
};


function resetToInitialHomeState() {
    $('#center-content-wrapper').html(initialCenterContent).addClass('justify-center flex-1').removeClass('justify-start pt-8');
    $('#search-results-container').empty().hide();
    $('#main-logo').removeClass('text-4xl mb-6 hidden').addClass('text-8xl mb-10');
    $('#search-form').show();
    $('#ai_search').val('');
}




// window.updateAuthUI = function () {
//     const token = localStorage.getItem('accessToken');
//     const $authLink = $('#auth-link');
//     const $signupLink = $('#signup-link');
//     const $userProfileSection = $('#user-profile-section');

//     if (token) {
//         $authLink.text('Logout').off('click').on('click', function (e) {
//             e.preventDefault();
//             localStorage.removeItem('accessToken');
//             updateAuthUI();
//             // resetToInitialHomeState();
//         });
//         $signupLink.hide();

//         fetchSubscriptionStatus()
//             .then(data => {
//                 if (data.subscription_status === 'active') {
//                     $userProfileSection.show();
//                 }
//             })
//             .catch(err => {
//                 const message = "We encountered an issue while checking your Pro subscription."
//                 showToast({
//                     res: err,
//                     message
//                 });
//             });

//     } else {

//         $authLink.text('Login').off('click').on('click', function (e) {
//             e.preventDefault();
//             $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
//             document.getElementById("login-form").classList.remove("hidden"); // Show login form
//             document.getElementById("forgot-form").classList.add("hidden");   // Hide forgot form
//             document.getElementById("modalTitle").textContent = "Login";      // Set modal title
//             $('#forgot-form')[0].reset();
//             $('#login-form')[0].reset();
//             $('.login-success').addClass('hidden')
//         });
//         $signupLink.show();
//         $userProfileSection.hide();
//     }
//     renderHome()
// }





// window.updateAuthUI = function () {
//     const token = localStorage.getItem('accessToken');
//     const $authLink = $('#auth-link');
//     const $signupLink = $('#signup-link');
//     const $userProfileSection = $('#user-profile-section');

//     if (token) {

//         $authLink.text('Logout').off('click').on('click', function (e) {
//             e.preventDefault();
//             localStorage.removeItem('accessToken');
//             updateAuthUI();
//             resetToInitialHomeState();
//         });
//         $signupLink.hide();

//         fetchSubscriptionStatus()
//             .then(data => {
//                 if (data.subscription_status === 'active') {
//                     $userProfileSection.show();
//                 }
//             })
//             .catch(err => {
//                 const message = "We encountered an issue while checking your Pro subscription."
//                 showToast({
//                     res: err,
//                     message
//                 });
//             });

//     } else {

//         $authLink.text('Login').off('click').on('click', function (e) {
//             e.preventDefault();
//             $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
//             document.getElementById("login-form").classList.remove("hidden"); // Show login form
//             document.getElementById("forgot-form").classList.add("hidden");   // Hide forgot form
//             document.getElementById("modalTitle").textContent = "Login";      // Set modal title
//             $('#forgot-form')[0].reset();
//             $('#login-form')[0].reset();
//             $('.login-success').addClass('hidden')
//         });
//         $signupLink.show();
//         $userProfileSection.hide();
//     }
// }


// // ✅ Function to close modal with optional alert cleanup
// function closeModal(modalId, alertSelector = null) {
//     $(`#${modalId}`).removeClass('visible opacity-100').addClass('invisible opacity-0');

//     if (alertSelector) {
//         setTimeout(() => {
//             $(alertSelector).addClass('hidden').removeClass('shake');
//         }, 500);
//     }
// }

// // ✅ Shared handler for modals that close on cross icon or outside click
// function setupModalWithOutsideClose(modalId, closeBtnId, alertSelector = null) {
//     $(`#${modalId}`).on('click', function (e) {
//         const modalContent = $(this).find('> div'); // direct child container
//         if (
//             e.target.id === closeBtnId ||
//             (!modalContent.is(e.target) && modalContent.has(e.target).length === 0)
//         ) {
//             closeModal(modalId, alertSelector);
//         }
//     });
// }



// ✅ Shared handler for modals that close on cross icon or outside click
window.setupModalWithOutsideClose = function (modalId, closeBtnId, closeModal) {
    $(`#${modalId}`).on('click', function (e) {
        const modalContent = $(this).find('> div'); // direct child container
        if (
            e.target.id === closeBtnId ||
            (!modalContent.is(e.target) && modalContent.has(e.target).length === 0)
        ) {
            closeModal();
        }
    });
}


const $loginLink = $('#login-link');
const $logoutLink = $('#logout-link');
const $signupLink = $('#signup-link');
const $userProfileSection = $('#user-profile-section');


function updateHeaderForAuthUser() {
    $("#login-link").addClass("hidden")
    $("#signup-link").addClass("hidden")
    $("#logout-link").removeClass("hidden")
}


function updateSidebarForAuthUser() {
    $userProfileSection.removeClass("hidden");
    fetchSubscriptionStatus()
        .then(data => {
            if (data.subscription_status === 'active') {
                $("#user_profile_icon").addClass("ring-teal-500")
                $("#user_profile_icon span").removeClass("hidden")
                // SHOW MANAGE PLAN OPTION
                $("#manage-plan").removeClass("hidden")
            }
            else {
                $("#user_profile_icon").removeClass("ring-teal-500")
                $("#user_profile_icon span").addClass("hidden")
                // HIDE MANAGE PLAN OPTION
                $("#manage-plan").addClass("hidden")
            }
        })
        .catch(err => {
            const toastOptions = [{
                status_code: 500,
                message: "We encountered an issue while checking your Pro subscription.",
                type: "error"
            }];
            showToast({
                response: err,
                toastOptions
            });
        });
}

window.updateUIForAuthUser = function () {
    updateHeaderForAuthUser()
    updateSidebarForAuthUser()
}


window.updateUIForUnauthUser = function () {
    // $authLink.text('Login').off('click').on('click', function (e) {
    //     e.preventDefault();
    //     $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
    //     document.getElementById("login-form").classList.remove("hidden"); // Show login form
    //     document.getElementById("forgot-form").classList.add("hidden");   // Hide forgot form
    //     document.getElementById("modalTitle").textContent = "Login";      // Set modal title
    //     $('#forgot-form')[0].reset();
    //     $('#login-form')[0].reset();
    //     $('.login-success').addClass('hidden')
    // });
    $signupLink.removeClass("hidden");
    $logoutLink.addClass("hidden");
    $loginLink.removeClass("hidden");
    $userProfileSection.addClass("hidden");
    $("#user_profile_icon").removeClass("ring-teal-500")
    $("#user_profile_icon span").addClass("hidden")
}

// const non_home_routes = [
//     $("#about-us-link"),
//     $(".how-carrie-works-link"),
//     $("#library-link"),
//     $("#pricing-link"),
//     $("#logout-link"),
// ]

const routes = [
    $("#about-us-link"),
    $(".how-carrie-works-link"),
    $("#library-link"),
    $("#pricing-link"),
    $("#logout-link"),
]

window.updateAuthUI = function () {
    const token = localStorage.getItem('accessToken');
    if (token) updateUIForAuthUser()
    else updateUIForUnauthUser()
    renderHome()
    $('.password.alert').data("original-html", $('.password.alert').html())

    // Show the footer again when navigating from the Home route to any non-Home route.
    // This is necessary because the footer was hidden on the Home route to make space 
    // for displaying search results.
    routes.forEach(non_home_route => {
        non_home_route.on("click", function () {
            $("#footer").removeClass("hidden");
            $("#dummy-footer").addClass("hidden");
        });
    });
}


window.getHtmlStringHeight = function (htmlString) {
    const $temp = $(htmlString)
        .css({
            visibility: "hidden",
            position: "absolute",
            display: "block",
        })
        .appendTo("body");

    const height = $temp.outerHeight();

    $temp.remove(); // clean up

    return height;
}


window.cleanSearchResultPage = function () {
    $("#ai_search").text("").blur();  // REMOVE OLD TEXT AND APPLY BLUR TO HIDE CHROME SUGGESTIONS
    $("#ai_search").focus();  // KEEP FOCUS ON SEARCH BOX
    $(".main-logo").addClass("hidden");  // HIDE PETE LOGO FROM TOP
    $("#footer").addClass("hidden");  // HIDE FOOTER
    $("#dummy-footer").removeClass("hidden");  // SHOW DUMMY FOOTER FOR BOTTOM OFFSET PREVENTING CONTENT OVERLAP WITH SEARCH BOX
    $("#search-form").css({ "position": "fixed", "bottom": "-20px" });  // MAKE SEARCH BOX FIX TO THE BOTTOM
    $("#search-form").removeClass("w-full").addClass("mx-auto left-24 right-8");  // MAKE BOTTOM FIXED SEARCH BOX WIDTH DYNAMIC ON WINDOW RESIZE
    $("#ai_search").attr("data-placeholder", "Inquire Further, Ask Another Question");  // UPDATE SEARCH BOX PLACEHOLDER
    hideUploadedFileMetadataBox();  // HIDE PREVIOUSLY SELECTED FILE METADATA BOX
    autoGrowSearchBox(document.getElementById("ai_search"));  // RESET SEARCH BOX HEIGHT
}


window.getSearchResultHtml = function (data) {
    const response = data.response;
    const citationsMetadata = data.response.citations_metadata;
    const searchQuery = data.prompt;
    const links = []
    const images = []

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

    const searchContent = response.choices[0].message.content
    const content = structuredData(searchContent, citationsMetadata);

    // const searchResultId = response.id
    const searchResultId = response.pk
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness
    const relatedQuestions = response.related_questions

    const resultsHtml = `
            <div id="${searchResultId}">
                <div
                    class="animate-fade-in text-left mb-8 p-6 bg-white rounded-lg border border-gray-200 relative">
                    ${renderSearchQueryContainer(searchQuery, uniqueId, searchResultId)}
                    ${renderSearchImagesContainer(images)}
                    ${renderSearchResponseContainer(content, uniqueId)}
                    ${renderSearchExportOptions(searchResultId, uniqueId)}
                </div>
                ${renderRelatedQuestionsContainer(relatedQuestions, uniqueId)}
            </div>
            `

    return resultsHtml
}


let ongoingSearchRequest = null;
let loadingHtmlContainerId = null;
window.renderSearchResult = async function (searchQuery, searchResultId = null) {
    if ($('#search-form-btn i').hasClass('fa-stop')) {
        if (ongoingSearchRequest) {
            ongoingSearchRequest.abort();
            ongoingSearchRequest = null;

            $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');

            $(`#${loadingHtmlContainerId}`)
                .text("Search aborted.").
                removeClass("text-gray-500")
                .addClass("text-red-500");
        }
        return;
    }

    const fileSelected = $('#file-upload')[0].files[0];
    const token = localStorage.getItem('accessToken');
    // const searchQueryData = $('#ai_search').html().replace(/<br\s*\/?>/gi, '\n');
    // if (searchQueryData === "") return;
    if (searchQuery === "") return;

    cleanSearchResultPage()
    $('#search-form-btn i').removeClass('fa-arrow-right').addClass('fa-stop');  // UPDATE SEARCH BOX SUBMIT ICON
    $('#center-content-wrapper').removeClass('justify-center');

    if (!token) {
        const $searchToastBox = $(searchToastBox.trim());
        $searchToastBox.text("Please log in to perform a search.");
        $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
        $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');
        return;
    }

    let imageUrl = "";
    if (fileSelected) {
        try {
            const response = await call_upload_file_api(fileSelected)
            const responseData = JSON.parse(response);
            searchQuery = (responseData.text_content ? `${responseData.text_content}\n\n\n${searchQuery}` : searchQuery);
            imageUrl = responseData.image_url
            $('#file-upload').val('');
        } catch (error) {
            const $searchToastBox = $(searchToastBox.trim());
            $searchToastBox.text("Image upload failed. Please try again.");
            $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
        };
    }

    const $searchToastBox = $(searchToastBox.trim());
    $searchToastBox.attr("id", "loading-message").text("Please standby, Pete is working to make your life and work easier...!")
    $searchToastBox.addClass("animate-fade-in text-gray-500").removeClass("text-red-500 mb-8")
    const dynamicHeight = $('#dynamic-content-container').height();
    const searchToastBoxHeight = getHtmlStringHeight(searchToastBox.trim());
    $searchToastBox.css('margin-bottom', dynamicHeight - searchToastBoxHeight - 150 + 'px');
    loadingHtmlContainerId = "loading-message-" + Date.now(); // or any unique logic
    $searchToastBox.attr("id", loadingHtmlContainerId);
    const loadingHtml = $searchToastBox.prop("outerHTML");

    if (searchResultId) {
        const $loadingElement = $(loadingHtml); // Convert string to jQuery element
        $loadingElement.css('margin-bottom', '32px'); // Apply CSS
        $(`#${searchResultId}`).replaceWith($loadingElement); // Replace

        // KEEP LOADING ELEMENT ON THE TOP AFTER REPLACEMENT
        $(`#${loadingHtmlContainerId}`)[0].scrollIntoView({
            behavior: "smooth",  // Smooth animation
            block: "start"       // Align to top
        });
    }
    else {
        $('#search-results-container').append(loadingHtml).show();
        // SMOOTH SCROLL TO THE BOTTOM SENDING PREVIOUS SEARCH RESULTS OUT OF VIEWPORT MAKING ROOM FOR NEW SEARCH RESULT
        $('#dynamic-content-container').animate({
            scrollTop: $('#dynamic-content-container')[0].scrollHeight
        }, 500);
    }


    ongoingSearchRequest = call_search_api({ searchQuery, imageUrl, searchResultId })
    ongoingSearchRequest.then(response => {
        const data = {
            "response": response,
            "prompt": searchQuery
        }
        const resultsHtml = getSearchResultHtml(data)
        const $resultsHtml = $(resultsHtml);
        $(`#${loadingHtmlContainerId}`).replaceWith($resultsHtml);

        // KEEP `resultsHtml` IN VIEWPORT AFTER REPLACEMENT
        $resultsHtml[0].scrollIntoView(true);  // instant scroll - no animation/smoothness

        // // Render KaTeX formulas inside the new content
        // renderMathInElement($resultsHtml[0], {
        //     delimiters: [
        //         { left: "\\[", right: "\\]", display: true },
        //         { left: "\\(", right: "\\)", display: false }
        //     ],
        //     throwOnError: false
        // });
    })
        .catch(error => {
            // HANDLE INVALID PERPLEXITY KEY ERROR
            if (error.status === 502) {
                $(`#${loadingHtmlContainerId}`)
                    .text("We’re unable to retrieve data right now. Please try again shortly.").
                    removeClass("text-gray-500")
                    .addClass("text-red-500");
                return
            }

            if (error.statusText === 'abort') {
                return; // ignore aborted error
            }

            showToast({ response: error })
        })
        .always(() => {
            $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');
        });
}
