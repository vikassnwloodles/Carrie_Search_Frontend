import "./routes/library_route.js"
import "./routes/signup_route.js"
import "./routes/home_route.js"
import "./routes/aboutus_route.js"
import "./routes/how_carrie_works_route.js"
import "./routes/pricing_route.js"
import "./routes/login_route.js"
import "./routes/logout_route.js"
import "./routes/forgot_password_route.js"

import "./handlers/handle_change_password.js"
import "./handlers/handle_user_profile.js"
import "./handlers/search_handlers/handle_search.js"

import "./utils.js"



$(document).ready(function () {

    updateAuthUI();


    let selectedModel = "sonar";
    let isProModeEnabled = false;
    let isDeepResearchEnabled = false;
    let isLabsEnabled = false;
    let selectedSource = "web";
    const $sourceDropdown = $('#source-dropdown');

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const emailVerifyStatus = urlParams.get('status');
    const event = urlParams.get('event');
    const uidb64 = urlParams.get('uidb64');
    const token = urlParams.get('token');
    const sharedChatId = urlParams.get('shared-chat-id');

    (function () {
        const $appMessageContainer = $('#app-message-container');

        if (event == "reset-password") {
            $('#resetPasswordModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
        }

        if (sharedChatId) {
            // RENDER SPECIFIC SHARED CHAT ONLY
            const authToken = localStorage.getItem('accessToken');
            fetch(window.env.BASE_URL + '/api/public-chat/' + sharedChatId + '/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken  // Replace with your token variable
                },
            })
                .then(response => {
                    if (response.status === 401) {
                        const toastOptions = [{
                            status_code: 401,
                            title: "Unauthorized",
                            message: "Please log in to access this URL",
                            type: "error"
                        }]
                        showToast({ response, toastOptions })
                    }
                    return response.json();
                })
                .then(data => {
                    var links = [];
                    var content = null;
                    var images = [];
                    var response = data.response

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
                            query: data.prompt,
                            links: links,
                            images: images,
                            content: content,
                            search_result_id: response.id
                        };
                        const $searchToastBox = $(searchToastBox.trim());
                        $searchToastBox.attr("id", "loading-message").text("Please standby, Pete is working to make your life and work easier...!")
                        $searchToastBox.addClass("animate-fade-in text-gray-500").removeClass("text-red-500 mb-8")
                        const dynamicHeight = $('#dynamic-content-container').height();
                        const searchToastBoxHeight = getHtmlStringHeight(searchToastBox.trim());
                        // $searchToastBox.css('margin-bottom', dynamicHeight - searchToastBoxHeight - 32 + 'px');
                        $searchToastBox.css('margin-bottom', dynamicHeight - searchToastBoxHeight - 150 + 'px');

                        // const loadingHtml = $searchToastBox.prop("outerHTML");
                        let loadingHtmlContainerId = "loading-message-" + Date.now(); // or any unique logic
                        $searchToastBox.attr("id", loadingHtmlContainerId);
                        const loadingHtml = $searchToastBox.prop("outerHTML");
                        $('#search-results-container').append(loadingHtml).show();
                        renderSearchResults(mockResponse, loadingHtmlContainerId);

                        $(".main-logo").addClass("hidden");
                        $("#footer").addClass("hidden");
                        $("#dummy-footer").removeClass("hidden");
                        $("#search-form").css({ "position": "fixed", "bottom": "-20px" });

                    } else if (data.error) {
                        const toastOptions = [{
                            title: "Chat not found!",
                            message: "",
                            type: "warning"
                        }]
                        showToast({ toastOptions })
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong while retrieving the chat.');
                });
        }


        if (sessionId) {
            localStorage.setItem('session_id', sessionId);

            $appMessageContainer.removeClass('hidden').addClass('bg-green-100 text-green-700 p-3 rounded-lg').html(`
                    <p class="font-bold">Payment Successful!</p>
                    <p>Your subscription has been activated. Thank you for your support!</p>
                `);

            urlParams.delete('session_id');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            history.replaceState(null, '', newUrl);

            setTimeout(() => {
                $appMessageContainer.addClass('hidden').removeClass('bg-green-100 text-green-700 p-3 rounded-lg').html('');
            }, 5000);
        }

        if (emailVerifyStatus) {

            if (emailVerifyStatus == 'invalid') {
                $appMessageContainer.removeClass('hidden').addClass('bg-red-100 text-red-700 p-3 rounded-lg').html(`
                        <p class="font-bold">Email Not Verified!</p>
                        <p>Invalid! Email can not be verified</p>
                    `);
            } else if (emailVerifyStatus == 'success') {

                $appMessageContainer.removeClass('hidden').addClass('bg-green-100 text-green-700 p-3 rounded-lg').html(`
                        <p class="font-bold">Email Verify Successful!</p>
                        <p>Your email has been successfully verified. Thank you for your support!</p>
                    `);
            } else if (emailVerifyStatus == 'expired') {
                $appMessageContainer.removeClass('hidden').addClass('bg-red-100 text-red-700 p-3 rounded-lg').html(`
                        <p class="font-bold">Email Not Verified!</p>
                        <p>Invalid! Email verification token expired</p>
                    `);
            }

            urlParams.delete('status');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            history.replaceState(null, '', newUrl);

            setTimeout(() => {
                $appMessageContainer.addClass('hidden').removeClass('bg-green-100 text-green-700 p-3 rounded-lg').html('');
            }, 5000);
        }

    })();

    const BASE_URL = window.env.BASE_URL;


    // Close Reset Password Modal only on cross icon
    $('#closeResetModal').on('click', function () {
        $('#resetPasswordModal').removeClass('visible opacity-100').addClass('invisible opacity-0');
    });


    $(document).on('click', "#change-password", function (e) {
        e.preventDefault()
        $('#changePasswordModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
        $('.change-error').addClass('hidden')
        $('.change-success').addClass('hidden')
    })



    $(document).on('click', '#resendResetLink', function (e) {
        e.preventDefault();
        $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
        document.getElementById("login-form").classList.add("hidden"); // Show login form
        document.getElementById("forgot-form").classList.remove("hidden");   // Hide forgot form
        document.getElementById("modalTitle").textContent = "Reset Password";      // Set modal title
        $('#forgot-form')[0].reset();
        $('#login-form')[0].reset();
        $('.login-success').addClass('hidden')
        $('.password.alert').addClass('hidden')
        $('#resetPasswordModal').addClass('invisible opacity-0').removeClass('visible opacity-100');


        // document.getElementById("login-form").classList.add("hidden");
        // document.getElementById("forgot-form").classList.remove("hidden");
        // document.getElementById("modalTitle").textContent = "Reset Password";
        // $('.password.alert').addClass('hidden')
        // $('#login-form')[0].reset();
        // $('.login-success').addClass('hidden')
    });


    $(document).on('submit', '#signup-form-new', function (e) {
        e.preventDefault();

        const $form = $(this);
        const formData = new FormData();

        $form.find('input, select, textarea').each(function () {
            const $this = $(this);
            const name = $this.attr('name');
            let value;

            if (!name) return;

            if ($this.is(':radio')) {
                if ($this.is(':checked')) {
                    formData.append(name, $this.val());
                }
            } else if ($this.is(':checkbox')) {
                formData.append(name, $this.is(':checked') ? 'true' : 'false');
            } else {
                value = $this.val();
                formData.append(name, value);
            }
        });

        const password = $('#signup-password').val();
        const confirmPassword = $('#confirm-password').val();
        const $signupMessage = $('#signup-message');

        if (password !== confirmPassword) {
            $signupMessage.removeClass('hidden bg-green-100 text-green-700').addClass('bg-red-100 text-red-700').text('Error: Passwords do not match. Please try again.');
            return;
        }

        $signupMessage.removeClass('bg-green-100 bg-red-100 text-green-700 text-red-700').addClass('hidden').text('');
        $signupMessage.removeClass('hidden').addClass('bg-gray-100 text-gray-700').text('Signing up...');


        var settings = {
            "url": BASE_URL + '/api/signup/',
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": formData
        };

        $.ajax(settings).done(function (response) {
            console.log("Signup success:", response);
            $signupMessage.removeClass('hidden bg-gray-100 text-gray-700 bg-red-100').addClass('bg-green-100 text-green-700').text('Signup successful! Please verify your email and log in with your new account.');

            $form[0].reset();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Signup failed:", jqXHR.responseText, textStatus, errorThrown);
            let errorMessage = 'Signup failed. Please try again.';
            try {
                const errorResponse = JSON.parse(jqXHR.responseText);
                if (errorResponse && errorResponse.detail) {
                    errorMessage = errorResponse.detail;
                } else if (errorResponse) {

                    const errorDetails = Object.values(errorResponse).flat().join(' ');
                    if (errorDetails) errorMessage = errorDetails;
                }
            } catch (e) {

            }
            $signupMessage.removeClass('hidden bg-gray-100 text-gray-700 bg-green-100').addClass('bg-red-100 text-red-700').text('Error: ' + errorMessage);
        });
    });

    const $proModeButton = $('#pro-mode-button');
    const $proModeDropdown = $('#pro-mode-dropdown');
    const $deepResearchButton = $('#deep-research-button');
    const $deepResearchDropdown = $('#deep-research-dropdown');
    const $labsButton = $('#labs-button');
    const $labsDropdown = $('#labs-dropdown');
    const $managePlan = $('#manage-plan');
    const $sourceSelectButton = $('#source-select-button');



    // $modelSelectButton.on('click', function (e) {
    //     e.stopPropagation();
    //     $modelDropdown.toggleClass('hidden');
    // });


    // --- Left-Side Toggle Dropdown Logic ---

    $labsButton.on('click', function (e) {
        e.stopPropagation();
        closeAllDropdowns();
        $labsDropdown.toggleClass('hidden');
    });

    $managePlan.on('click', function (e) {
        e.stopPropagation();
        closeAllDropdowns();
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        // if (!token) {
        //     loadPageContent('<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Please log in to view your Library.</h2></div>');
        //     return;
        // }

        var form = new FormData();
        var settings = {
            "url": BASE_URL + "/api/subscriptions/stripe-portal/",
            "method": "POST",
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
            response = JSON.parse(response)
            window.location.href = response.url;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            const toastOptions = [{
                status_code: 400,
                title: "Error fetching data",
                message: "Could not fetch Stripe Customer Portal URL. Please try again.",
                type: "error"
            }]

            showToast({ response: jqXHR, toastOptions })

            // let errorMessage = '<p class="font-bold">Error fetching data</p><p>Could not fetch Stripe Customer Portal URL. Please try again.</p>';
            // if (jqXHR.status === 401) {
            //     errorMessage += '<p>Your session might have expired. Please log in again.</p>';
            // }
            // $('#app-message-container').removeClass('hidden').addClass('bg-red-100 text-red-700 p-3 rounded-lg').html(`
            //     ${errorMessage}
            //     `);
            // setTimeout(() => {
            //     $('#app-message-container').addClass('hidden').removeClass('bg-red-100 text-red-700 p-3 rounded-lg').html('');
            // }, 5000);

        }).always(function () {
            // do something regardless of success/failure
            setTimeout(() => {
                $('#dropdown-menu')[0].dispatchEvent(new CustomEvent('unset-loading', { bubbles: true }));
            }, 300);
        });
    });


    $(document).on('click', function (e) {
        // if (!$modelDropdown.hasClass('hidden') && !$(e.target).closest('#model-dropdown').length && !$(e.target).closest('#model-select-button').length) {
        //     $modelDropdown.addClass('hidden');
        // }

        // Check if click is outside any dropdown or their trigger buttons
        const isClickOutside = (dropdown, button) =>
            !dropdown.hasClass('hidden') &&
            !$(e.target).closest(dropdown).length &&
            !$(e.target).closest(button).length;

        // if (isClickOutside($modelDropdown, $modelSelectButton)) {
        //     $modelDropdown.addClass('hidden');
        // }
        if (isClickOutside($sourceDropdown, $sourceSelectButton)) {
            $sourceDropdown.addClass('hidden');
        }
        if (isClickOutside($proModeDropdown, $proModeButton)) {
            $proModeDropdown.addClass('hidden');
        }
        if (isClickOutside($deepResearchDropdown, $deepResearchButton)) {
            $deepResearchDropdown.addClass('hidden');
        }
        if (isClickOutside($labsDropdown, $labsButton)) {
            $labsDropdown.addClass('hidden');
        }
    });

    // --- Toggle Checkbox Logic ---
    $('#pro-mode-toggle').on('change', function () {
        isProModeEnabled = $(this).is(':checked');
        console.log("Pro Mode Enabled:", isProModeEnabled);
    });

    $('#deep-research-toggle').on('change', function () {
        isDeepResearchEnabled = $(this).is(':checked');
        console.log("Deep Research Enabled:", isDeepResearchEnabled);
    });

    $('#labs-toggle').on('change', function () {
        isLabsEnabled = $(this).is(':checked');
        console.log("Labs Enabled:", isLabsEnabled);
    });

    const $micButton = $('#mic-button');
    const $micIcon = $('#mic-icon');
    const $aiSearchInput = $('#ai_search');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            console.log('Speech recognition started');
            $micIcon.removeClass('text-gray-500').addClass('text-red-500');
            $aiSearchInput.attr('placeholder', 'Listening...');
        };

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            console.log('Speech recognized:', transcript);
            $aiSearchInput.val(transcript);
        };

        recognition.onend = function () {
            console.log('Speech recognition ended');
            $micIcon.removeClass('text-red-500').addClass('text-gray-500');
            $aiSearchInput.attr('placeholder', 'Search, Ask, or Write Anything!');
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
            $micIcon.removeClass('text-red-500').addClass('text-gray-500');
            $aiSearchInput.attr('placeholder', 'Speech recognition failed. Try typing.');
        };

        $micButton.on('click', function () {
            try {
                recognition.start();
            } catch (e) {
                console.error('Speech recognition already in progress or not allowed:', e);

                $aiSearchInput.attr('placeholder', 'Microphone already active or permission denied. Please allow microphone access.');
                setTimeout(() => {
                    $aiSearchInput.attr('placeholder', 'Search, Ask, or Write Anything!');
                }, 3000);
            }
        });
    } else {
        console.warn('Speech Recognition API not supported in this browser.');
        $micButton.attr('title', 'Speech recognition not supported').prop('disabled', true);
        $micIcon.removeClass('text-gray-500').addClass('text-gray-300'); // Grey out mic icon
    }

});