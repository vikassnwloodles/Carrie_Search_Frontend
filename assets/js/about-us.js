jQuery(document).ready(function(){

    var page_name = null;

    jQuery(".sec-pages").on("click", function(event){
        page_name = jQuery(this).data('attr');

        console.log(page_name+'-page');

        jQuery('.page-item').addClass('hidden');
        jQuery('.'+page_name+'-page').removeClass('hidden');

    });

});