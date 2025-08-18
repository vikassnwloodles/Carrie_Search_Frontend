// Function to generate the citation badge HTML
window.getCitationHtml = function (citationsMetadata) {
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness

    // Attach hover handlers after rendering
    setTimeout(() => {
        attachEventHandlers(uniqueId);
    }, 0);

    if (!citationsMetadata || citationsMetadata.length === 0) return '';

    const firstCitation = citationsMetadata[0];
    const remainingCount = citationsMetadata.length - 1;
    const remainingText = remainingCount > 0 ? ` +${remainingCount}` : '';

    // Build tooltip items for all citations
    const sourceItemsHtml = citationsMetadata.map(cit => `
    <a href="${cit.site_url}" target="_blank" class="flex items-start gap-3 p-2 rounded hover:bg-gray-100">
        ${cit.icon
            ? `<img src="${cit.icon}" alt="favicon" class="w-4 h-4 flex-shrink-0 rounded-full">`
            : `<i class="fa-solid fa-globe w-4 h-4 text-gray-600 flex-shrink-0"></i>`
        }
        <div class="flex-1 truncate">
            <div class="text-sm font-sans truncate">${cit.title}</div>
            <div class="text-xs font-mono text-gray-500 truncate">${cit.domain_short}</div>
        </div>
    </a>
`).join('');


    return `
    <span id="citation-badge-${uniqueId}" class="relative inline-block">
        <!-- Citation badge -->
        <a 
        rel="nofollow noopener" 
        class="inline-flex items-center ml-1 no-underline hover:no-underline"
        target="_blank"
        href="${firstCitation.site_url}"
        aria-label="${firstCitation.title}">
            <span class="text-xs rounded-full px-2 py-[0.1875rem] font-mono tabular-nums 
                        text-gray-600 bg-gray-100 border border-gray-300 
                        hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200">
                ${firstCitation.domain_short}${remainingText}
            </span>
        </a>
    </span>

    <!-- Tooltip -->
    <div id="citation-tooltip-${uniqueId}" class="absolute mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg
                opacity-0 invisible transition-opacity duration-200 z-10 pointer-events-auto">
        <div class="px-3 py-2 space-y-2 max-h-60 overflow-y-auto">
            ${sourceItemsHtml}
        </div>
    </div>
    `;
}



function attachEventHandlers(uniqueId) {
    let hideTimeout; // store timeout ID
    const $badge = $(`#citation-badge-${uniqueId}`);
    const $anchor = $badge.find('a');
    const citationBadgeWidth = $anchor.outerWidth()
    const citationTooltipWidth = 320

    const $tooltip = $(`#citation-tooltip-${uniqueId}`);


    // Show tooltip when hovering badge OR tooltip itself
    $badge.add($tooltip).hover(
        function () {
            const badgeOffset = $badge.offset().left;       // left relative to document
            const $badgeAncestor = $badge.closest('[id^="response-text-"]:not([id^="response-text-inner-"])')
            const ancestorOffset = $badgeAncestor.offset().left; // left relative to document
            const badgeRelativeLeft = badgeOffset - ancestorOffset;
            let requiredShiftFromLeft = badgeRelativeLeft - ((citationTooltipWidth / 2) - (citationBadgeWidth / 2))

            // prevent tooltip from going past the left edge
            requiredShiftFromLeft = requiredShiftFromLeft >= 0 ? requiredShiftFromLeft : 0;

            // prevent tooltip from going past the right edge
            const badgeParentContainerWidth = $badgeAncestor.outerWidth(); // parent container of the badge
            if ((requiredShiftFromLeft + citationTooltipWidth) > badgeParentContainerWidth) {
                requiredShiftFromLeft = (badgeParentContainerWidth - citationTooltipWidth)
            }

            $tooltip.css({
                // left: `${badgeOffset.left-tooltipOffset.left}px`,
                left: `${requiredShiftFromLeft}px`
            })

            clearTimeout(hideTimeout);
            $tooltip.removeClass("opacity-0 invisible").addClass("opacity-100 visible");
        },
        function () {
            hideTimeout = setTimeout(() => {
                $tooltip.removeClass("opacity-100 visible").addClass("opacity-0 invisible");
            }, 300);
        }
    );
}
