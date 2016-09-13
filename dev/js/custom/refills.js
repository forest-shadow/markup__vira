$(document).ready(function(){
    // 01. Stylized accordion
    $('.accordion-tabs').each(function(index) {
        $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    });

    $('.accordion-tabs').on('click', 'li > a.tab-link', function(event) {
        if (!$(this).hasClass('is-active')) {
          event.preventDefault();
          var accordionTabs = $(this).closest('.accordion-tabs');
          accordionTabs.find('.is-open').removeClass('is-open').hide();

          $(this).next().toggleClass('is-open').toggle();
          accordionTabs.find('.is-active').removeClass('is-active');
          $(this).addClass('is-active');
        } else {
          event.preventDefault();
        }
    });

    $('.accordion-tabs-minimal').each( function(index) {
        $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    } );
    $('.accordion-tabs-minimal').on('click', 'li > a.tab-link', function(event) {
        if ( !$(this).hasClass('is-active') ) {
            event.preventDefault();
            var accordionTabs = $(this).closest('.accordion-tabs-minimal');
            accordionTabs.find('.is-open').removeClass('is-open').hide();

            $(this).next().toggleClass('is-open').toggle();
            accordionTabs.find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else {
            event.preventDefault();
        }
    });

    // 02. Modals
    $( "#modal-1" ).on( "change", function() {
        if ( $(this).is( ":checked" ) ) {
            $( "body" ).addClass( "modal-open" );
        } else {
            $( "body" ).removeClass( "modal-open" );
        }
    } );

    $( ".modal-fade-screen, .modal-close" ).on( "click", function() {
        $( ".modal-state:checked" ).prop( "checked", false ).change();
    });

    $( ".modal-inner" ).on( "click", function(e) {
        e.stopPropagation();
    });

    // 03. Parallax Window

    if ( $( "#js-parallax-window" ).length ) {
        parallax();
    }


    // 04. Expander trigger
	$('.expander-trigger').click(function(){
		$(this).toggleClass("expander-hidden");
	});

    // 05. Gapped Expander trigger
	$('.gapped-expander-trigger').click(function(){
		$(this).toggleClass("gapped-expander-hidden");
	});

    // 06. Dropdown button
    $(".dropdown-button").click(function() {
        var $button, $menu;
        $button = $(this);
        $menu = $button.siblings( ".dropdown-menu" );
        $menu.toggleClass("show-menu");
        $menu.children("li").click(function() {
            $menu.removeClass("show-menu");
            $button.html($(this).html());
        });
    });
});



// 03. Parallax Window
$( window ).scroll( function(e) {
    if ( $( "#js-parallax-window" ).length ) {
        parallax();
    }
} );
function parallax() {
    if( $( "#js-parallax-window" ).length > 0 ) {
        var plxBackground = $( "#js-parallax-background" );
        var plxWindow = $( "#js-parallax-window" );

        var plxWindowTopToPageTop = $( plxWindow ).offset().top;
        var windowTopToPageTop = $( window ).scrollTop();
        var plxWindowTopToWindowTop = plxWindowTopToPageTop - windowTopToPageTop;

        var plxBackgroundTopToPageTop = $( plxBackground ).offset().top;
        var windowInnerHeight = window.innerHeight;
        var plxBackgroundTopToWindowTop = plxBackgroundTopToPageTop - windowTopToPageTop;
        var plxBackgroundTopToWindowBottom = windowInnerHeight - plxBackgroundTopToWindowTop;
        var plxSpeed = 0.25;

        plxBackground.css( 'top', - ( plxWindowTopToWindowTop * plxSpeed ) + 'px' );
    }
}
