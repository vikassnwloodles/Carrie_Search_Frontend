function fetchUserProfile() {
    $.ajax({
        "url": window.env.BASE_URL + "/api/user/fetch-profile/",
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

            // Detach any previously bound submit handler to avoid duplicate bindings.
            // Without .off('submit'), calling fetchUserProfile multiple times would attach
            // multiple event handlers to #profile-update-form, causing redundant calls to updateUserProfile().
            $('#profile-update-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                updateUserProfile();
            });


        },
        error: function (xhr) {
            document.dispatchEvent(new CustomEvent('close-profile-modal', { bubbles: true }));

            const toastOptions = [{
                status_code: 500,
                message: "We encountered an issue while retrieving your profile data.",
                type: "error"
            }]

            showToast({ response: xhr, toastOptions })
        },
    });
}


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
        "url": window.env.BASE_URL + "/api/user/update-profile/",
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


$('#update-profile').on('click', function (e) {
    fetchUserProfile()
});