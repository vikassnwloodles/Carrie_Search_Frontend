window.renderSearchQueryContainer = function (query, uniqueId, searchResultId) {
    setTimeout(() => {
        attachEventHandlers(uniqueId, searchResultId)
    }, 0);
    const withLineBreaks = query.replace(/\n/g, "<br>");

    return `
    <!-- Main container -->
    <div id="text-container-${uniqueId}"
        onclick="document.getElementById('query-text-${uniqueId}').focus()"
        class="w-full border border-gray-200 bg-white rounded-xl pl-4 pt-4 pb-8 pr-2 mb-8 group relative">

        <!-- Text content -->
        <div class="text-container-${uniqueId} relative overflow-hidden transition-all duration-300 text-black leading-relaxed"
            style="max-height: 120px;">
            <p id="long-text" class="text-base">
                <!-- <strong id="query-text-${uniqueId}" onfocus="handleQueryContainerFocus(this)" onblur="handleQueryContainerBlur(this)" class="block font-medium focus:outline-none" contenteditable="false">${withLineBreaks}</strong> -->
                <strong id="query-text-${uniqueId}" class="block font-medium focus:outline-none" contenteditable="false">
                    ${withLineBreaks}
                </strong>
            </p>
        </div>

        <!-- Icon wrapper -->
        <div
            class="absolute bottom-0 right-0 flex space-x-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">

            <!-- Copy Icon -->
            <div class="relative group/icon">
                <div id="query-copy-icon-${uniqueId}"
                    class="flex items-center justify-center p-2 bg-white border h-8 w-8 rounded-md text-gray-600 text-xl hover:text-teal-600 transition-colors cursor-pointer">
                    <i class="far fa-copy"></i>
                </div>
                <div id="query-copy-tooltip-${uniqueId}"
                    class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Copy to clipboard
                </div>
            </div>

            <!-- Edit Icon -->
            <div class="relative group/edit">
                <div id="query-edit-icon-${uniqueId}"
                    class="flex items-center justify-center p-2 bg-white border h-8 w-8 rounded-md text-gray-600 text-xl hover:text-blue-600 transition-colors cursor-pointer">
                    <i class="far fa-edit"></i>
                </div>
                <div
                    class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/edit:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Edit text
                </div>
            </div>


            <!-- Confirm (Tick) Icon -->
            <div id="confirm-edit-${uniqueId}" class="relative group/icon hidden">
                <div
                    class="flex items-center justify-center p-2 bg-white border h-8 w-8 rounded-md text-green-700 text-xl transition-colors cursor-pointer">
                    <i class="fas fa-check"></i>
                </div>
                <div id="query-copy-tooltip-${uniqueId}"
                    class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Confirm
                </div>
            </div>

            <!-- Cancel (Cross) Icon -->
            <div id="cancel-edit-${uniqueId}" class="relative group/edit hidden">
                <div
                    class="flex items-center justify-center p-2 bg-white border h-8 w-8 rounded-md text-red-700 text-xl transition-colors cursor-pointer">
                    <i class="fas fa-times"></i>
                </div>
                <div
                    class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/edit:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Cancel
                </div>
            </div>


        </div>

        <!-- Toggle button -->
        <button id="toggle-btn"
            class="absolute bottom-0 toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 hover:underline focus:outline-none">
            <!-- class="toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 mt-3 hover:underline focus:outline-none"> -->
            <span class="toggle-text-${uniqueId}" id="toggle-text">Show more</span>
            <svg id="toggle-icon" xmlns="http://www.w3.org/2000/svg" class="toggle-icon-${uniqueId} w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path class="toggle-path-${uniqueId}" stroke-linecap="round" stroke-linejoin="round"
                    d="M19 9l-7 7-7-7" />
            </svg>
        </button>

    </div>
    `
}


