function refreshLogstate(){
    const token = localStorage.getItem('accessToken');
    if (token !== null && token !== '' && token != 'undefined') {
        $('.openLoginModal').addClass('hidden');
        $('.logout').removeClass('hidden');
        $('.signup').addClass('hidden');
    } else {
        $('.logout').addClass('hidden');
        $('.openLoginModal').removeClass('hidden');
        $('.signup').removeClass('hidden');
    }
}

function scrollToBottom() {
    const chatContainer = jQuery('#search-content-box');
    chatContainer.scrollTop(chatContainer.prop("scrollHeight"));
}

function checkIfTokenExpire(code){
    if( code == "token_not_valid" || code == "Unauthorized" ){
        localStorage.removeItem('accessToken');
        refreshLogstate();
    }
}

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

    var tableHtml = '<table>';
    var headerRow = rows[0];
    var dataRows = rows.slice(2);

    tableHtml += '<thead><tr>';
    var headerCells = headerRow.substring(1, headerRow.length - 1).split('|');
    $.each(headerCells, function(idx, cellContent) {
        tableHtml += '<th>' + parseBold(removeFootnotes(cellContent)) + '</th>';
    });
    tableHtml += '</tr></thead>';

    tableHtml += '<tbody>';
    $.each(dataRows, function(idx, rowStr) {
        tableHtml += '<tr>';
        var cells = rowStr.substring(1, rowStr.length - 1).split('|');
        $.each(cells, function(cellIdx, cellContent) {
            tableHtml += '<td>' + parseBold(removeFootnotes(cellContent)) + '</td>';
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody>';

    tableHtml += '</table>';
    return tableHtml;
}

function structuredData(rawText){
    // var rawText = $('#raw-text-content').text().trim();
    var lines = rawText.split('\n');
    var htmlBuilder = [];
    var inList = false;
    var inTable = false;
    var inCodeBlock = false;
    var currentTableLines = [];
    var currentCodeLines = [];
    var codeLang = '';


    $.each(lines, function(i, line) {
        var trimmedLine = line.trim();

        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                htmlBuilder.push('<pre><code class="language-' + codeLang + '">' + currentCodeLines.join('\n') + '</code></pre>');
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
            htmlBuilder.push('<h2>' + parseBold(trimmedLine.substring(3).trim()) + '</h2>');
        } else if (trimmedLine.startsWith('- ')) {
            if (!inList) {
                htmlBuilder.push('<ul>');
                inList = true;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines));
                currentTableLines = [];
                inTable = false;
            }
            htmlBuilder.push('<li>' + parseBold(trimmedLine.substring(2).trim()) + '</li>');
        } else if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            if (inList) {
                htmlBuilder.push('</ul>');
                inList = false;
            }
            currentTableLines.push(trimmedLine);
            inTable = true;
        } else {
            if (inList) {
                htmlBuilder.push('</ul>');
                inList = false;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines));
                currentTableLines = [];
                inTable = false;
            }
            htmlBuilder.push('<p>' + parseBold(trimmedLine) + '</p>');
        }
    });

    if (inList) {
        htmlBuilder.push('</ul>');
    }
    if (inTable) {
        htmlBuilder.push(buildTable(currentTableLines));
    }
    if (inCodeBlock && currentCodeLines.length > 0) {
        htmlBuilder.push('<pre><code class="language-' + codeLang + '">' + currentCodeLines.join('\n') + '</code></pre>');
    }

    return htmlBuilder.join('');

}

refreshLogstate();

