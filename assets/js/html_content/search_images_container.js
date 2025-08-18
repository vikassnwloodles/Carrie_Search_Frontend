window.renderSearchImagesContainer = function (images) {
    let resultsHtml = ""
    if (images && images.length > 0) {
        resultsHtml += `<h3 class="text-xl font-semibold mt-6 mb-4">Related Images:</h3>
                                <div class="image-carousel-wrapper">
                                    <button class="carousel-arrow left z-0" id="image-carousel-left-arrow"><i class="fas fa-chevron-left"></i></button>
                                    <div class="image-carousel-container" id="image-carousel-container">`;
        images.forEach(image => {
            resultsHtml += `
                        <a href="${image.url}" target="_blank" class="image-card">
                            <img src="${image.src}" alt="Search result image">
                        </a>`;
        });
        resultsHtml += `    </div>
                                    <button class="carousel-arrow right z-0" id="image-carousel-right-arrow"><i class="fas fa-chevron-right"></i></button>
                                </div>`;
    }

    return resultsHtml
}