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
        $('#center-content-wrapper').html(html_content).addClass('justify-center flex-1').removeClass('justify-start');
        $(".main-logo").css({ "margin-bottom": "20px" })
    }
    else {
        const fullContent = `<div class="w-full flex flex-col items-center justify-start pt-8">${html_content}</div>`;
        $('#center-content-wrapper').html(fullContent).removeClass('justify-center flex-1').addClass('justify-start');
    }
}


function parseBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function removeFootnotes(text) {
    return text.replace(/\s*\[\d+\](\[\d+\])*\s*$/, '').trim();
}

function buildTable(rows) {
    if (rows.length < 2) {
        return '';
    }

    var tableHtml = '<table class="min-w-full divide-y divide-gray-200 mt-4 border border-gray-200 rounded-lg overflow-hidden">';
    var headerRow = rows[0];
    var dataRows = rows.slice(2);

    tableHtml += '<thead class="bg-gray-50"><tr>';
    var headerCells = headerRow.substring(1, headerRow.length - 1).split('|');
    $.each(headerCells, function (idx, cellContent) {
        tableHtml += '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">' + parseBold(removeFootnotes(cellContent)) + '</th>';
    });
    tableHtml += '</tr></thead>';

    tableHtml += '<tbody class="bg-white divide-y divide-gray-200">';
    $.each(dataRows, function (idx, rowStr) {
        tableHtml += '<tr>';
        var cells = rowStr.substring(1, rowStr.length - 1).split('|');
        $.each(cells, function (cellIdx, cellContent) {
            tableHtml += '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' + parseBold(removeFootnotes(cellContent)) + '</td>';
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody>';

    tableHtml += '</table>';
    return tableHtml;
}

window.structuredData = function (rawText) {
    var rawText = rawText.replace(/<think>.*?<\/think>/gs, '');
    var lines = rawText.split('\n');
    var htmlBuilder = [];
    var inList = false;
    var inTable = false;
    var inCodeBlock = false;
    var currentTableLines = [];
    var currentCodeLines = [];
    var codeLang = '';

    $.each(lines, function (i, line) {
        var trimmedLine = line.trim();

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
                htmlBuilder.push(buildTable(currentTableLines));
                currentTableLines = [];
                inTable = false;
            }
            return;
        }

        if (trimmedLine.startsWith('## ')) {
            if (inList) {
                htmlBuilder.push('</ul>');
                inList = false;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines));
                currentTableLines = [];
                inTable = false;
            }
            htmlBuilder.push('<h2 class="text-2xl font-semibold mt-4 mb-2">' + parseBold(trimmedLine.substring(3).trim()) + '</h2>');
        }

        else if (trimmedLine.startsWith('- ')) {
            if (!inList) {
                htmlBuilder.push('<ul class="list-disc list-inside ml-4 my-2">');
                inList = true;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines));
                currentTableLines = [];
                inTable = false;
            }
            htmlBuilder.push('<li class="text-gray-700">' + parseBold(trimmedLine.substring(2).trim()) + '</li>');
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
                htmlBuilder.push(buildTable(currentTableLines));
                currentTableLines = [];
                inTable = false;
            }
            htmlBuilder.push('<p class="text-gray-700 leading-relaxed my-2">' + parseBold(trimmedLine) + '</p>');
        }
    });

    if (inList) {
        htmlBuilder.push('</ul>');
    }
    if (inTable) {
        htmlBuilder.push(buildTable(currentTableLines));
    }
    if (inCodeBlock && currentCodeLines.length > 0) {
        htmlBuilder.push('<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-2"><code class="language-' + codeLang + '">' + currentCodeLines.join('\n') + '</code></pre>');
    }

    return htmlBuilder.join('');
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

const non_home_routes = [
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
    non_home_routes.forEach(non_home_route => {
        non_home_route.on("click", function () {
            $("#footer").removeClass("hidden");
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
