
import "../handlers/handle_library.js"


window.renderLibrary = function (){
    handleRenderLibrary()
}


$('#library-link').on('click', function (e) {
    e.preventDefault();
    renderLibrary()
});