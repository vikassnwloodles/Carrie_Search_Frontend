import "../utils.js"


setupModalWithOutsideClose('loginModal', 'closeModal', '.password.alert', hideLoginModal);


function updateHeaderAfterLogin() {
    $("#login-link").addClass("hidden")
    $("#signup-link").addClass("hidden")
    $("#logout-link").removeClass("hidden")
}


function updateSidebarAfterLogin() {
    $('#user-profile-section').show()
}

function updateUIAfterLogin() {
    updateHeaderAfterLogin()
    updateSidebarAfterLogin()
    renderHome()
}

function showErrorOnLoginFail() {
    $('.password.alert').removeClass('hidden').addClass('shake');
    setTimeout(() => {
        $('.password.alert').removeClass('shake');
    }, 300);
}


function resetLoginModal() {
    $('.password.alert').addClass('hidden').removeClass('shake');
}


function hideLoginModal() {
    $('#loginModal').addClass('invisible opacity-0').removeClass('visible opacity-100');
    resetLoginModal()
}


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

        hideLoginModal()
        // updateUIAfterLogin()
        updateAuthUI()

        let title = "Welcome to Pete!"
        let message = "You're now logged in. Start exploring the smartest way to search."
        showToast({ title, message, type: "success" })

    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) showErrorOnLoginFail({ error_context: jqXHR })
        else{
            hideLoginModal()
            showErrorToast({ response: jqXHR })
        }
    }).always(function () {
        // do something regardless of success/failure
        resetLoginModalUI()
    });
});


function showLoginModal() {
    $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
    document.getElementById("login-form").classList.remove("hidden"); // Show login form
    document.getElementById("forgot-form").classList.add("hidden");   // Hide forgot form
    document.getElementById("modalTitle").textContent = "Login";      // Set modal title
    $('#forgot-form')[0].reset();
    $('#login-form')[0].reset();
    $('.login-success').addClass('hidden')
}


window.renderLogin = function () {
    showLoginModal()
}
