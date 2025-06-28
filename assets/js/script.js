jQuery(document).ready(function () {
        jQuery('.sidebar').hover(
            function () {
                jQuery('.menu-sidebar').css('transform', 'translateX(0%)');
            },
            function () {
                jQuery('.menu-sidebar').css('transform', 'translateX(-100%)');
            }
        );
    });