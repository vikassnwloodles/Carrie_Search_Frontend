window.signupContent = `
<div class="max-w-3xl mx-auto py-10 animate-fade-in px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">Pete Client Sign Up Form</h1>
    <p class="text-lg text-gray-700 leading-relaxed mb-4 text-center">
        Why settle for Google when you can get more, give more, and help change lives?
        Pete isn’t just about making your life easier—it’s about creating opportunity, stability, and hope for unserved and underserved urban and rural children and families nationwide.
    </p>
    <p class="text-md text-gray-600 leading-relaxed mb-6 text-center">
        Please complete the following form to register for Pete. All fields marked with an asterisk (*) are required.
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
            By submitting this form, you are registering for Pete and supporting Essential Families’ Essential Mobility Program, which enables economic mobility for unserved and underserved urban and rural communities across the country.
        </p>
        <p class="text-sm text-gray-600 leading-relaxed mb-6 text-center">
            Your information will remain confidential and is used only to deliver the services you request and to maintain high-quality support for all clients.
        </p>

        <div class="flex items-center justify-center">
            <button class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition-colors" type="submit">
                Register for Pete
            </button>
        </div>
    </form>
    <!-- Messages for Signup Form -->
    <div id="signup-message" class="hidden text-center mt-4 p-3 rounded-lg"></div>
</div>
`