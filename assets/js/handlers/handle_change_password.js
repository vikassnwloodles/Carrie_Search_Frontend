function resetAndHideChangePassModal() {
    $('#changePasswordModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
    $('.change-error').addClass('hidden').removeClass('shake');
}

setupModalWithOutsideClose('changePasswordModal', 'closeChangeModal', resetAndHideChangePassModal);


// function hideErrorOnModalClose() {
//     $('.password.alert').addClass('hidden').removeClass('shake');
// }

// function resetAndHideLoginModal() {
//     $('#loginModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
//     hideErrorOnModalClose()
// }

// setupModalWithOutsideClose('loginModal', 'closeModal', resetAndHideLoginModal);




let user_friendly_msg_mapping = {
    "new_password": {
        "This password is too short. It must contain at least 8 characters.": "Your new password is too short. It must be at least 8 characters long.",
        "This password is too common.": "Your new password is too common. Please choose something less predictable.",
        "This password is entirely numeric.": "Your new password cannot be made up of only numbers. Add some letters or symbols.",
    }
}


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
        "url": window.env.BASE_URL + "/api/user/change-password/",
        method: 'POST',
        data: payload,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken') // only if required
        },
        success: function (data) {
            const toastOptions = [{
                title: "Password changed!",
                message: "Your password has been changed successfully.",
                type: "success"
            }]

            showToast({ toastOptions })

            // CLOSE MODAL AND RESET FORM
            $('#changePasswordModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
            $('#change-password-form')[0].reset();
        },
        error: function (xhr) {
            const status = xhr.status
            if (status === 400) {
                const title = "Password change failed!"
                const message = '<br>' + Object.entries(xhr.responseJSON)
                    .flatMap(([k, arr]) =>
                        arr.map(msg => `• ${user_friendly_msg_mapping[k]?.[msg] || msg}`)
                    )
                    .join('<br>');

                $('.change-error').removeClass('hidden').html(
                    `<strong class="font-bold">${title}</strong>
                     <span class="block sm:inline">${message}</span>`
                ).addClass("shake")
                setTimeout(() => {
                    $('.change-error').removeClass("shake")
                }, 300);
            }
            else showToast({ response: xhr })
        },
        complete: function () {
            // Re-enable the button after request completes
            setTimeout(() => {
                $btn.prop('disabled', false).text('Change Password');
            }, 300);  // small delay to let modal close smoothly
        }
    });
})