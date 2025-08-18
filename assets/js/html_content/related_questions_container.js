const relatedQuestionsHtml = function (uniqueId) {
    return `
    <div class="mb-12">
        <div
            class="animate-in fade-in duration-100 ease-out border-borderMain/50 ring-borderMain/50 divide-borderMain/50 bg-transparent">
            <div class="border-borderMain/50 ring-borderMain/50 divide-borderMain/50 bg-transparent">
                <div
                    class="flex items-center justify-between border-borderMain/50 ring-borderMain/50 divide-borderMain/50 bg-base">
                    <div class="flex w-full items-center justify-between mb-sm">
                        <div class="">
                            <div color="super" class="space-x-sm flex items-center">
                                <div
                                    class="font-display text-lg font-medium text-foreground selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super">
                                    <div class="w-[24px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" color="currentColor" fill="currentColor"
                                            fill-rule="evenodd">
                                            <path
                                                d="M16.0799 4.39998H17.9999V6.31993H19.9201V8.23993H17.9999V10.16H16.0799V8.23993H14.1601V6.31993H16.0799V4.39998Z M3.60001 6.31993H12.24V8.23993H3.60001V6.31993Z M12.24 12.08H20.8799V14H12.2399L12.24 12.08Z M12.24 12.08H3.60001V10.16H12.24V12.08Z M12.2399 15.92H3.60001V14H12.2399V15.92Z M12.2399 15.92L20.8799 15.9199V17.8399H12.2399V15.92Z">
                                            </path>
                                        </svg></div>
                                </div>
                                <div
                                    class="font-display text-lg font-medium text-foreground selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super">
                                    Related</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="dynamic-related-questions-${uniqueId}">
                    <!-- DYNAMIC CONTENT GOES HERE -->
                </div>
            </div>
        </div>
    </div>
    `
}


const relatedQuestionHtml = function (relatedQuestion, relatedQuestionUniqueId) {
    $(document).on("click", `#individual-related-question-${relatedQuestionUniqueId}`, function () {
        renderSearchResult(relatedQuestion)
    });

    return `
    <div id="individual-related-question-${relatedQuestionUniqueId}" class="divide-y border-t border-borderMain/50 ring-borderMain/50 divide-borderMain/50 bg-transparent hover:text-teal-600">
        <div class="py-2 group flex cursor-pointer items-center justify-between">
            <div
                class="md:group-hover:!text-super overflow-hidden text-ellipsis transition-all duration-300 font-sans text-base text-foreground selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super">
                ${relatedQuestion}
            </div>
            <div
                class="ml-sm flex-none transition-all duration-300 font-sans text-base font-medium text-super selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.7333333333333334" stroke-linecap="round" stroke-linejoin="round"
                    class="tabler-icon tabler-icon-plus ">
                    <path d="M12 5l0 14"></path>
                    <path d="M5 12l14 0"></path>
                </svg>
            </div>
        </div>
    </div>
    `
}


// INJECTING CONTENT DYNAMICALLY
window.renderRelatedQuestionsContainer = function (relatedQuestions, uniqueId) {
    // PREPARE CONTENT HERE
    let dynamicContent = ""
    let relatedQuestionUniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness
    for (let relatedQuestion of relatedQuestions) {
        dynamicContent += relatedQuestionHtml(relatedQuestion, relatedQuestionUniqueId)
        relatedQuestionUniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness
    }

    // INJECT CONTENT HERE
    setTimeout(() => {
        $(`#dynamic-related-questions-${uniqueId}`).html(dynamicContent);
    }, 0);

    return relatedQuestionsHtml(uniqueId);
}
