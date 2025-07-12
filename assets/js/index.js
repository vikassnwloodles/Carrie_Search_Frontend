import "./routes/library_route.js"
import "./routes/signup_route.js"
import "./routes/home_route.js"
import "./routes/aboutus_route.js"
import "./routes/how_carrie_works_route.js"
import "./routes/pricing_route.js"
import "./routes/login_route.js"
import "./routes/logout_route.js"
import "./utils.js"



$(document).ready(function () {

// $(function () {
//     $('body').on('keyup', function (e) {
//         alert(e.which + ' key was pressed');
//     });

//     // Press the escape key
//     // pressEsc();
// });


    updateAuthUI();

    let selectedModel = "sonar";
    let isProModeEnabled = false;
    let isDeepResearchEnabled = false;
    let isLabsEnabled = false;
    let selectedSource = "web";

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const emailVerifyStatus = urlParams.get('status');
    const event = urlParams.get('event');
    const uidb64 = urlParams.get('uidb64');
    const token = urlParams.get('token');

    (function () {
        const $appMessageContainer = $('#app-message-container');

        if (event == "reset-password") {
            $('#resetPasswordModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
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




    // ✅ Function to close modal with optional alert cleanup
    function closeModal(modalId, alertSelector = null) {
        // $(`#${modalId}`).removeClass('visible opacity-100').addClass('invisible opacity-0');
        $(`#${modalId}`).addClass('hidden');

        if (alertSelector) {
            setTimeout(() => {
                $(alertSelector).addClass('hidden');
            }, 500);
        }
    }



    // 🔁 Apply to login and change password modals
    // setupModalWithOutsideClose('loginModal', 'closeModal', '.password.alert');
    setupModalWithOutsideClose('changePasswordModal', 'closeChangeModal', '.change-error, .change-success');


    // Close Reset Password Modal only on cross icon
    $('#closeResetModal').on('click', function () {
        $('#resetPasswordModal').removeClass('visible opacity-100').addClass('invisible opacity-0');
    });


    // $('a[href="#home"]').on('click', function (e) {
    //     e.preventDefault();
    //     resetToInitialHomeState();
    // });

    // $('.to-home').on('click', function (e) {
    //     e.preventDefault();
    //     resetToInitialHomeState();
    // });


    // $('#library-link').on('click', function (e) {
    //     e.preventDefault();
    //     renderLibrary()
    // });


    $(document).on('submit', '#change-password-form', function (e) {
        e.preventDefault()
        const $btn = $('#change-password-btn');

        // Disable the button and update its label
        $btn.prop('disabled', true).text('Changing...');

        const payload = {
            current_password: $('#currentPassword').val(),
            new_password: $('#newPasswordChange').val(),
            confirm_new_password: $('#confirmNewPassword').val(),
        };

        $.ajax({
            "url": BASE_URL + "/api/user/change-password/",
            method: 'POST',
            data: payload,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken') // only if required
            },
            success: function (data) {
                title = "Password changed!"
                message = "Your password has been changed successfully."
                showToast({ title, message, type: "success" })

                // CLOSE MODAL AND RESET FORM
                $('#changePasswordModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
                $('#change-password-form')[0].reset();
            },
            error: function (xhr) {
                title = "Password change failed!"
                message = '<br>' + Object.entries(xhr.responseJSON)
                    .flatMap(([k, arr]) =>
                        arr.map(msg => `• ${user_friendly_msg_mapping[k]?.[msg] || msg}`)
                    )
                    .join('<br>');

                $('.change-error').removeClass('hidden').html(
                    `<strong class="font-bold">${title}</strong>
                     <span class="block sm:inline">${message}</span>`
                )
            },
            complete: function () {
                // Re-enable the button after request completes
                setTimeout(() => {
                    $btn.prop('disabled', false).text('Change Password');
                }, 300);  // small delay to let modal close smoothly
            }
        });
    })


    let user_friendly_msg_mapping = {
        "new_password": {
            "This password is too short. It must contain at least 8 characters.": "Your new password is too short. It must be at least 8 characters long.",
            "This password is too common.": "Your new password is too common. Please choose something less predictable.",
            "This password is entirely numeric.": "Your new password cannot be made up of only numbers. Add some letters or symbols.",
        }
    }


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


    $(document).on('submit', '#reset-password-form', function (e) {
        e.preventDefault();
        const $successMessage = $('.reset-success');
        const $errorMessage = $('.reset-error');
        setTimeout(() => {
            $errorMessage.removeClass('shake')
        }, 300);


        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (newPassword !== confirmPassword) {
            $errorMessage.removeClass('hidden').addClass('shake').html(`<strong class="font-bold">Error!</strong>
            <span class="block sm:inline">Passwords do not match. Please try again.</span>`)
            return;
        }

        const payload = {
            new_password: newPassword,
        };

        var settings = {
            "url": BASE_URL + `/api/password-reset-confirm/${uidb64}/${token}/`,
            "method": "POST",
            "data": payload
        };

        $.ajax(settings).done(function (response) {
            // $successMessage.removeClass('hidden').addClass('shake').html(`<strong class="font-bold">Success!</strong>
            // <span class="block sm:inline">Your password has been updated. You can now log in with the new password.</span>`)
            title = "Success!"
            message = "Your password has been updated. You can now log in with the new password."
            type = "success"
            showToast({ title, message, type })
            $('#reset-password-form')[0].reset();
            $('#resetPasswordModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
            window.history.pushState({}, '', '/index.html');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON.error == "Invalid or expired token") {
                $errorMessage.removeClass('hidden').addClass('shake').html(`
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">
      The reset link is invalid or has expired. 
      <a href="#" id="resendResetLink" class=" text-teal-600 hover:underline">Resend reset link</a>.
    </span>
  `)
            }
            else {
                $errorMessage.removeClass('hidden').addClass('shake').html(`<strong class="font-bold">Error!</strong>
                <span class="block sm:inline">${jqXHR.responseJSON.error}</span>`)
            }
        });
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

    // Function to close all dropdowns
    function closeAllDropdowns() {
        // $modelDropdown.addClass('hidden');
        $sourceDropdown.addClass('hidden');
        $proModeDropdown.addClass('hidden');
        $deepResearchDropdown.addClass('hidden');
        $labsDropdown.addClass('hidden');
    }

    // $modelSelectButton.on('click', function (e) {
    //     e.stopPropagation();
    //     $modelDropdown.toggleClass('hidden');
    // });

    $(document).on('click', '#model-select-button', function (e) {
        e.stopPropagation();

        const $modelDropdown = $('#model-dropdown'); // ✅ fresh reference
        $modelDropdown.toggleClass('hidden');
    });


    $('#pro-mode-button').click(function () {
        $('#model-select-container').removeClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#deep-research-button').removeClass('text-blue-500').addClass('text-gray-500')
    });

    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });



    // $modelDropdown.on('click', '.model-option', function () {
    //     let $clicked = $(this);
    //     selectedModel = $clicked.data('model-value');

    //     $modelDropdown.find(".model-option").each(function () {
    //         $(this).find("p").eq(0).addClass("text-gray-800");
    //         $(this).find("p").eq(1).addClass("text-gray-600");
    //     });

    //     $clicked.find("p").eq(0).removeClass("text-gray-800").addClass("text-blue-500");
    //     $clicked.find("p").eq(1).removeClass("text-gray-600").addClass("text-blue-500");

    //     $modelDropdown.addClass('hidden');
    // });


    // --- Source Selection Dropdown Logic ---
    const $sourceSelectButton = $('#source-select-button');
    const $sourceDropdown = $('#source-dropdown');

    // Toggle dropdown visibility for source
    $sourceSelectButton.on('click', function (e) {
        e.stopPropagation();
        closeAllDropdowns(); // Close others first
        $sourceDropdown.toggleClass('hidden');
    });

    // Handle source selection
    $sourceDropdown.on('click', '.source-option', function () {
        selectedSource = $(this).data('source-value');
        console.log("Selected Source:", selectedSource);
        // Optionally, visually indicate the selected source (e.g., add a class)
        $('.source-option').removeClass('bg-teal-100'); // Remove highlight from previous selection
        $(this).addClass('bg-teal-100'); // Highlight current selection
        $sourceDropdown.addClass('hidden'); // Hide dropdown after selection
    });
    // Set initial highlight for default source
    $('.source-option[data-source-value="' + selectedSource + '"]').addClass('bg-teal-100');


    // --- Left-Side Toggle Dropdown Logic ---

    $proModeButton.on('click', function (e) {
        e.stopPropagation();
        closeAllDropdowns();
        $proModeDropdown.toggleClass('hidden');
    });

    $deepResearchButton.on('click', function (e) {
        e.stopPropagation();
        closeAllDropdowns();
        $deepResearchDropdown.toggleClass('hidden');
    });

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

        if (!token) {
            loadPageContent('<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Please log in to view your Library.</h2></div>');
            return;
        }

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
            let errorMessage = '<p class="font-bold">Error fetching data</p><p>Could not fetch Stripe Customer Portal URL. Please try again.</p>';
            if (jqXHR.status === 401) {
                errorMessage += '<p>Your session might have expired. Please log in again.</p>';
            }
            $('#app-message-container').removeClass('hidden').addClass('bg-red-100 text-red-700 p-3 rounded-lg').html(`
                ${errorMessage}
                `);
            setTimeout(() => {
                $('#app-message-container').addClass('hidden').removeClass('bg-green-100 text-green-700 p-3 rounded-lg').html('');
            }, 5000);


            setTimeout(() => {
                $('#dropdown-menu')[0].dispatchEvent(new CustomEvent('unset-loading', { bubbles: true }));
            }, 300);
        });
    });



    $('#update-profile').on('click', function (e) {
        fetchUserProfile()
    });


    function fetchUserProfile() {
        $.ajax({
            "url": BASE_URL + "/api/user/fetch-profile/",
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken') // only if required
            },
            success: function (data) {
                // Populate form fields
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#date_of_birth').val(data.date_of_birth);
                $('#gender').val(data.gender);
                $('#preferred_pronouns').val(data.preferred_pronouns);
                $('#email').val(data.email);
                $('#mobile_phone_number').val(data.mobile_phone_number);
                $('#home_address').val(data.home_address);
                $('#race_ethnicity').val(data.race_ethnicity);
                $('#household_income_range').val(data.household_income_range);
                $('#marital_status').val(data.marital_status);
                $('#number_of_people_in_household').val(data.number_of_people_in_household);
                $('#is_employed').prop('checked', data.is_employed);
                $('#is_student').prop('checked', data.is_student);
                $('#has_computer_or_internet').prop('checked', data.has_computer_or_internet);

                $('#profile-update-form').on('submit', function (e) {
                    e.preventDefault();
                    updateUserProfile();
                });


            },
            error: function (xhr) {
                document.dispatchEvent(new CustomEvent('close-profile-modal', { bubbles: true }));
                message = "We encountered an issue while retrieving your profile data."
                showErrorToast({ res: xhr, message })
            },
        });
    }



    document.getElementById("showForgot").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("forgot-form").classList.remove("hidden");
        document.getElementById("modalTitle").textContent = "Reset Password";
        $('.password.alert').addClass('hidden')
        $('#login-form')[0].reset();
        $('.login-success').addClass('hidden')
    });

    // document.getElementById("showLogin").addEventListener("click", function (e) {
    //     e.preventDefault();
    //     document.getElementById("forgot-form").classList.add("hidden");
    //     document.getElementById("login-form").classList.remove("hidden");
    //     document.getElementById("modalTitle").textContent = "Login";
    //     $('.password.alert').addClass('hidden')
    //     $('#forgot-form')[0].reset();
    //     $('.login-success').addClass('hidden')
    // });


    $(document).on('submit', '#forgot-form', function (e) {
        e.preventDefault()

        $('.password.alert').removeClass('shake')
        $('.login-success').removeClass('shake')

        const $btn = $('#password-reset-btn');

        // Disable the button and update its label
        $btn.prop('disabled', true).text('Sending...');

        const payload = {
            email: $('#resetEmail').val(),
        };

        $.ajax({
            "url": BASE_URL + "/api/request-password-reset/",
            method: 'POST',
            data: payload,

            success: function (data) {
                message = data.message
                $('.login-success').addClass('shake')
                $('.login-success').hasClass('hidden') && $('.login-success').removeClass('shake');
                // $('.login-success').removeClass('hidden').html(
                //     `<strong class="font-bold">Success!</strong>
                //      <span class="block sm:inline">${message}</span>`
                // )
                title = "Success!"
                message = message
                type = "success"
                showToast({ title, message, type })
                $('.password.alert').addClass('hidden')
                $('#loginModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
            },
            error: function (xhr) {
                message = xhr.responseJSON.error
                $('.password.alert').removeClass('hidden').addClass('shake').html(
                    `<strong class="font-bold">Error!</strong>
                     <span class="block sm:inline">${message}</span>`
                )
                $('.login-success').addClass('hidden')
            },
            complete: function () {
                // Re-enable the button after request completes
                setTimeout(() => {
                    $btn.prop('disabled', false).text('Send Reset Link');
                }, 300);  // small delay to let modal close smoothly
            }
        });
    })


    function updateUserProfile() {
        const $btn = $('#profile-update-btn');

        // Disable the button and update its label
        $btn.prop('disabled', true).text('Updating...');

        const profileData = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            date_of_birth: $('#date_of_birth').val(),
            gender: $('#gender').val(),
            preferred_pronouns: $('#preferred_pronouns').val(),
            email: $('#email').val(),
            mobile_phone_number: $('#mobile_phone_number').val(),
            home_address: $('#home_address').val(),
            race_ethnicity: $('#race_ethnicity').val(),
            household_income_range: $('#household_income_range').val(),
            marital_status: $('#marital_status').val(),
            number_of_people_in_household: $('#number_of_people_in_household').val(),

            is_employed: $('#is_employed').is(':checked'),
            is_student: $('#is_student').is(':checked'),
            has_computer_or_internet: $('#has_computer_or_internet').is(':checked')
        };

        $.ajax({
            "url": BASE_URL + "/api/user/update-profile/",
            method: 'PATCH',
            data: profileData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken') // only if required
            },
            success: function (data) {
                $('#app-message-container').removeClass('hidden').addClass('bg-green-100 text-green-700 p-3 rounded-lg').html(`
                    <p class="font-bold">Profile updated!</p><p>Your profile has been updated successfully.</p>
                    `);
                setTimeout(() => {
                    $('#app-message-container').addClass('hidden').removeClass('bg-green-100 text-green-700 p-3 rounded-lg').html('');
                }, 5000);
            },
            error: function (xhr) {
                $('#app-message-container').removeClass('hidden').addClass('bg-red-100 text-red-700 p-3 rounded-lg').html(`
                    <p class="font-bold text-red-600">Profile update failed!</p><p>There was an error updating your profile. Please try again.</p>
                    `);
                setTimeout(() => {
                    $('#app-message-container').addClass('hidden').removeClass('bg-red-100 text-red-700 p-3 rounded-lg').html('');
                }, 5000);
            },
            complete: function () {
                document.dispatchEvent(new CustomEvent('close-profile-modal', { bubbles: true }));
                // Re-enable the button after request completes
                setTimeout(() => {
                    $btn.prop('disabled', false).text('Update Profile');
                }, 300);  // small delay to let modal close smoothly
            }
        });
    }


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