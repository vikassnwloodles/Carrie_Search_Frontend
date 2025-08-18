window.renderSearchResponseContainer = function (content, uniqueId) {
    setTimeout(() => {
        attachEventHandlers(uniqueId)
    }, 0);

    return `
    <div id="response-text-${uniqueId}" class="bg-white p-6 rounded-lg border border-gray-200 mb-4 relative">
        <div
            class="absolute bottom-0 right-0 flex space-x-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
            <!-- Copy Icon -->
            <div class="relative group">
                <div id="copy-icon-${uniqueId}"
                    class="flex items-center justify-center p-2 bg-white border h-8 gap-1 rounded-md text-gray-600 text-xl hover:text-teal-600 transition-colors cursor-pointer">
                    <i class="far fa-copy"></i>
                </div>
                <!-- Tooltip -->
                <div id="result-copy-tooltip-${uniqueId}"
                    class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    Copy to clipboard
                </div>
            </div>
        </div>
        <div id="response-text-inner-${uniqueId}">${content}</div>
    </div>
    `
}


function attachEventHandlers(uniqueId) {
    $(`#copy-icon-${uniqueId}`).on('click', function () {
        // Clone container to avoid modifying actual UI
        const $containerClone = $(`#response-text-inner-${uniqueId}`).clone();

        // Remove citation badges/tooltips
        $containerClone.find('[id^="citation-badge-"]').remove();
        $containerClone.find('[id^="citation-tooltip-"]').remove();

        // Convert lists: wrap each <li> in a newline with marker
        $containerClone.find('ul, ol').each(function () {
            const isOrdered = $(this).is('ol');
            $(this).find('li').each(function (i) {
                const marker = isOrdered ? `${i + 1}. ` : '- ';
                $(this).replaceWith(`${marker}${$(this).text().trim()}\n`);
            });
            $(this).replaceWith($(this).html());
        });

        // Convert paragraphs
        $containerClone.find('p').each(function () {
            $(this).replaceWith(`${$(this).text().trim()}\n`);
        });

        // Remove remaining HTML tags and normalize newlines
        let textHtml = $containerClone.html()
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/?[^>]+>/g, '')         // Remove any leftover tags
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n\n')                       // One empty line between paragraphs/items
            .trim();

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = textHtml;
        const textToCopy = tempDiv.textContent.trim();

        const $resultCopyTooltip = $(`#result-copy-tooltip-${uniqueId}`);

        navigator.clipboard.writeText(textToCopy).then(() => {
            $resultCopyTooltip.text('Copied!');
            setTimeout(() => $resultCopyTooltip.text('Copy to clipboard'), 1500);
        }).catch(() => {
            $resultCopyTooltip.text('Failed to copy');
            setTimeout(() => $resultCopyTooltip.text('Copy to clipboard'), 1500);
        });
    });
}
