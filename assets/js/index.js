$(document).ready(function () {
    let selectedModel = "best";
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

    const pageLogoHtml = `
            <img class="main-logo" src="./assets/images/carrie.png" alt="Carrie">
        `;

    const aboutUsContent = `
<div class="max-w-6xl mx-auto py-10 animate-fade-in px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <!-- Image Column -->
        <div class="md:col-span-4 flex justify-center">
            <img src="./assets/images/about-page-image.avif" alt="About Carrie Image" class="rounded-lg shadow-lg w-full h-auto max-w-sm md:max-w-full object-cover">
        </div>
        <!-- Intro Content Column -->
        <div class="md:col-span-8 text-left">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Carrie Search — The Easiest Way to Search, Ask, and Write</h1>
            <p class="text-lg text-gray-700 leading-relaxed mb-4">
                Carrie Search is your all-in-one platform for searching, asking questions, and writing anything—quickly and effortlessly. As a smarter, more intuitive alternative to Google and ChatGPT, Carrie Search is designed to make your digital life easier, more productive, and more meaningful.
            </p>
        </div>
    </div>

    <!-- Full-Width Content -->
    <div class="mt-12 text-left">
        <h2 class="text-3xl font-semibold text-gray-800 mb-3">Why Carrie Search?</h2>
        <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
            <li><strong>Effortless Searching:</strong> Find accurate answers fast, every time.</li>
            <li><strong>Ask Anything:</strong> Get clear, reliable responses to any question.</li>
            <li><strong>Write With Confidence:</strong> From emails to essays, Carrie Search helps you craft your best work.</li>
            <li><strong>Integrated Simplicity:</strong> Search, ask, and write in one seamless experience.</li>
            <li><strong>Privacy First:</strong> Your searches and questions are always safe and secure.</li>
        </ul>
        <p class="text-xl font-semibold text-teal-700 mb-4">
            Still using Google? Why?
            Carrie Search gives you more—making your life easier while making a real difference in the world.
        </p>

        <h2 class="text-3xl font-semibold text-gray-800 mb-3">Powered by Purpose</h2>
        <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Carrie Search is proudly provided by Essential Families, a Missouri nonprofit 501(c)(3).
            For a small monthly fee of just $9.97, you are directly funding Essential Families’ Essential Mobility Program. This program is dedicated to enabling economic mobility for unserved and underserved families in urban and rural communities across the country.
        </p>

        <h2 class="text-3xl font-semibold text-gray-800 mb-3">Your Impact</h2>
        <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 space-y-2">
            <li>Free brand new Chromebook and 6 months of internet access for urban and rural families in need</li>
            <li>Digital skills training and 24/7 telehealth support</li>
            <li>24/7 Parenting resources, emergency assistance, and more</li>
            <li>Pathways to economic mobility and brighter futures</li>
        </ul>
        <p class="text-lg italic text-gray-600 leading-relaxed mb-6">
            Essential Families is committed to enabling economic mobility and building opportunity—one search at a time.
        </p>

        <blockquote class="border-l-4 border-teal-600 pl-4 py-2 mb-6">
            <p class="text-xl text-gray-800 leading-relaxed">
                “We’re giving unserved and underserve urban and rural children and families ACCESS to change their lives, to make them stable, then enabling them to participate in the digital economy.”
            </p>
            <footer class="text-lg font-medium text-gray-600 mt-2">— Terri English-Yancy, Founder of Essential Families</footer>
        </blockquote>

        <h2 class="text-3xl font-semibold text-gray-800 mb-3">Sign Up Today!</h2>
        <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Carrie Search isn’t just about making your life easier—it’s about creating opportunity, stability, and hope for unserved and underserved urban and rural children and families nationwide.
            Why settle for ordinary when you can get more, give more, and help change lives?
        </p>
        <p class="text-2xl font-bold text-teal-600 leading-relaxed mb-2">
            Carrie Search: Making Searching, Asking, and Writing Easier—For You and for the World
        </p>
        <p class="text-lg text-gray-700">
            Powered by Essential Families.
            Creating opportunity, stability, and economic mobility for all.
        </p>
    </div>
</div>`;


    const signupContent = `
            <div class="max-w-3xl mx-auto py-10 animate-fade-in px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">Carrie Search Client Sign Up Form</h1>
                <p class="text-lg text-gray-700 leading-relaxed mb-4 text-center">
                    Why settle for Google when you can get more, give more, and help change lives?
                    Carrie Search isn’t just about making your life easier—it’s about creating opportunity, stability, and hope for unserved and underserved urban and rural children and families nationwide.
                </p>
                <p class="text-md text-gray-600 leading-relaxed mb-6 text-center">
                    Please complete the following form to register for Carrie Search. All fields marked with an asterisk (*) are required.
                </p>
                <p class="text-md font-semibold text-teal-700 leading-relaxed mb-8 text-center">
                    Your monthly donation of $9.97 helps fund Essential Families’ Economic Mobility Program, supporting unserved and underserved children and families in urban and rural communities across the United States.
                    Thank you for making a difference!
                </p>

                <form id="signup-form-new" class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <!-- Personal Information -->
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="first-name">
                                First Name:
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="first-name" name="first_name" type="text" placeholder="John">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="last-name">
                                Last Name:
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="last-name" name="last_name" type="text" placeholder="Doe">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="dob">
                            Date of Birth (MM/DD/YYYY):
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dob" name="date_of_birth" type="date">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="gender">
                                Gender:
                            </label>
                            <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="gender" name="gender">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-say">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="pronouns">
                                Preferred Pronouns:
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pronouns" name="preferred_pronouns" type="text" placeholder="e.g., She/Her, He/Him">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                            *Email Address:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" placeholder="email@example.com" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="mobile-phone">
                            Mobile Phone Number:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="mobile-phone" name="mobile_phone_number" type="tel" placeholder="(123) 456-7890">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="home-address">
                            Home Address (Street, City, State, Zip):
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="home-address" name="home_address" type="text" placeholder="123 Main St, Anytown, CA 12345">
                    </div>

                    <!-- Demographic Information -->
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Demographic Information</h2>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="race-ethnicity">
                            Race/Ethnicity:
                        </label>
                        <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="race-ethnicity" name="race_ethnicity">
                            <option value="">Select</option>
                            <option value="american-indian">American Indian or Alaska Native</option>
                            <option value="asian">Asian</option>
                            <option value="black">Black or African American</option>
                            <option value="hispanic">Hispanic or Latino</option>
                            <option value="white">White</option>
                            <option value="pacific-islander">Native Hawaiian or Other Pacific Islander</option>
                            <option value="two-or-more">Two or More Races</option>
                            <option value="other">Other</option>
                            <option value="not-disclose">Prefer not to disclose</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="household-income">
                            Household Income Range:
                        </label>
                        <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="household-income" name="household_income_range">
                            <option value="">Select</option>
                            <option value="0-25k">Less than $25,000</option>
                            <option value="25k-50k">$25,000 - $49,999</option>
                            <option value="50k-75k">$50,000 - $74,999</option>
                            <option value="75k-100k">$75,000 - $99,999</option>
                            <option value="100k+">$100,000 or more</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="marital-status">
                            Marital Status:
                        </label>
                        <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="marital-status" name="marital_status">
                            <option value="">Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="household-members">
                            Number of People in Household:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="household-members" name="number_of_people_in_household" type="number" min="1" placeholder="e.g., 4">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Are you currently employed?
                        </label>
                        <div class="flex items-center space-x-4">
                            <label class="inline-flex items-center">
                                <input type="radio" class="form-radio text-teal-600" name="is_employed" value="yes">
                                <span class="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="radio" class="form-radio text-teal-600" name="is_employed" value="no">
                                <span class="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Are you a student?
                        </label>
                        <div class="flex items-center space-x-4">
                            <label class="inline-flex items-center">
                                <input type="radio" class="form-radio text-teal-600" name="is_student" value="yes">
                                <span class="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="radio" class="form-radio text-teal-600" name="is_student" value="no">
                                <span class="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Do you currently have access to a computer or internet at home?
                        </label>
                        <div class="flex items-center space-x-4">
                            <label class="inline-flex items-center">
                                <input type="radio" class="form-radio text-teal-600" name="has_computer_or_internet" value="yes">
                                <span class="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="radio" class="form-radio text-teal-600" name="has_computer_or_internet" value="no">
                                <span class="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>

                    <!-- Account & Access -->
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Account & Access</h2>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-username">
                            *Create a Username:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="signup-username" name="username" type="text" placeholder="username" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-password">
                            *Create a Password:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="signup-password" name="password" type="password" placeholder="******************" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">
                            *Confirm Password:
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirm-password" name="confirm_password" type="password" placeholder="******************" required>
                    </div>

                    <!-- Consent and Agreement -->
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Consent and Agreement</h2>
                    <div class="mb-4">
                        <label class="inline-flex items-center">
                            <input type="checkbox" class="form-checkbox text-teal-600 rounded" name="agreed_to_terms" required>
                            <span class="ml-2 text-gray-700">*I agree to the Terms of Service and Privacy Policy.</span>
                        </label>
                    </div>
                    <div class="mb-6">
                        <label class="inline-flex items-center">
                            <input type="checkbox" class="form-checkbox text-teal-600 rounded" name="consent_to_communications">
                            <span class="ml-2 text-gray-700">I consent to receive communications (email, text, and automated call) from Essential Families about my account and available services.</span>
                        </label>
                    </div>
                    
                    <p class="text-sm text-gray-600 leading-relaxed mb-6 text-center">
                        By submitting this form, you are registering for Carrie Search and supporting Essential Families’ Essential Mobility Program, which enables economic mobility for unserved and underserved urban and rural communities across the country.
                    </p>
                    <p class="text-sm text-gray-600 leading-relaxed mb-6 text-center">
                        Your information will remain confidential and is used only to deliver the services you request and to maintain high-quality support for all clients.
                    </p>

                    <div class="flex items-center justify-center">
                        <button class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition-colors" type="submit">
                            Register for Carrie Search
                        </button>
                    </div>
                </form>
                <!-- Messages for Signup Form -->
                <div id="signup-message" class="hidden text-center mt-4 p-3 rounded-lg"></div>
            </div>`;

    const howCarrieWorksContent = `
            <div class="w-full py-10 animate-fade-in px-4 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">How Carrie Works</h1>
                <div class="max-w-4xl mx-auto mt-8">
                    <div class="relative" style="padding-bottom: 56.25%;">
                        <iframe class="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                            src="https://www.youtube.com/embed/X1U4wSVujgg" 
                            title="Carrie Search: Transforming Lives One Search at a Time!" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="no-referrer" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <p class="text-lg text-gray-700 leading-relaxed mt-8 text-center">
                        Watch this video to understand how Carrie Search can simplify your daily tasks!
                    </p>
                    <ul class="list-disc list-inside text-lg text-gray-700 leading-relaxed mt-4 space-y-2">
                        <li><strong>Seamless Searching:</strong> Get instant, relevant results from across the web.</li>
                        <li><strong>Intelligent Answers:</strong> Ask complex questions and receive concise, accurate answers.</li>
                        <li><strong>Effortless Writing:</strong> Generate drafts, refine content, and enhance your communication.</li>
                        <li><strong>Integrated Experience:</strong> All your digital needs met in one intuitive platform.</li>
                    </ul>
                </div>
            </div>`;

    let pricingContentTemplate = `
            <div class="max-w-xl mx-auto py-10 animate-fade-in px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl font-bold mb-6 text-gray-800">Pricing</h1>
                <div id="pricing-status-container" class="mt-8">
                    <p class="text-gray-600">Loading subscription status...</p>
                </div>
            </div>`;

    const initialCenterContent = $('#center-content-wrapper').html();

    function refreshLogstate() {
        updateAuthUI();
    }

    function updateAuthUI() {
        const token = localStorage.getItem('accessToken');
        const $authLink = $('#auth-link');
        const $signupLink = $('#signup-link');
        const $userProfileSection = $('#user-profile-section');

        if (token) {

            $authLink.text('Logout').off('click').on('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('accessToken');
                updateAuthUI();
                resetToInitialHomeState();
            });
            $signupLink.hide();

            fetchSubscriptionStatus()
                .then(data => {
                    if (data.subscription_status === 'active') {
                        $userProfileSection.show();
                    }
                })
                .catch(err => {
                    message = "We encountered an issue while checking your Pro subscription."
                    showErrorToast({
                        res: err,
                        message
                    });
                });

        } else {

            $authLink.text('Login').off('click').on('click', function (e) {
                e.preventDefault();
                $('#loginModal').removeClass('invisible opacity-0').addClass('visible opacity-100');
                document.getElementById("login-form").classList.remove("hidden"); // Show login form
                document.getElementById("forgot-form").classList.add("hidden");   // Hide forgot form
                document.getElementById("modalTitle").textContent = "Login";      // Set modal title
                $('#forgot-form')[0].reset();
                $('#login-form')[0].reset();
                $('.login-success').addClass('hidden')
            });
            $signupLink.show();
            $userProfileSection.hide();
        }
    }
    updateAuthUI();


    function showToast({ title, message, type, duration = 5000, text_center = true }) {
        let color = type === "success" ? "green" : type === "warning" ? "yellow" : type === "error" ? "red" : type === "info" ? "blue" : "gray";
        classes1 = `hidden ${text_center != true ? 'text-center' : ''}`
        classes2 = `bg-${color}-100 text-${color}-700 p-3 rounded-lg`
        $('#app-message-container').removeClass(classes1).addClass(classes2).html(`<p class="font-bold">${title}</p><p>${message}</p>`);
        setTimeout(() => {
            $('#app-message-container').addClass(classes1).removeClass(classes2).html('');
        }, duration);
    }

    // function showSuccessToast({title, message, type="success", duration = 5000, text_center=true}) {
    //     showToast({title, message, type, duration, text_center})
    // }

    function handleSessionExpired(duration) {
        title = "Session Expired!"
        message = "Your session has been expired! You are about to log out."
        type = "warning"
        showToast({ title, message, type, duration })
        localStorage.removeItem('accessToken');
        setTimeout(() => {
            updateAuthUI()
        }, duration);
    }


    function showErrorToast({ res, title = "Something went wrong!", message = "", type = "error", duration = 5000, text_center = true }) {
        if (res.status == 401) handleSessionExpired(duration);
        else showToast({ title, message, type, duration, text_center });
    }


    // ✅ Function to close modal with optional alert cleanup
    function closeModal(modalId, alertSelector = null) {
        $(`#${modalId}`).removeClass('visible opacity-100').addClass('invisible opacity-0');

        if (alertSelector) {
            setTimeout(() => {
                $(alertSelector).addClass('hidden');
            }, 500);
        }
    }

    // ✅ Shared handler for modals that close on cross icon or outside click
    function setupModalWithOutsideClose(modalId, closeBtnId, alertSelector = null) {
        $(`#${modalId}`).on('click', function (e) {
            const modalContent = $(this).find('> div'); // direct child container
            if (
                e.target.id === closeBtnId ||
                (!modalContent.is(e.target) && modalContent.has(e.target).length === 0)
            ) {
                closeModal(modalId, alertSelector);
            }
        });
    }

    // 🔁 Apply to login and change password modals
    setupModalWithOutsideClose('loginModal', 'closeModal', '.password.alert');
    setupModalWithOutsideClose('changePasswordModal', 'closeChangeModal', '.change-error, .change-success');


    // Close Reset Password Modal only on cross icon
    $('#closeResetModal').on('click', function () {
        $('#resetPasswordModal').removeClass('visible opacity-100').addClass('invisible opacity-0');
    });


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

    function structuredData(rawText) {
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








    $('#login-form').on('submit', function (e) {
        e.preventDefault();

        $('.password.alert').removeClass('shake')

        const username = $('#username').val();
        const password = $('#password').val();

        var form = new FormData();
        form.append("username", username);
        form.append("password", password);

        var settings = {
            "url": BASE_URL + "/api/login/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            // $('.login-success').removeClass('hidden').addClass('active').show();
            // $('.password.alert').addClass('hidden').removeClass('active').hide();

            let data = JSON.parse(response);
            localStorage.setItem('accessToken', data.access);

            refreshLogstate();

            // setTimeout(function () {
            //     $('#loginModal').removeClass('visible opacity-100').addClass('invisible opacity-0');
            // }, 2000);
            $('#loginModal').removeClass('visible opacity-100').addClass('invisible opacity-0');

            title = "Welcome to Carrie Search!"
            message = "You're now logged in. Start exploring the smartest way to search."
            showToast({ title, message, type: "success" })

        }).fail(function (e) {
            $('.password.alert').removeClass('hidden').addClass('active shake').show();
            $('.login-success').addClass('hidden').removeClass('active').hide();
            refreshLogstate();
        });
    });

    function loadPageContent(content) {
        const fullContent = `<div class="w-full flex flex-col items-center justify-start pt-8">${pageLogoHtml}${content}</div>`;
        $('#center-content-wrapper').html(fullContent).removeClass('justify-center flex-1').addClass('justify-start');
        $('#search-results-container').hide();
        $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6 hidden');
        $('#search-form').hide();
        $('#signup-message').removeClass('bg-green-100 bg-red-100 text-green-700 text-red-700').addClass('hidden').text('');
    }

    function resetToInitialHomeState() {
        $('#center-content-wrapper').html(initialCenterContent).addClass('justify-center flex-1').removeClass('justify-start pt-8');
        $('#search-results-container').empty().hide();
        $('#main-logo').removeClass('text-4xl mb-6 hidden').addClass('text-8xl mb-10');
        $('#search-form').show();
        $('#ai_search').val('');
    }

    $('#about-us-link').on('click', function (e) {
        e.preventDefault();
        loadPageContent(aboutUsContent);
    });

    $('.how-carrie-works-link').on('click', function (e) {
        e.preventDefault();
        loadPageContent(howCarrieWorksContent);
    });

    $('#signup-link').on('click', function (e) {
        e.preventDefault();
        loadPageContent(signupContent);
    });

    $('a[href="#home"]').on('click', function (e) {
        e.preventDefault();
        resetToInitialHomeState();
    });

    $('.to-home').on('click', function (e) {
        e.preventDefault();
        resetToInitialHomeState();
    });

    function renderSearchResults(data) {
        let resultsHtml = `<div class="animate-fade-in text-left mb-8 p-6 bg-white rounded-lg border border-gray-200">
                <h2 class="text-2xl font-bold mb-4">Results for: "${data.query}"</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">`;

        data.links.forEach(link => {
            resultsHtml += `
                    <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                        <h3 class="font-semibold text-teal-700">${link.title}</h3>
                        <a href="${link.url}" target="_blank" class="text-sm text-gray-500 truncate block">${link.url}</a>
                    </div>`;
        });

        resultsHtml += `</div>`;

        if (data.images && data.images.length > 0) {
            resultsHtml += `<h3 class="text-xl font-semibold mt-6 mb-4">Related Images:</h3>
                                <div class="image-carousel-wrapper">
                                    <button class="carousel-arrow left" id="image-carousel-left-arrow"><i class="fas fa-chevron-left"></i></button>
                                    <div class="image-carousel-container" id="image-carousel-container">`;
            data.images.forEach(image => {
                resultsHtml += `
                        <a href="${image.url}" target="_blank" class="image-card">
                            <img src="${image.src}" alt="Search result image">
                        </a>`;
            });
            resultsHtml += `    </div>
                                    <button class="carousel-arrow right" id="image-carousel-right-arrow"><i class="fas fa-chevron-right"></i></button>
                                </div>`;
        }

        resultsHtml += `<div class="bg-white p-6 rounded-lg border border-gray-200 mb-4"><p>${data.content}</p></div></div>`;

        $('#search-results-container').prepend(resultsHtml).show();
        $('#search-results-container').scrollTop(0);

        $('#image-carousel-left-arrow').on('click', function () {
            $('#image-carousel-container').animate({
                scrollLeft: $('#image-carousel-container').scrollLeft() - 750 // Scroll left by 750px
            }, 400);
        });

        $('#image-carousel-right-arrow').on('click', function () {
            $('#image-carousel-container').animate({
                scrollLeft: $('#image-carousel-container').scrollLeft() + 750 // Scroll right by 750px
            }, 400);
        });

    }

    function searchAjax(form, token) {
        console.log("Performing search with prompt:", form.get("prompt"));
        var links = [];
        var content = null;
        var images = [];

        const loadingHtml = `<div class="animate-fade-in text-center text-gray-500 mb-8 p-6 bg-white rounded-lg border border-gray-200" id="loading-message">Searching...</div>`;
        $('#search-results-container').prepend(loadingHtml).show();

        var settings = {
            "url": BASE_URL + "/api/search/",
            "method": "POST",
            "timeout": 0,
            "headers": { "Authorization": "Bearer " + token },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (responseData) {
            $('#loading-message').remove();
            var response = JSON.parse(responseData);

            if (response && response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
                var searchContent = response.choices[0].message.content;
                for (let index = 0; index < response.search_results.length; index++) {
                    const element = response.search_results[index];
                    links.push({ title: element.title, url: element.url });
                }


                if (response.images) {
                    for (let index = 0; index < response.images.length; index++) {
                        const img = response.images[index];
                        images.push({ src: img.image_url, url: img.origin_url });
                    }
                }

                content = structuredData(searchContent);

                const mockResponse = {
                    query: form.get("prompt"),
                    links: links,
                    images: images,
                    content: content
                };
                renderSearchResults(mockResponse);

            } else {
                $('#loading-message').remove();
                $('#search-results-container').prepend('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Search failed, please try again.</p>');
            }

        }).fail(function () {
            $('#loading-message').remove();
            $('#search-results-container').prepend('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Search failed, please try again.</p>');
        });
    }

    $('#search-form').on('submit', function (e) {
        e.preventDefault();

        if ($('#main-logo').hasClass('text-8xl')) {
            $('#center-content-wrapper').removeClass('justify-center flex-1').addClass('justify-start pt-8');
            $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6');
        }

        const fileSelected = $('#file-upload')[0].files[0];
        const token = localStorage.getItem('accessToken');
        const searchQueryData = $('#ai_search').val();

        if (!token) {
            $('#search-results-container').prepend('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Please log in to perform a search.</p>').show();
            return;
        }

        if (fileSelected) {

            var formData = new FormData();
            formData.append("image", fileSelected, fileSelected.name);

            var settings = {
                "url": BASE_URL + "/api/upload-image/",
                "method": "POST",
                "timeout": 0,
                "headers": { "Authorization": "Bearer " + token },
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": formData
            };

            $.ajax(settings).done(function (response) {
                var responseData = JSON.parse(response);
                var form = new FormData();
                form.append("prompt", searchQueryData);
                form.append("image_url", responseData.image_url);
                form.append("modal", selectedModel);
                form.append("search_mode", selectedSource);
                form.append("pro", isProModeEnabled);
                form.append("deep_research", isDeepResearchEnabled);
                form.append("labs", isLabsEnabled);
                form.append("return_images", true);

                searchAjax(form, token);
                $('#file-upload').val('');
            }).fail(function () {
                $('#search-results-container').prepend('<p class="text-center text-red-500 mb-8 p-6 bg-white rounded-lg border border-gray-200">Image upload failed. Please try again.</p>');
            });

        } else {

            var form = new FormData();
            form.append("prompt", searchQueryData);
            form.append("modal", selectedModel);
            form.append("search_mode", selectedSource);
            form.append("pro", isProModeEnabled);
            form.append("deep_research", isDeepResearchEnabled);
            form.append("labs", isLabsEnabled);
            form.append("return_images", true);

            searchAjax(form, token);
        }
    });

    $('#library-link').on('click', function (e) {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        if (!token) {
            loadPageContent('<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Please log in to view your Library.</h2></div>');
            return;
        }

        loadPageContent('<div class="max-w-4xl mx-auto text-center py-10" id="library-loading"><h2 class="text-2xl font-bold mb-4">Loading Library...</h2></div>');

        var form = new FormData();
        var settings = {
            "url": BASE_URL + "/api/library/",
            "method": "GET",
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
            $('#library-loading').remove();
            renderLibraryContent(JSON.parse(response));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#library-loading').remove();
            let errorMessage = '<div class="max-w-4xl mx-auto text-center py-10"><h2 class="text-2xl font-bold mb-4 text-red-500">Failed to load Library. Please try again later.</h2>';
            if (jqXHR.status === 401) {
                errorMessage += '<p class="text-gray-600">Your session might have expired. Please log in again.</p>';
            }
            errorMessage += '</div>';
            loadPageContent(errorMessage);
        });
    });

    function renderLibraryContent(data) {
        let libraryHtml = `<div class="max-w-4xl mx-auto text-left py-10 animate-fade-in">
                <h1 class="text-4xl font-bold mb-8">Your Search History</h1>`;

        if (data && data.length > 0) {
            libraryHtml += `<div class="space-y-4">`;

            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            data.forEach(item => {
                const searchDate = new Date(item.created_at).toLocaleString();
                libraryHtml += `
                        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 class="font-semibold text-lg text-teal-700">${item.prompt}</h3>
                            <p class="text-sm text-gray-500 mb-2">Searched on: ${searchDate}</p>
                            <div class="prose max-w-none text-sm">${structuredData(item.response.choices[0].message.content || 'No detailed content available.')}</div>
                        </div>`;
            });
            libraryHtml += `</div>`;
        } else {
            libraryHtml += `<p class="text-lg text-gray-700">No search history found.</p>`;
        }

        libraryHtml += `</div>`;
        loadPageContent(libraryHtml);
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


    user_friendly_msg_mapping = {
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

    $('#pricing-link').on('click', function (e) {
        e.preventDefault();
        loadPageContent(pricingContentTemplate);
        checkSubscriptionStatus();
    });

    function fetchSubscriptionStatus() {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                reject({ message: 'No token found', status: 'unauthenticated' });
                return;
            }

            $.ajax({
                url: BASE_URL + "/api/subscriptions/get-pro-status",
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
            "url": BASE_URL + "/api/subscriptions/get-pro-status",
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
                            <p>You are already subscribed to Carrie Search. Enjoy unlimited access!</p>
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
            "url": BASE_URL + "/api/subscriptions/create-checkout-session/",
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

    const $modelSelectButton = $('#model-select-button');
    const $modelDropdown = $('#model-dropdown');

    const $proModeButton = $('#pro-mode-button');
    const $proModeDropdown = $('#pro-mode-dropdown');
    const $deepResearchButton = $('#deep-research-button');
    const $deepResearchDropdown = $('#deep-research-dropdown');
    const $labsButton = $('#labs-button');
    const $labsDropdown = $('#labs-dropdown');
    const $managePlan = $('#manage-plan');

    // Function to close all dropdowns
    function closeAllDropdowns() {
        $modelDropdown.addClass('hidden');
        $sourceDropdown.addClass('hidden');
        $proModeDropdown.addClass('hidden');
        $deepResearchDropdown.addClass('hidden');
        $labsDropdown.addClass('hidden');
    }

    $modelSelectButton.on('click', function (e) {
        e.stopPropagation();
        $modelDropdown.toggleClass('hidden');
    });

    $modelDropdown.on('click', '.model-option', function () {
        selectedModel = $(this).data('model-value');
        console.log("Selected Model:", selectedModel);
        $modelDropdown.addClass('hidden');

    });

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

        if (isClickOutside($modelDropdown, $modelSelectButton)) {
            $modelDropdown.addClass('hidden');
        }
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