jQuery(document).ready(function(){

    var BASE_URL = "https://api.carriesearch.ai";
    var selectedFile = null;
    var base64String = null;

    $('.openLoginModal').on('click', function() {
        $('#loginModal').addClass('active');
    });

    $('.signup').on('click', function(){
        $('#signupModal').addClass('active');
    });

    
    $('.close-button').on('click', function() {
        $(this).parent().parent().removeClass('active');
    });

    
    $(window).on('click', function(event) {
        if ($(event.target).is('#loginModal')) {
            $('#loginModal').removeClass('active');
            $('#loginModal alert').hide();
        }
    });

    $('.modal-content').on('click', function(event) {
        event.stopPropagation();
    });

    $('.modal .alert a').on('click', function(event){
        $(this).parent().hide();
    })

    refreshLogstate();

    jQuery('.logout').on('click', function () {
        localStorage.removeItem('accessToken');
        refreshLogstate();
    });

    $('#loginModal form').on('submit', function(event) {
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        
        var form = new FormData();
        form.append("username", username);
        form.append("password", password);

        var settings = {
        "url": BASE_URL+"/api/login/",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };

        $.ajax(settings).done(function (response) {
            
            $('.login-success').addClass('active');
            $('.login-success').show();

            $('.password.alert').removeClass('active');
            $('.password.alert').hide();
            data = JSON.parse(response);
            localStorage.setItem('accessToken', data.access);
            
            refreshLogstate();
            setTimeout(function() {
                $('#loginModal').removeClass('active');
            }, 1000);
        }).fail(function (e){
            
            $('.password.alert').addClass('active');
            $('.password.alert').show();

            $('.login-success').removeClass('active');
            $('.login-success').hide();
            refreshLogstate();
        });

    });

    $('#signupModal form').on('submit', function(event) {
        event.preventDefault();
        const username  = $('#name').val();
        const password  = $('#pass').val();
        const email     = $('#email').val();
        
        var form = new FormData();
        form.append("username", username);
        form.append("password", password);
        form.append("email", email);

        var settings = {
            "url": BASE_URL+"/api/signup/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            
            $('.signup-success').addClass('active');
            $('.signup-success').show();

            $('.signup-error').removeClass('active');
            $('.signup-error').hide();

            setTimeout(function() {
                $('#signupModal').removeClass('active');
            }, 2000);
        }).fail(function (e){
            
            $('.signup-error').addClass('active');
            $('.signup-error').show();

            $('.signup-success').removeClass('active');
            $('.signup-success').hide();
        });

    });

    // $('#ai_search').on('keyup', function(event){
    //     if( $(this).val().length > 0 ){
    //         $('li.active.mic').addClass('hide');
    //         $('li.active.enter').removeClass('hide');
    //     } else {
    //         $('li.active.enter').addClass('hide');
    //         $('li.active.mic').removeClass('hide');
    //     }
        
    // });

    jQuery("#file1").on('change', function(event){
        selectedFile = event.target.files[0];

        // var reader = new FileReader();

        // reader.onload = function(e) {
        //     base64String = e.target.result; // This contains the Base64 string
        //     console.log( base64String );
        // };


        // reader.readAsDataURL(selectedFile);
        // console.log(base64String);
    });

    function uploadImageAjax(fileSelected, token){

        var formData = new FormData();
        var base64AjaxData1 = null
        formData.append("image", fileSelected, "file");

        var settings = {
        "url": BASE_URL+"/api/upload-image/",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer "+ token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formData
        };

        $.ajax(settings).done(function (response) {
            var responseData = JSON.parse(response);
            console.log(responseData);

            var searchQueryData = jQuery('#ai_search').val();
            var form = new FormData();
            form.append("prompt", searchQueryData);
            form.append("image_url", responseData.image_url);
            searchAjax(form, token);
        });

        return base64AjaxData1;

    }

    function searchAjax(form, token){
        var settings = {
        "url": BASE_URL + "/api/search/",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer "+ token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };

        $.ajax(settings).done(function(response) {

            response = JSON.parse(response);
            
            if (response && response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
                var searchContent = response.choices[0].message.content;
                for (let index = 0; index < response.search_results.length; index++) {
                    const element = response.search_results[index];
                    console.log(element.title);
                    jQuery('.page-container .full-width-row').append('<div class="box-item"><a target="_blank" href="'+element.url+'"><span>'+ element.title +'</span></a></div>');
                    
                }
                const structuredDataVal = structuredData(searchContent);
                jQuery('#search-content-box .message-window').html(structuredDataVal);
                
            } else {
                jQuery('#search-content-box .message-window').html('<p>No relevant results found.</p>');
                jQuery('#search-content-box .full-width-row').html('');
            }
                
            jQuery("#search-content-box span#titleLoader").addClass('loader-hidden');
            jQuery("#search-content-box span#titleLoader").removeClass('loader-visible');
            jQuery('#ai_search').val('');
        }).fail(function(e) {
            response = JSON.parse(e.responseText);
            checkIfTokenExpire(response.code);
            // Display an error message to the user
            jQuery('#search-content-box .message-window').html('<p>Error: Could not retrieve search results. Please try again later.</p>');
            jQuery('#search-content-box .full-width-row').html('');
            jQuery("#search-content-box span#titleLoader").addClass('loader-hidden');
            jQuery("#search-content-box span#titleLoader").removeClass('loader-visible');
            jQuery('#ai_search').val('');
        });
    }

    jQuery('li.active.enter a').on('click', function(event){

        var searchQuery = jQuery('#ai_search').val();
        var base64AjaxData = null;
        if (searchQuery.trim() === '') {
            return; 
        }

        // jQuery('.pos-abs-con').addClass('stick-to-bottom');
        jQuery('#search-content-box').addClass('search-content');
        jQuery("#search-content-box span#titleLoader").removeClass('loader-hidden');
        jQuery("#search-content-box span#titleLoader").addClass('loader-visible');

        // jQuery('#search-content-box').append('<div class="user-message"><p>'+searchQuery+'</p></div>');
        jQuery('#search-content-box .search-heading').html(searchQuery);
        // scrollToBottom();
        jQuery('.page-container .full-width-row').html('');
        jQuery('.page-container .message-window').html('');
        
        const token = localStorage.getItem('accessToken');

        var form = new FormData();
        form.append("prompt", searchQuery);

        var myfileField = jQuery("#file1")[0];
        var fileSelected = myfileField.files[0];
        
        if( fileSelected != null && fileSelected != 'undefined' ){
            
            uploadImageAjax(fileSelected, token);
            

            // searchAjax(form, token, null);
        } else {
            searchAjax(form, token);
        }

    });

});