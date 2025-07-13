import "../utils.js"


function showErrorOnLoginFail() {
    $('.password.alert').removeClass('hidden').addClass('shake');
    setTimeout(() => {
        $('.password.alert').removeClass('shake');
    }, 300);
}

function hideErrorOnModalClose() {
    $('.password.alert').addClass('hidden').removeClass('shake');
    $('.password.alert').html($('.password.alert').data("original-html"))
}

window.resetAndHideLoginModal = function () {
    $('#loginModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
    hideErrorOnModalClose()
}

setupModalWithOutsideClose('loginModal', 'closeModal', resetAndHideLoginModal);


function updateLoginModalUI() {
    const $btn = $("#login_button");
    $btn.prop("disabled", true);
    $btn.data("default-text", $btn.text().trim());
    $btn.text("checking...");
}

function resetLoginModalUI() {
    const $btn = $("#login_button");
    const defaultText = $btn.data("default-text");
    if (defaultText) $btn.text(defaultText);
    $btn.prop("disabled", false);
}



$('#login-form').on('submit', function (e) {
    e.preventDefault();

    updateLoginModalUI()

    const username = $('#username').val();
    const password = $('#password').val();

    var form = new FormData();
    form.append("username", username);
    form.append("password", password);

    var settings = {
        "url": window.env.BASE_URL + "/api/login/",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        let data = JSON.parse(response);
        localStorage.setItem('accessToken', data.access);

        resetAndHideLoginModal()
        updateAuthUI()
        const toastOptions = [{
            title: "Welcome to Pete!",
            message: "You're now logged in. Start exploring the smartest way to search.",
            type: "success"
        }]
        showToast({ toastOptions })

    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) showErrorOnLoginFail({ error_context: jqXHR })
        else {
            resetAndHideLoginModal()
            const toastOptions = [{
                status_code: 403,
                title: JSON.parse(jqXHR.responseText).error,
                message: "Please verify your email to continue.",
                type: "info"
            }]
            showToast({ response: jqXHR, toastOptions })
        }
    }).always(function () {
        // do something regardless of success/failure
        resetLoginModalUI()
    });
});


window.showLoginModal = function () {
    $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
    document.getElementById("login-form").classList.remove("hidden"); // Show login form
    document.getElementById("forgot-form").classList.add("hidden");   // Hide forgot form
    document.getElementById("modalTitle").textContent = "Login";      // Set modal title
    $('.password.alert').addClass('hidden')
}

