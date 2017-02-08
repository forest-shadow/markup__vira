$( document ).ready( function(){
    // initialize navigation
    $( "#top-nav" ).menumaker( {
        title: "Меню",
        format: "multitoggle"
    } );

    // initialize mainpage slider
    $( '#mainpage-slider' ).slick( {
        arrows: false,
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 7000
    } );

    // initialize our services carousel
    $( '.js-our-services-carousel' ).slick( {
        arrows: true,
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 7000
    } );

    // initialize our partners
    $( '.js-our-partners-carousel' ).slick( {
        arrows: true,
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 7000
    } );

    // initialize thanks letters gallery
    $( '.js-thanks-letters-gallery, #photogallery' ).magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
        }
    });

  // initialize replies gallery
  $( '#docs-gallery' ).magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    // titleSrc: 'title', // Attribute of the target element that contains caption for the slide.
    // // Or the function that should return the title. For example:

    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      titleSrc: function(item) {
        return item.el.find('span').text();
      }
    }
  });


  // 04. Feedback call popup
  $( '.js-popup-form' ).magnificPopup({
    type: 'inline',
    focus: '#name',

    // When elemened is focused, some mobile browsers in some cases zoom in
    // It looks not nice, so we disable it:
    callbacks: {
      beforeOpen: function() {
        if($(window).width() < 700) {
          this.st.focus = false;
        } else {
          this.st.focus = '#name';
        }
      }
    },

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in'
  });

});
