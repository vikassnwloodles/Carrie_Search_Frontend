import "../utils.js"
import "../handlers/handle_login.js"


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
        "url": window.env.BASE_URL + `/api/password-reset-confirm/${reset_password_uidb64}/${reset_password_token}/`,
        "method": "POST",
        "data": payload
    };

    $.ajax(settings).done(function (response) {
        // $successMessage.removeClass('hidden').addClass('shake').html(`<strong class="font-bold">Success!</strong>
        // <span class="block sm:inline">Your password has been updated. You can now log in with the new password.</span>`)
        const toastOptions = [{
            title: "Success!",
            message: "Your password has been updated. You can now log in with the new password.",
            type: "success"
        }]
        showToast({ toastOptions })

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
        "url": window.env.BASE_URL + "/api/request-password-reset/",
        method: 'POST',
        data: payload,

        success: function (data) {
            const message = data.message
            $('.login-success').addClass('shake')
            $('.login-success').hasClass('hidden') && $('.login-success').removeClass('shake');
            // $('.login-success').removeClass('hidden').html(
            //     `<strong class="font-bold">Success!</strong>
            //      <span class="block sm:inline">${message}</span>`
            // )

            const toastOptions = [{
                title: "Success!",
                message,
                type: "success"
            }]
            showToast({ toastOptions })

            // $('.password.alert').addClass('hidden')
            // $('#loginModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
            resetAndHideLoginModal()
        },
        error: function (xhr) {
            const message = xhr?.responseJSON?.error || xhr.statusText
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


window.showForgotPasswordModal = function () {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("forgot-form").classList.remove("hidden");
    document.getElementById("modalTitle").textContent = "Reset Password";
    $('.password.alert').addClass('hidden')
}