function attachEventHandlers(uniqueId, searchResultId) {
    const $edit = $(`#query-edit-icon-${uniqueId}`);
    const $confirm = $(`#confirm-edit-${uniqueId}`);
    const $cancel = $(`#cancel-edit-${uniqueId}`);
    const $text = $(`#query-text-${uniqueId}`);
    const $copy = $(`#query-copy-icon-${uniqueId}`);
    const originalText = $text.html(); // Preserve original

    function placeCaretAtEnd(el) {
        if (!el) return;
        // Create range and move caret to end
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // move to end
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // DETERMINE AND RENDER SHOW MORE/LESS BUTTON DYNAMICALLY
    const textContainer = $(`.text-container-${uniqueId}`);
    const toggleBtn = $(`.toggle-btn-${uniqueId}`);
    let expanded = false;
    // Temporarily expand to check actual height
    textContainer.css("max-height", "none");
    const actualHeight = textContainer[0].scrollHeight;
    textContainer.css("max-height", "120px");
    if (actualHeight <= 120) {
        toggleBtn.hide(); // Hide toggle if content doesn't overflow
    } else {
        toggleBtn.show(); // Ensure toggle is visible if needed
    }

    // HANDLE EXPAND/COLLAPSE FOR SEARCH QUERY CONTAINER
    toggleBtn.add($(`#query-edit-icon-${uniqueId}`)).add($(`#cancel-edit-${uniqueId}`)).on('click', function (e) {
        if (expanded === false) {
            if (!$(e.currentTarget).is(`#cancel-edit-${uniqueId}`)) {
                expanded = true
                if ($(e.currentTarget).is(`#query-edit-icon-${uniqueId}`)) {
                    let distanceFromTop = $(`.text-container-${uniqueId}`).offset().top;
                    let viewportHeight = $(window).height();
                    let remainingViewportHeight = viewportHeight - distanceFromTop

                    let viewportVerticalOffsetForEditQuery = $('#search-form').outerHeight(true) + 46
                    if (actualHeight > (remainingViewportHeight - viewportVerticalOffsetForEditQuery)) {
                        $('#dynamic-content-container')[0].scrollTop += (actualHeight - (remainingViewportHeight - viewportVerticalOffsetForEditQuery));
                    }
                }
            }
        }
        else {
            if (!$(e.currentTarget).is(`#query-edit-icon-${uniqueId}`)) {
                expanded = false
                if (($(`#${searchResultId}`).offset().top - 88) < 0) {
                    $(`#${searchResultId}`)[0].scrollIntoView(true);
                }
            }
        }
        textContainer.css("max-height", expanded ? "none" : "120px");
        const iconPath = expanded
            ? "M19 15l-7-7-7 7"
            : "M19 9l-7 7-7-7";
        $(`.toggle-path-${uniqueId}`).attr("d", iconPath);
        $(`.toggle-text-${uniqueId}`).text(expanded ? "Show less" : "Show more");
    });

    // HANDLE QUERY CONTAINER FOCUS
    $text.on('focus', function (el) {
        // Find closest ancestor div with id starting with "text-container-"
        $(el.target).closest('div[id^="text-container-"]').addClass('ring-2 ring-blue-500');
    });

    // HANDLE QUERY CONTAINER BLUR
    $text.on('blur', function (el) {
        $(el.target).closest('div[id^="text-container-"]').removeClass('ring-2 ring-blue-500');
    });

    // HANDLE ON QUERY PASTE
    $text.on('paste', function (e) {
        e.preventDefault();

        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        const html = text.replace(/\n/g, '<br>');
        document.execCommand('insertHTML', false, html);
        requestAnimationFrame(() => scrollToBottom(document.getElementById('query-text-' + uniqueId)));

        const textContainer = $('.text-container-' + uniqueId);

        let distanceFromTop = textContainer.offset().top;
        let viewportHeight = $(window).height();
        let remainingViewportHeight = viewportHeight - distanceFromTop;
        let viewportVerticalOffsetForEditQuery = $('#search-form').outerHeight(true) + 46;

        textContainer.css("max-height", "none");
        const actualHeight = textContainer[0].scrollHeight;

        if (actualHeight > (remainingViewportHeight - viewportVerticalOffsetForEditQuery)) {
            $('#dynamic-content-container')[0].scrollTop +=
                (actualHeight - (remainingViewportHeight - viewportVerticalOffsetForEditQuery));
        }
    });

    // HANDLE ON QUERY DROP
    $text.on('drop', function (e) {
        e.preventDefault();

        const text = (e.originalEvent || e).dataTransfer.getData('text/plain');
        const html = text.replace(/\n/g, '<br>');
        document.execCommand('insertHTML', false, html);
        requestAnimationFrame(() => scrollToBottom(document.getElementById('query-text-' + uniqueId)));

        const textContainer = $('.text-container-' + uniqueId);

        let distanceFromTop = textContainer.offset().top;
        let viewportHeight = $(window).height();
        let remainingViewportHeight = viewportHeight - distanceFromTop;
        let viewportVerticalOffsetForEditQuery = $('#search-form').outerHeight(true) + 46;

        textContainer.css("max-height", "none");
        const actualHeight = textContainer[0].scrollHeight;

        if (actualHeight > (remainingViewportHeight - viewportVerticalOffsetForEditQuery)) {
            $('#dynamic-content-container')[0].scrollTop +=
                (actualHeight - (remainingViewportHeight - viewportVerticalOffsetForEditQuery));
        }
    });

    // HANDLE COPY ICON CLICK
    $(document).on("click", `#query-copy-icon-${uniqueId}`, function () {
        const $queryCopyTooltip = $(`#query-copy-tooltip-${uniqueId}`);
        const textHtml = $text.html()
            .replace(/<([a-z]+)[^>]*>(?:\s|&nbsp;|\u200B)*<\/\1>/gi, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<\/ul>/gi, '\n')
            .replace(/<\/ol>/gi, '\n')
            .replace(/<hr\b[^>]*\/?>/gi, '\n');

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = textHtml;
        const textToCopy = tempDiv.textContent.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            $queryCopyTooltip.text('Copied!');
            setTimeout(() => $queryCopyTooltip.text('Copy to clipboard'), 1500);
        }).catch(() => {
            $queryCopyTooltip.text('Failed to copy');
            setTimeout(() => $queryCopyTooltip.text('Copy to clipboard'), 1500);
        });
    });

    // HANDLE EDIT ICON CLICK
    $(document).on("click", `#query-edit-icon-${uniqueId}`, function (e) {
        e.preventDefault();
        e.stopPropagation();

        $(`.text-container-${uniqueId}`).css('max-height', 'none');

        $edit.hide();
        $copy.hide();
        $confirm.show();
        $cancel.show();

        // Make editable first
        $text.attr('contenteditable', true);

        // Apply the same highlight ring behavior here
        // handleQueryContainerFocus($text_${uniqueId}[0]);

        // Focus without scroll jump
        try {
            $text[0].focus({ preventScroll: true });
        } catch {
            $text[0].focus();
        }

        // Move caret to end after focus settles
        requestAnimationFrame(() => {
            placeCaretAtEnd($text[0]);
        });
    });

    // HANDLE CONFIRM ICON CLICK
    $(document).on("click", `#confirm-edit-${uniqueId}`, function (event) {
        const el = event.currentTarget;

        $text.attr('contenteditable', false);
        $confirm.hide();
        $cancel.hide();
        $edit.show();

        const textHtml = $text.html()
            .replace(/<([a-z]+)[^>]*>(?:\s|&nbsp;|\u200B)*<\/\1>/gi, '')
            .replace(/<br[^>]*>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<\/ul>/gi, '\n')
            .replace(/<\/ol>/gi, '\n')
            .replace(/<hr\b[^>]*\/?>/gi, '\n');

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = textHtml;
        const textToSend = tempDiv.textContent.trim();

        // const resultDiv = el.closest('div[id^="individual-search-result-"]');
        // if (resultDiv) {
        //     // const token = localStorage.getItem('accessToken');
        //     // var form = new FormData();
        //     // form.append('prompt', textToSend);
        //     // form.append('return_images', true);
        //     // searchAjax(form, token, resultDiv.id);
        //     renderSearchResult(textToSend, resultDiv.id)
        // }
        renderSearchResult(textToSend, searchResultId)
    });

    // HANDLE CANCEL ICON CLICK
    $(document).on("click", `#cancel-edit-${uniqueId}`, function () {
        $text.html(originalText);
        $text.attr('contenteditable', false);
        $confirm.hide();
        $cancel.hide();
        $edit.show();
        $copy.show();
    });
}