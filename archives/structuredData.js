window.structuredData = function (rawText, citationsMetadata) {
    var rawText = rawText.replace(/<think>.*?<\/think>/gs, '');
    var lines = rawText.split('\n');

    // // REPLACING --- WITH <hr> (<hr> is HTML equivalent to ---)
    // for (var i = 0; i < lines.length; i++) {
    //     if (lines[i].trim() === '---') {
    //         lines[i] = '<hr class="my-6 border-t border-gray-300">';
    //     }
    // }

    var htmlBuilder = [];
    var inList = false;
    var inTable = false;
    var inCodeBlock = false;
    var currentTableLines = [];
    var currentCodeLines = [];
    var codeLang = '';


    function handleHeading(level, text) {
        // Close list if open
        if (inList) {
            htmlBuilder.push('</ul>');
            inList = false;
        }
        // Close table if open
        if (inTable) {
            htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
            currentTableLines = [];
            inTable = false;
        }
        // Map heading levels to Tailwind classes
        const headingClasses = {
            1: 'text-3xl font-bold mt-6 mb-3',
            2: 'text-2xl font-semibold mt-4 mb-2',
            3: 'text-xl font-semibold mt-4 mb-2',
            4: 'text-lg font-semibold mt-3 mb-1.5',
            5: 'text-base font-semibold mt-2 mb-1',
            6: 'text-sm font-semibold mt-1 mb-0.5'
        };
        htmlBuilder.push(
            `<h${level} class="${headingClasses[level] || 'text-base font-semibold'}">${parseItalic(parsebold(text))}</h${level}>`
        );
    }


    $.each(lines, function (i, line) {
        var trimmedLine = line.trim();

        // REPLACING --- WITH <hr> (<hr> is HTML equivalent to ---)
        if (trimmedLine === '---') {
            htmlBuilder.push('<hr class="my-6 border-t border-gray-300">')
            return
        }

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
                htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
                currentTableLines = [];
                inTable = false;
            }
            return;
        }

        // if (trimmedLine.startsWith('### ')) {
        //     if (inList) {
        //         htmlBuilder.push('</ul>');
        //         inList = false;
        //     }
        //     if (inTable) {
        //         htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
        //         currentTableLines = [];
        //         inTable = false;
        //     }
        //     htmlBuilder.push('<h3 class="text-xl font-semibold mt-4 mb-2">' + parseItalic(parsebold(trimmedLine.substring(4).trim())) + '</h3>');
        // } else if (trimmedLine.startsWith('## ')) {
        //     if (inList) {
        //         htmlBuilder.push('</ul>');
        //         inList = false;
        //     }
        //     if (inTable) {
        //         htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
        //         currentTableLines = [];
        //         inTable = false;
        //     }
        //     htmlBuilder.push('<h2 class="text-2xl font-semibold mt-4 mb-2">' + parseItalic(parsebold(trimmedLine.substring(3).trim())) + '</h2>');
        // } 

        // Usage: dynamically detect heading level
        const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;       // number of #
            const text = headingMatch[2].trim();
            handleHeading(level, text);
        }

        else if (trimmedLine.startsWith('- ')) {
            if (!inList) {
                htmlBuilder.push('<ul class="list-disc list-inside ml-4 my-2">');
                inList = true;
            }
            if (inTable) {
                htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
                currentTableLines = [];
                inTable = false;
            }

            // GET MAIN TEXT AND CITATIONS HTML
            const [mainText, citationsHtml] = getMainTextAndCitationsHtml(trimmedLine, citationsMetadata)

            htmlBuilder.push('<li class="text-gray-700">' + parseItalic(parsebold(mainText.substring(2).trim())) + citationsHtml + '</li>');
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
                htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
                currentTableLines = [];
                inTable = false;
            }

            // GET MAIN TEXT AND CITATIONS HTML
            const [mainText, citationsHtml] = getMainTextAndCitationsHtml(trimmedLine, citationsMetadata)

            htmlBuilder.push('<p class="text-gray-700 leading-relaxed my-2">' + parseItalic(parsebold(mainText)) + citationsHtml + '</p>');
        }
    });

    if (inList) {
        htmlBuilder.push('</ul>');
    }
    if (inTable) {
        htmlBuilder.push(buildTable(currentTableLines, citationsMetadata));
    }
    if (inCodeBlock && currentCodeLines.length > 0) {
        htmlBuilder.push('<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-2"><code class="language-' + codeLang + '">' + currentCodeLines.join('\n') + '</code></pre>');
    }

    return htmlBuilder.join('');
}