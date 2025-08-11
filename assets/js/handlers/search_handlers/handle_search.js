import "../../html_content/search_toast_box.js"


window.bindSearchHandler = function () {

    let selectedModel = "sonar";
    let isProModeEnabled = false;
    let isDeepResearchEnabled = false;
    let isLabsEnabled = false;
    let selectedSource = "web";


    $('#pro-mode-button').click(function () {
        $('#model-select-container').removeClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#deep-research-button').removeClass('text-blue-500').addClass('text-gray-500')
    });

    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });


    function renderSearchResults(data, loadingHtmlContainerId = null) {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000); // ensure uniqueness
        const withLineBreaks = data.query.replace(/\n/g, "<br>");
        let resultsHtml = `<div id="individual-search-result-${uniqueId}" class="animate-fade-in text-left mb-8 p-6 bg-white rounded-lg border border-gray-200">
                <!-- <h2 class="text-2xl font-bold mb-4">Results for: "${data.query}"</h2> -->
<!-- Main container -->
<div id="text-container-${uniqueId}" class="w-full border border-gray-200 bg-white rounded-xl pl-4 pt-4 pb-8 pr-2 mb-8 group relative">

  <!-- Text content -->
  <div
    class="text-container-${uniqueId} relative overflow-hidden transition-all duration-300 text-black leading-relaxed"
    style="max-height: 120px;">
    <p id="long-text" class="text-base">
      <!-- <strong id="query-text-${uniqueId}" onfocus="handleQueryContainerFocus(this)" onblur="handleQueryContainerBlur(this)" class="block font-medium focus:outline-none" contenteditable="false">${withLineBreaks}</strong> -->
      <strong 
        id="query-text-${uniqueId}" 
        onfocus="handleQueryContainerFocus(this)" 
        onblur="handleQueryContainerBlur(this)" 
        onpaste="handleOnQueryPaste(event, '${uniqueId}')"
        ondrop="handleOnQueryDrop(event, '${uniqueId}')"
        class="block font-medium focus:outline-none" 
        contenteditable="false"
      >
        ${withLineBreaks}
      </strong>
      <script>

      function handleOnQueryPaste(e, localUniqueId) {
    e.preventDefault();

    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    const html = text.replace(/\\n/g, '<br>');
    document.execCommand('insertHTML', false, html);
    requestAnimationFrame(() => scrollToBottom(document.getElementById('query-text-'+localUniqueId)));

    const textContainer = $('.text-container-'+localUniqueId);
    console.log('.text-container-'+localUniqueId)
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
}

      function handleOnQueryDrop(e, localUniqueId) {
    e.preventDefault();

    const text = (e.originalEvent || e).dataTransfer.getData('text/plain');
    const html = text.replace(/\\n/g, '<br>');
    document.execCommand('insertHTML', false, html);
    requestAnimationFrame(() => scrollToBottom(document.getElementById('query-text-'+localUniqueId)));

    const textContainer = $('.text-container-'+localUniqueId);
    console.log('.text-container-'+localUniqueId)
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
}


      
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
            //function handleQueryContainerFocus(el) {
            //console.log(el)
            //    $('#text-container-${uniqueId}').addClass('ring-2 ring-blue-500');
            //}
            //function handleQueryContainerBlur(el) {
            //    $('#text-container-${uniqueId}').removeClass('ring-2', 'ring-blue-500');
            //}

            function handleQueryContainerFocus(el) {
    // Find closest ancestor div with id starting with "text-container-"
    $(el).closest('div[id^="text-container-"]').addClass('ring-2 ring-blue-500');
}

function handleQueryContainerBlur(el) {
    $(el).closest('div[id^="text-container-"]').removeClass('ring-2 ring-blue-500');
}
      </script>
      </p>
  </div>

  <!-- Icon wrapper -->
  <div class="absolute bottom-0 right-0 flex space-x-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">

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

  <!-- JS for Copy and Edit Functionality -->
  <script>
    const $queryCopyTooltip_${uniqueId} = $('#query-copy-tooltip-${uniqueId}');
    const $text_${uniqueId} = $('#query-text-${uniqueId}');
    const $edit_${uniqueId} = $('#query-edit-icon-${uniqueId}');
    const $confirm_${uniqueId} = $('#confirm-edit-${uniqueId}');
    const $cancel_${uniqueId} = $('#cancel-edit-${uniqueId}');
    const $copy_${uniqueId} = $('#query-copy-icon-${uniqueId}');
    const originalText_${uniqueId} = $text_${uniqueId}.html(); // Preserve original

    $copy_${uniqueId}.on('click', function () {
      const textHtml = $text_${uniqueId}.html()
        .replace(/<([a-z]+)[^>]*>(?:\\s|&nbsp;|\\u200B)*<\\/\\1>/gi, '')
        .replace(/<br\\s*\\/?>/gi, '\\n')
        .replace(/<\\/p>/gi, '\\n\\n')
        .replace(/<\\/li>/gi, '\\n')
        .replace(/<\\/ul>/gi, '\\n')
        .replace(/<\\/ol>/gi, '\\n')
        .replace(/<hr\\b[^>]*\\/?>/gi, '\\n');

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = textHtml;
      const textToCopy = tempDiv.textContent.trim();

      navigator.clipboard.writeText(textToCopy).then(() => {
        $queryCopyTooltip_${uniqueId}.text('Copied!');
        setTimeout(() => $queryCopyTooltip_${uniqueId}.text('Copy to clipboard'), 1500);
      }).catch(() => {
        $queryCopyTooltip_${uniqueId}.text('Failed to copy');
        setTimeout(() => $queryCopyTooltip_${uniqueId}.text('Copy to clipboard'), 1500);
      });
    });

$edit_${uniqueId}.on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  expanded = true;
  $('.text-container-${uniqueId}').css('max-height', 'none');

  $edit_${uniqueId}.hide();
  $copy_${uniqueId}.hide();
  $confirm_${uniqueId}.show();
  $cancel_${uniqueId}.show();

  // Make editable first
  $text_${uniqueId}.attr('contenteditable', true);

  // Apply the same highlight ring behavior here
  // handleQueryContainerFocus($text_${uniqueId}[0]);

  // Focus without scroll jump
  try {
    $text_${uniqueId}[0].focus({ preventScroll: true });
  } catch {
    $text_${uniqueId}[0].focus();
  }

  // Move caret to end after focus settles
  requestAnimationFrame(() => {
    placeCaretAtEnd($text_${uniqueId}[0]);
  });
});


    $confirm_${uniqueId}.on('click', function (event) {
    const el = event.currentTarget;
      console.log(el)
      $text_${uniqueId}.attr('contenteditable', false);
      $confirm_${uniqueId}.hide();
      $cancel_${uniqueId}.hide();
      $edit_${uniqueId}.show();

      const textHtml = $text_${uniqueId}.html()
        .replace(/<([a-z]+)[^>]*>(?:\\s|&nbsp;|\\u200B)*<\\/\\1>/gi, '')
        // .replace(/<br\\s*\\/?>/gi, '\\n')
        .replace(/<br[^>]*>/gi, '\\n')
        .replace(/<\\/p>/gi, '\\n\\n')
        .replace(/<\\/li>/gi, '\\n')
        .replace(/<\\/ul>/gi, '\\n')
        .replace(/<\\/ol>/gi, '\\n')
        .replace(/<hr\\b[^>]*\\/?>/gi, '\\n');

      console.log(textHtml)

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = textHtml;
      const textToSend = tempDiv.textContent.trim();
      
    const resultDiv = el.closest('div[id^="individual-search-result-"]');
    if (resultDiv) {
        console.log('Found parent ID:', resultDiv.id);

        const token = localStorage.getItem('accessToken');
        var form = new FormData();
        form.append('prompt', textToSend);
        form.append('return_images', true);
        searchAjax(form, token, resultDiv.id);

    } else {
        console.log('No matching parent found.');
    }

    });

    $cancel_${uniqueId}.on('click', function () {
      $text_${uniqueId}.html(originalText_${uniqueId});
      $text_${uniqueId}.attr('contenteditable', false);
      $confirm_${uniqueId}.hide();
      $cancel_${uniqueId}.hide();
      $edit_${uniqueId}.show();
      $copy_${uniqueId}.show();
    });
  </script>

                      <!-- Toggle button -->
                    <button id="toggle-btn"
                        class="absolute bottom-0 toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 hover:underline focus:outline-none">
                        <!-- class="toggle-btn-${uniqueId} text-teal-600 flex items-center gap-1 mt-3 hover:underline focus:outline-none"> -->
                        <span class="toggle-text-${uniqueId}" id="toggle-text">Show more</span>
                        <svg id="toggle-icon" xmlns="http://www.w3.org/2000/svg" class="toggle-icon-${uniqueId} w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path class="toggle-path-${uniqueId}" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

</div>

                    <script>
                    (function () {
                        const textContainer = $('.text-container-${uniqueId}');
                        const toggleBtn = $('.toggle-btn-${uniqueId}');
                        let expanded = false;

                        // Temporarily expand to check actual height
                        textContainer.css("max-height", "none");
                        const actualHeight = textContainer[0].scrollHeight;
                        console.log(actualHeight)
                        textContainer.css("max-height", "120px");

                        if (actualHeight <= 120) {
                        toggleBtn.hide(); // Hide toggle if content doesn't overflow
                        } else {
                        toggleBtn.show(); // Ensure toggle is visible if needed
                        }

                        toggleBtn.add($('#query-edit-icon-${uniqueId}')).add($('#cancel-edit-${uniqueId}')).on('click', function (e) {

                        if (expanded === false){
                            if (!$(e.currentTarget).is('#cancel-edit-${uniqueId}')) {
                                expanded = true
                                if($(e.currentTarget).is('#query-edit-icon-${uniqueId}')){
                                    let distanceFromTop = $('.text-container-${uniqueId}').offset().top;
                                    let viewportHeight = $(window).height();
                                    let remainingViewportHeight = viewportHeight - distanceFromTop

                                    let viewportVerticalOffsetForEditQuery = $('#search-form').outerHeight(true) + 46
                                    if (actualHeight > (remainingViewportHeight-viewportVerticalOffsetForEditQuery)){
                                        // alert("some portion of query box is out of viewport")
                                        $('#dynamic-content-container')[0].scrollTop += (actualHeight - (remainingViewportHeight-viewportVerticalOffsetForEditQuery));
                                    }
                                }
                            }
                        }
                        else{
                            if (!$(e.currentTarget).is('#query-edit-icon-${uniqueId}')) {
                                expanded = false
                                if(($('#individual-search-result-${uniqueId}').offset().top - 88) < 0){
                                    $('#individual-search-result-${uniqueId}')[0].scrollIntoView(true);
                                }
                            }
                        }

                        // textContainer.css("max-height", expanded ? "1000px" : "120px");
                        textContainer.css("max-height", expanded ? "none" : "120px");
                        const iconPath = expanded
                            ? "M19 15l-7-7-7 7"
                            : "M19 9l-7 7-7-7";
                        $('.toggle-path-${uniqueId}').attr("d", iconPath);
                        $('.toggle-text-${uniqueId}').text(expanded ? "Show less" : "Show more");
                        });
                    })();
                    </script>

                <!-- </div> -->
                <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> -->
                `;

        // data.links.forEach(link => {
        //     resultsHtml += `
        //             <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
        //                 <h3 class="font-semibold text-teal-700">${link.title}</h3>
        //                 <a href="${link.url}" target="_blank" class="text-sm text-gray-500 truncate block">${link.url}</a>
        //             </div>`;
        // });

        // resultsHtml += `</div>`;
        if (data.links && data.links.length > 0) {
            resultsHtml += `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">`;

            data.links.forEach(link => {
                resultsHtml += `
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 class="font-semibold text-teal-700">${link.title}</h3>
                <a href="${link.url}" target="_blank" class="text-sm text-gray-500 truncate block">${link.url}</a>
            </div>`;
            });

            resultsHtml += `</div>`;
        }

        if (data.images && data.images.length > 0) {
            resultsHtml += `<h3 class="text-xl font-semibold mt-6 mb-4">Related Images:</h3>
                                <div class="image-carousel-wrapper">
                                    <button class="carousel-arrow left z-0" id="image-carousel-left-arrow"><i class="fas fa-chevron-left"></i></button>
                                    <div class="image-carousel-container" id="image-carousel-container">`;
            data.images.forEach(image => {
                resultsHtml += `
                        <a href="${image.url}" target="_blank" class="image-card">
                            <img src="${image.src}" alt="Search result image">
                        </a>`;
            });
            resultsHtml += `    </div>
                                    <button class="carousel-arrow right z-0" id="image-carousel-right-arrow"><i class="fas fa-chevron-right"></i></button>
                                </div>`;
        }

        // 👇 Insert this before resultsHtml += final block
        data.content = data.content.replace(/<table([\s\S]*?)<\/table>/g, function (match) {
            return `<div class="overflow-x-auto w-full my-4 rounded-md border border-gray-200">${match}</div>`;
        });


        // resultsHtml += `<div id="response-text" class="bg-white p-6 rounded-lg border border-gray-200 mb-4"><p>${data.content}</p></div>
        //     <div class="flex items-center justify-end mt-4">
        //         <i id="copy-icon" class="far fa-copy text-gray-600 text-xl hover:text-teal-600 transition-colors cursor-pointer"></i>
        //     </div>
        //     <script>
        //         $('#copy-icon').on('click', function () {
        //             alert("copy icon clicked")
        //             const textToCopy = $('#response-text').text().trim();

        //             if (navigator.clipboard) {
        //             navigator.clipboard.writeText(textToCopy)
        //                 .then(() => alert("Copied to clipboard!"))
        //                 .catch(() => alert("Failed to copy text."));
        //             } else {
        //             // Fallback for older browsers
        //             const tempTextarea = $('<textarea>');
        //             $('body').append(tempTextarea);
        //             tempTextarea.val(textToCopy).select();
        //             document.execCommand("copy");
        //             tempTextarea.remove();
        //             alert("Copied to clipboard!");
        //             }
        //         });
        //     </script>
        // </div>`;


        // const uniqueId = Date.now(); // or use a counter if multiple results load quickly

        resultsHtml += `
            <div id="response-text-${uniqueId}" class="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                <p>${data.content}</p>
            </div>

            <div class="relative flex items-center justify-end mt-4 group">
                <!-- Copy Icon -->
                <i id="copy-icon-${uniqueId}"
                class="far fa-copy text-gray-600 text-xl hover:text-teal-600 transition-colors cursor-pointer"></i>

                <!-- Tooltip -->
                <div id="result-copy-tooltip-${uniqueId}"
                    class="absolute bottom-full mb-2 right-0 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Copy to clipboard
                </div>
            </div>

            <script>
                $('#copy-icon-${uniqueId}').on('click', function () {
                    console.log($('#response-text-${uniqueId}').html())
                    // const textHtml = $('#response-text-${uniqueId}').html().replace(/<br\\s*\\/?>/gi, '\\n').replace(/<\\/p>/gi, '\\n').replace(/<\\/li>/gi, '\\n');
                    const textHtml = $('#response-text-${uniqueId}')
                        .html()
                        .replace(/<([a-z]+)[^>]*>(?:\\s|&nbsp;|\\u200B)*<\\/\\1>/gi, '') // Remove empty tags (including spaces and zero-width)
                        .replace(/<br\\s*\\/?>/gi, '\\n')
                        .replace(/<\\/p>/gi, '\\n\\n')
                        .replace(/<\\/li>/gi, '\\n')
                        .replace(/<\\/ul>/gi, '\\n')   // ✅ Add newline after </ul>
                        .replace(/<\\/ol>/gi, '\\n')  // ✅ Add newline after </ol>
                        .replace(/<hr\\b[^>]*\\/?>/gi, '\\n'); // ✅ Match all <hr> variations
                    console.log(textHtml)
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = textHtml;
                    const textToCopy = tempDiv.textContent.trim();

                    const $resultCopyTooltip_${uniqueId} = $('#result-copy-tooltip-${uniqueId}');

                    navigator.clipboard.writeText(textToCopy).then(() => {
                        $resultCopyTooltip_${uniqueId}.text('Copied!');
                        setTimeout(() => $resultCopyTooltip_${uniqueId}.text('Copy to clipboard'), 1500);
                    }).catch(() => {
                        $resultCopyTooltip_${uniqueId}.text('Failed to copy');
                        setTimeout(() => $resultCopyTooltip_${uniqueId}.text('Copy to clipboard'), 1500);
                    });
                });
            </script>
            </div>`;

        // if (individualSearchResultContainerId) {
        //     // Replace the specific individual result container inside the main container
        //     $('#' + individualSearchResultContainerId).replaceWith(resultsHtml);
        // } else {
        //     // Append new result to the main container
        //     $('#search-results-container').append(resultsHtml).show();
        // }
        $(`#${loadingHtmlContainerId}`).replaceWith(resultsHtml);
        
        // KEEP LOADING ELEMENT ON THE TOP AFTER REPLACEMENT
        $(`#individual-search-result-${uniqueId}`)[0].scrollIntoView(true);  // instant scroll - no animation/smoothness
        // $(`#individual-search-result-${uniqueId}`)[0].scrollIntoView({
        //     behavior: "smooth",  // Smooth animation
        //     block: "start"       // Align to top
        // });

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

    let ongoingSearchRequest = null;
    let loadingHtmlContainerId = null;

    window.searchAjax = function (form, token, individualSearchResultContainerId = null) {
        if ($('#search-form-btn i').hasClass('fa-arrow-right')) {
            $('#search-form-btn i').addClass('fa-stop').removeClass('fa-arrow-right');
        }

        var links = [];
        var content = null;
        var images = [];

        // const loadingHtml = `<div class="animate-fade-in text-center text-gray-500 p-6 bg-white rounded-lg border border-gray-200" id="loading-message">Searching...</div>`;

        const $searchToastBox = $(searchToastBox.trim());
        $searchToastBox.attr("id", "loading-message").text("Please standby, Pete is working to make your life and work easier...!")
        $searchToastBox.addClass("animate-fade-in text-gray-500").removeClass("text-red-500 mb-8")
        const dynamicHeight = $('#dynamic-content-container').height();
        const searchToastBoxHeight = getHtmlStringHeight(searchToastBox.trim());
        // $searchToastBox.css('margin-bottom', dynamicHeight - searchToastBoxHeight - 32 + 'px');
        $searchToastBox.css('margin-bottom', dynamicHeight - searchToastBoxHeight - 150 + 'px');

        // const loadingHtml = $searchToastBox.prop("outerHTML");
        loadingHtmlContainerId = "loading-message-" + Date.now(); // or any unique logic
        $searchToastBox.attr("id", loadingHtmlContainerId);
        const loadingHtml = $searchToastBox.prop("outerHTML");
        console.log(loadingHtml)


        if (individualSearchResultContainerId) {
            // alert(loadingHtmlContainerId)
            const $loadingElement = $(loadingHtml); // Convert string to jQuery element
            $loadingElement.css('margin-bottom', '32px'); // Apply CSS
            $(`#${individualSearchResultContainerId}`).replaceWith($loadingElement); // Replace

            // KEEP LOADING ELEMENT ON THE TOP AFTER REPLACEMENT
            // $(`#${loadingHtmlContainerId}`)[0].scrollIntoView(true);  // instant scroll - no animation/smoothness
            $(`#${loadingHtmlContainerId}`)[0].scrollIntoView({
                behavior: "smooth",  // Smooth animation
                block: "start"       // Align to top
            });
        }
        else{
            $('#search-results-container').append(loadingHtml).show();
        }
        
        var settings = {
            "url": window.env.BASE_URL + "/api/search/",
            "method": "POST",
            "timeout": 0,
            "headers": { "Authorization": "Bearer " + token },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        // 🔁 Store the jqXHR object for aborting later
        ongoingSearchRequest = $.ajax(settings).done(function (responseData) {
            // $('#loading-message').remove();
            var response = JSON.parse(responseData);

            if (response && response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
                var searchContent = response.choices[0].message.content;

                if (response.search_results) {
                    for (let index = 0; index < response.search_results.length; index++) {
                        const element = response.search_results[index];
                        links.push({ title: element.title, url: element.url });
                    }
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
                renderSearchResults(mockResponse, loadingHtmlContainerId);

            } else {
                // $('#loading-message').remove();
                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Search failed, please try again.")
                // $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
                $(`#${loadingHtmlContainerId}`).replaceWith($searchToastBox.prop("outerHTML"));
            }

            $('#search-results-container').css('margin-bottom', "150px");

        }).fail(function (e) {
            $('#loading-message').remove();

            if (e.statusText === 'abort') {
                return; // ignore aborted error
            }

            if (e.responseText) {
                var error_msg = JSON.parse(e.responseText)
            }
            if (error_msg?.error) {
                const toastOptions = [{
                    status_code: 402,
                    title: "Subscription Required",
                    message: "You’ve reached your free usage cap. Subscribe to continue searching.",
                    type: "info"
                }]

                showToast({ response: e, toastOptions })
                renderPricing()
            }
            else {
                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Search failed, please try again.")
                $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            }
        }).always(function () {
            // ✅ runs on both success and failure
            // $('#search-results-container').css('margin-bottom', "150px");
            $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');
            ongoingSearchRequest = null;
        });
    }


    $('#deep-research-button').click(function () {
        $('#model-select-container').addClass("hidden")
        $(this).removeClass('text-gray-500').addClass('text-blue-500')
        $('#pro-mode-button').removeClass('text-blue-500').addClass('text-gray-500')
        selectedModel = "sonar-deep-research"
    });



    window.handleAISearchSubmission = function () {
        if ($('#search-form-btn i').hasClass('fa-stop')) {
            if (ongoingSearchRequest) {
                ongoingSearchRequest.abort();
                ongoingSearchRequest = null;

                $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');

                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Search aborted.");
                // $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
                $(`#${loadingHtmlContainerId}`).replaceWith($searchToastBox.prop("outerHTML"));
            }
            return;
        }


        if ($('#main-logo').hasClass('text-8xl')) {
            $('#center-content-wrapper').removeClass('justify-center flex-1').addClass('justify-start pt-8');
            $('#main-logo').removeClass('text-8xl mb-10').addClass('text-4xl mb-6');
        }

        const fileSelected = $('#file-upload')[0].files[0];
        const token = localStorage.getItem('accessToken');
        // const searchQueryData = $('#ai_search').val();
        // const searchQueryData = $('#ai_search').text().trim();
        const searchQueryData = $('#ai_search').html().replace(/<br\s*\/?>/gi, '\n');

        if (searchQueryData === "") return;

        hideUploadedFileMetadataBox();
        $("#ai_search").text("").blur();
        autoGrowSearchBox(document.getElementById("ai_search"));
        $("#ai_search").focus();
        $(".main-logo").addClass("hidden");
        $("#footer").addClass("hidden");
        $("#dummy-footer").removeClass("hidden");
        $("#search-form").css({ "position": "fixed", "bottom": "-20px" });
        // $("#ai_search").attr("placeholder", "Inquire Further, Ask Another Question");
        $("#ai_search").attr("data-placeholder", "Inquire Further, Ask Another Question");
        $('#search-form-btn i').removeClass('fa-arrow-right').addClass('fa-stop');

        // const dynamicHeight = $('#dynamic-content-container').height();
        // const searchToastBoxHeight = getHtmlStringHeight(searchToastBox.trim());
        // $('#search-results-container').css('margin-bottom', dynamicHeight - searchToastBoxHeight - 32 + 'px');
        $('#dynamic-content-container').animate({
            scrollTop: $('#dynamic-content-container')[0].scrollHeight
        }, 500);
        $('#center-content-wrapper').removeClass('justify-center');

        if (!token) {
            const $searchToastBox = $(searchToastBox.trim());
            $searchToastBox.text("Please log in to perform a search.");
            $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            $('#search-form-btn i').addClass('fa-arrow-right').removeClass('fa-stop');
            return;
        }

        if (fileSelected) {
            const isImage = fileSelected.type.startsWith("image/");
            const fieldName = isImage ? "image" : "file";
            const url = window.env.BASE_URL + (isImage ? "/api/upload-image/" : "/api/upload-doc/");
            const formData = new FormData();
            formData.append(fieldName, fileSelected, fileSelected.name);

            $.ajax({
                url: url,
                method: "POST",
                timeout: 0,
                headers: { "Authorization": "Bearer " + token },
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                data: formData
            }).done(function (response) {
                var responseData = JSON.parse(response);
                const prompt = (responseData.text_content ? `${responseData.text_content}\n\n\n${searchQueryData}` : searchQueryData);
                var form = new FormData();
                form.append("prompt", prompt);
                form.append("image_url", responseData.image_url);
                form.append("model", selectedModel);
                form.append("search_mode", selectedSource);
                form.append("pro", isProModeEnabled);
                form.append("deep_research", isDeepResearchEnabled);
                form.append("labs", isLabsEnabled);
                form.append("return_images", true);

                searchAjax(form, token);
                $('#file-upload').val('');
            }).fail(function () {
                const $searchToastBox = $(searchToastBox.trim());
                $searchToastBox.text("Image upload failed. Please try again.");
                $('#search-results-container').append($searchToastBox.prop("outerHTML")).show();
            });

        } else {
            var form = new FormData();
            form.append("prompt", searchQueryData);
            form.append("model", selectedModel);
            form.append("search_mode", selectedSource);
            form.append("pro", isProModeEnabled);
            form.append("deep_research", isDeepResearchEnabled);
            form.append("labs", isLabsEnabled);
            form.append("return_images", true);

            searchAjax(form, token);
        }
    }



    $('#search-form').on('submit', function (e) {
        e.preventDefault();
        handleAISearchSubmission();
    });







    // ################### DROPDOWNS ###################
    const $sourceDropdown = $('#source-dropdown');
    const $proModeDropdown = $('#pro-mode-dropdown');
    const $deepResearchDropdown = $('#deep-research-dropdown');
    const $labsDropdown = $('#labs-dropdown');
    const $modelDropdown = $('#model-dropdown');

    const dropdownList = [
        $sourceDropdown,
        $proModeDropdown,
        $deepResearchDropdown,
        $labsDropdown,
        $modelDropdown
    ]

    // Function to close all dropdowns
    window.closeAllDropdowns = function ({ skipDropdown } = {}) {
        // $modelDropdown.addClass('hidden');
        // $sourceDropdown.addClass('hidden');
        // $proModeDropdown.addClass('hidden');
        // $deepResearchDropdown.addClass('hidden');
        // $labsDropdown.addClass('hidden');
        dropdownList.forEach(dropdown => {
            if (dropdown !== skipDropdown) dropdown.addClass("hidden")
        })
    }


    // --- Source Selection Dropdown Logic ---
    const $sourceSelectButton = $('#source-select-button');

    const $proModeButton = $('#pro-mode-button');

    const $deepResearchButton = $('#deep-research-button');

    const $labsButton = $('#labs-button');

    const $managePlan = $('#manage-plan');

    const $modelSelectButton = $('#model-select-button');


    // Toggle dropdown visibility for source
    $sourceSelectButton.on('click', function (e) {
        // e.stopPropagation();
        // closeAllDropdowns({ skipDropdown: $sourceDropdown }); // Close others first
        $sourceDropdown.toggleClass('hidden');
    });


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

    function showContextMenuAbove(target) {
        const offset = target.offset();
        const menu = $modelDropdown;

        const menuHeight = menu.outerHeight();
        const menuWidth = menu.outerWidth();

        menu.css({
            position: "fixed",
            top: offset.top - menuHeight - 8 + "px",
            left: offset.left - menuWidth + 32 + "px"
        })
    }

    $modelSelectButton.on("click", function () {
        showContextMenuAbove($(this));
        $modelDropdown.toggleClass('hidden');
    });

    // $(document).on('click', '#model-select-button', function (e) {
    //     e.stopPropagation();
    //     // const $modelDropdown = $('#model-dropdown'); // ✅ fresh reference
    //     $modelDropdown.toggleClass('hidden');
    //     closeAllDropdowns({skipDropdown: $modelDropdown})
    // });

    // Handle source selection
    $sourceDropdown.on('click', '.source-option', function () {
        selectedSource = $(this).data('source-value');
        // Optionally, visually indicate the selected source (e.g., add a class)
        $('.source-option').removeClass('bg-teal-100'); // Remove highlight from previous selection
        $(this).addClass('bg-teal-100'); // Highlight current selection
        $sourceDropdown.addClass('hidden'); // Hide dropdown after selection
    });
    // Set initial highlight for default source
    $('.source-option[data-source-value="' + selectedSource + '"]').addClass('bg-teal-100');


    $modelDropdown.on('click', '.model-option', function () {
        let $clicked = $(this);
        selectedModel = $clicked.data('model-value');

        $modelDropdown.find(".model-option").each(function () {
            $(this).find("p").eq(0).addClass("text-gray-800");
            $(this).find("p").eq(1).addClass("text-gray-600");
        });

        $clicked.find("p").eq(0).removeClass("text-gray-800").addClass("text-blue-500");
        $clicked.find("p").eq(1).removeClass("text-gray-600").addClass("text-blue-500");

        $modelDropdown.addClass('hidden');
    });


    window.handleKeyDownOnSearchBox = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();      // ⛔ Prevent default newline behavior
            if ($('#search-form-btn i').hasClass('fa-arrow-right')) {
                handleAISearchSubmission();           // ✅ Call your message sending logic
            }
        }
    }

    // window.autoGrowSearchBox = function (textarea) {
    //     textarea.style.height = "auto";
    //     textarea.style.height = textarea.scrollHeight + "px";
    // }

    window.autoGrowSearchBox = function (el) {
        // Reset height to allow shrink
        el.style.height = "auto";

        // Get full height needed
        const scrollHeight = el.scrollHeight;

        // Set new height
        el.style.height = scrollHeight + "px";
    };

}


