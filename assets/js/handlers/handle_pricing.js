import "../utils.js"
import "../html_content/pricing_content.js"
import "../html_content/header_logo.js"


function checkSubscriptionStatus() {
    const token = localStorage.getItem('accessToken');
    const $pricingStatusContainer = $('#pricing-status-container');

    if (!token) {
        $pricingStatusContainer.html(`
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
                        <p class="font-bold mb-2">Access Denied</p>
                        <p>Please log in to view pricing and subscription details.</p>
                    </div>
                `);
        return;
    }

    $pricingStatusContainer.html('<p class="text-gray-600">Checking subscription status...</p>');

    var settings = {
        "url": window.env.BASE_URL + "/api/subscriptions/get-pro-status",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + token
        },
    };

    $.ajax(settings).done(function (response) {

        var data = response;
        if (data.subscription_status == 'active') {
            $pricingStatusContainer.html(`
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative">
                            <p class="font-bold mb-2">Subscription Active!</p>
                            <p>You are already subscribed to Pete. Enjoy unlimited access!</p>
                        </div>
                    `);
        } else {
            $pricingStatusContainer.html(`
                        <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative">
                            <p class="font-bold mb-2">Unlock Full Access</p>
                            <p class="mb-4">Subscribe now for only $9.97 per month and support Essential Families' mission.</p>
                            <button id="subscribe-button" class="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors">
                                Subscribe Now ($9.97/month)
                            </button>
                        </div>
                    `);

            $('#subscribe-button').on('click', createCheckoutSession);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        let errorMessage = 'Failed to fetch subscription status. Please try again.';
        if (jqXHR.status === 401) {
            errorMessage = 'Your session might have expired. Please log in again.';
        }
        $pricingStatusContainer.html(`
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
                        <p class="font-bold mb-2">Error</p>
                        <p>${errorMessage}</p>
                    </div>
                `);
    });

}


function createCheckoutSession() {
    const token = localStorage.getItem('accessToken');
    const $pricingStatusContainer = $('#pricing-status-container');

    $pricingStatusContainer.html('<p class="text-gray-600">Redirecting to payment gateway...</p>');

    var settings = {
        "url": window.env.BASE_URL + "/api/subscriptions/create-checkout-session/",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + token
        },
    };

    $.ajax(settings).done(function (response) {

        var data = response;
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        } else {
            $pricingStatusContainer.html(`
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
                            <p class="font-bold mb-2">Payment Error</p>
                            <p>Could not get payment URL. Please try again.</p>
                        </div>
                    `);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        let errorMessage = 'Failed to initiate payment. Please try again.';
        if (jqXHR.status === 401) {
            errorMessage = 'Your session might have expired. Please log in again.';
        }
        $pricingStatusContainer.html(`
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
                        <p class="font-bold mb-2">Error</p>
                        <p>${errorMessage}</p>
                    </div>
                `);
    });
}


window.renderPricing = function () {
    loadPageContent({html_content: pricingContent})
    checkSubscriptionStatus()
}
