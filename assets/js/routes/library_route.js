
import "../handlers/handle_library.js"


$('#library-link').on('click', function (e) {
    e.preventDefault();
    renderLibrary()
});