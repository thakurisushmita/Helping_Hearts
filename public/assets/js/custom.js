// JavaScript Document

/* ---------------------------------------------------------------------- */
/* Utility Methods
 /* ---------------------------------------------------------------------- */
var Util = {

    isOpera: function () {
        return jQuery.browser.name === 'opera';
    },

    isIE: function () {
        return jQuery.browser.name === 'msie';
    },

    isChrome: function () {
        return jQuery.browser.name === 'chrome';
    },

    closeDDLevelsMenu: function (e, target) {
        var close = true;
        var subuls = ddlevelsmenu.topitems.nav;
        if (subuls) {
            jQuery.each(subuls, function (subul) {
                if (jQuery(subul.parentNode).has(target).length > 0) {
                    close = false;
                }
            });
        }
        if (close) {
            subuls = ddlevelsmenu.subuls.nav;
            if (subuls) {
                jQuery.each(subuls, function (subul) {
                    if (jQuery(subul).has(target).length > 0) {
                        close = false;
                    }
                });
            }
        }
        if (close) {
            subuls = ddlevelsmenu.subuls.nav;
            if (subuls) {
                jQuery.each(subuls, function (subul) {
                    if (subul && subul.parentNode) {
                        ddlevelsmenu.hidemenu(subul.parentNode);
                    }
                });
            }
        }
    }

};

/* ---------------------------------------------------------------------- */
/* ImagePreloader: https://github.com/farinspace/jquery.imgpreload
 /* ---------------------------------------------------------------------- */
(function ($) {
    // extend jquery (because i love jQuery)
    $.imgpreload = function (imgs, settings) {
        settings = $.extend({}, $.fn.imgpreload.defaults, (settings instanceof Function) ? {all: settings} : settings);

        // use of typeof required
        // https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Operators/Special_Operators/Instanceof_Operator#Description
        if ('string' === typeof imgs) {
            imgs = new Array(imgs);
        }

        var loaded = [];
        $.each(imgs, function (i, elem) {
            var img = new Image();
            var url = elem;
            var img_obj = img;
            if ('string' !== typeof elem) {
                url = $(elem).attr('src');
                img_obj = elem;
            }

            $(img).on('load error', function (e) {
                loaded.push(img_obj);
                $.data(img_obj, 'loaded', ('error' !== e.type));
                if (settings.each instanceof Function) {
                    settings.each.call(img_obj);
                }
                // http://jsperf.com/length-in-a-variable
                if (loaded.length >= imgs.length && settings.all instanceof Function) {
                    settings.all.call(loaded);
                }

                $(this).off('load error');
            });

            img.src = url;
        });
    };

    $.fn.imgpreload = function (settings) {
        $.imgpreload(this, settings);
        return this;
    };

    $.fn.imgpreload.defaults = {
        each: null, // callback invoked when each image in a group loads
        all: null // callback invoked when when the entire group of images has loaded
    };

})(jQuery);
/* ---------------------------------------------------------------------- */
/* FlexSlider jQuery Initializer
 /* ---------------------------------------------------------------------- */
(function ($) {

    $.fn.flexSliderInitializer = function (flexSliderObj) {
        var animation = flexSliderObj.animation;
        var sliderSelector = flexSliderObj.controlsContainer;
        var sliders = $(sliderSelector);
        var players;

        if (sliders.length > 0) {
            sliders.each(function () {
                var sliderElement = this;
                var sliderImages = $(sliderElement).find('img');
                if (sliderImages.length > 0) {

                    var firstImageSrc = $(sliderImages[0]).attr('src');
                    if (Util.isIE()) {
                        firstImageSrc += '?t=' + $.now();
                    }

                    $.imgpreload(firstImageSrc, function () {
                        if (Util.isIE()) {
                            $(sliderImages[0]).attr('src', firstImageSrc);
                            initSlider(sliderElement);
                        } else {
                            initSlider(sliderElement);
                        }
                    });
                }
            });
        }

        function initSlider(sliderElement) {
            var slider = $(sliderElement);
            players = slider.find('iframe');

            var sliderConfig = $.extend({}, {
                smoothHeight: (animation === 'slide'),
                pauseOnHover: true, //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
                video: (animation === 'slide'),
                before: function () {
                    pausePlayers();
                }
            }, flexSliderObj);
            slider.fitVids().flexslider(sliderConfig);

            // Swipe gestures support
            if (Modernizr.touch && $().swipe) {
                var next = slider.find('a.flex-next');
                var prev = slider.find('a.flex-prev');

                var doFlexSliderSwipe = function (e, dir) {
                    var target = e.target;
                    if (target.closest('a.flex-next') === 0 && target.closest('a.flex-prev') === 0) {
                        if (dir.toLowerCase() === 'left') {
                            next.trigger('click');
                        }
                        if (dir.toLowerCase() === 'right') {
                            prev.trigger('click');
                        }
                    }
                };

                slider.swipe({
                    swipeLeft: doFlexSliderSwipe,
                    swipeRight: doFlexSliderSwipe,
                    allowPageScroll: 'auto'
                });
            }
        }

        function pausePlayers() {
            try {
                if (players.length > 0 && window.$f) {
                    players.each(function () {
                        $f(this).api('pause');
                    });
                }
            } catch (e) {
            }
        }

    };

})(jQuery);

/* ---------------------------------------------------------------------- */
/* Responsive Search
 /* ---------------------------------------------------------------------- */
(function ($) {

    $.fn.responsiveSearch = function (op) {
        var rs = $.fn.responsiveSearch;
        var settings = $.extend({}, rs.defaults, op);
        var searchInput = $(this);
        var searchButton = $('#search-submit');

        installListeners();

        function setSearchInputVisible(display) {
            if (display) {
                searchInput.fadeIn(settings.animSpeed);
            } else {
                searchInput.fadeOut(settings.animSpeed);
            }
        }

        function installListeners() {
            searchButton.on('click', function () {
                var isSearchHidden = (searchInput.css('display') == 'none');
                if (isSearchHidden) {
                    setSearchInputVisible(true);
                    return false;
                } else if ($.trim(searchInput.val()) === '') {
                    setSearchInputVisible(false);
                    return false;
                } else {
                    return true;
                }
            });
        }

        rs.hide = function (target) {
            if (target.id !== 's' && target.id !== 'search-submit') {
                var isSearchVisible = (searchInput.css('display') !== 'none');
                if (isSearchVisible) {
                    setSearchInputVisible(false);
                }
            }
        };

        return rs;

    };

    var pcc = $.fn.responsiveSearch;
    pcc.defaults = {
        animSpeed: 500
    };

})(jQuery);

// jQuery Initialization
jQuery(document).ready(function ($) {

    /* ---------------------------------------------------------------------- */
    /*	Detect Touch Device
     /* ---------------------------------------------------------------------- */

    if (Modernizr.touch) {
        function removeHoverState() {
            $("body").addClass("no-touch");
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Fixes for Browsers
     /* ---------------------------------------------------------------------- */

    if (Util.isOpera()) {
        $('.flexslider .slides > li').each(function () {
            $(this).css('overflow', 'hidden');
        });
    }

    /* ---------------------------------------------------------------------- */
    /* jCarousel
     /* ---------------------------------------------------------------------- */

    var allCarousels = [
        {'selector': '.post-carousel', 'customSettings': {}},
        {'selector': '.testimonial-carousel', 'customSettings': {auto: 5}},
        {'selector': '.project-carousel', 'customSettings': {scroll: 4, visible: null}}
    ];

    function resetCarouselPosition(carousel) {
        if (carousel.data('resizing')) {
            carousel.css('left', '0');
        }
    }

    function getCarouselScrollCount() {
        var windowWidth = $(window).width();
        if (windowWidth < 480) {
            return 1;
        } else if (windowWidth < 768) {
            return 2;
        } else if (windowWidth < 960) {
            return 3;
        } else {
            return 4;
        }
    }

    function swipeCarousel(e, dir) {
        var carouselParent = $(e.currentTarget).parents().eq(2);
        if (dir.toLowerCase() === 'left') {
            carouselParent.find('.jcarousel-next').trigger('click');
        }
        if (dir.toLowerCase() === 'right') {
            carouselParent.find('.jcarousel-prev').trigger('click');
        }
    }

    function initCarousel(carouselObj, bindGestures) {
        var carouselSelector = carouselObj.selector;
        var customSettings = carouselObj.customSettings;

        var carousels = $(carouselSelector);
        if (carousels.length > 0) {
            carousels.each(function (i) {
                var carousel = $(this);
                var defaultSettings = {
                    scroll: 1,
                    visible: 1,
                    wrap: "last",
                    easing: "swing",
                    itemVisibleInCallback: {
                        onBeforeAnimation: resetCarouselPosition(carousel),
                        onAfterAnimation: resetCarouselPosition(carousel)
                    }
                };
                var settings = $.extend({}, defaultSettings, customSettings);
                settings.scroll = Math.min(getCarouselScrollCount(), settings.scroll);
                carousel.jcarousel(settings);
            });

            if (bindGestures && Modernizr.touch && $().swipe) {
                carousels.swipe({
                    click: function (e, target) {
                        $(target).trigger('click');
                    },
                    swipeLeft: swipeCarousel,
                    swipeRight: swipeCarousel,
                    allowPageScroll: 'auto'
                });
            }
        }
    }

    function resizeCarousel(carouselObj) {
        var carousels = $(carouselObj.selector);
        if (carousels.length > 0) {
            carousels.each(function () {
                var carousel = $(this);
                var carouselChildren = carousel.children('li');
                var carouselItemWidth = carouselChildren.first().outerWidth(true);
                var newWidth = carouselChildren.length * carouselItemWidth + 100;
                if (carousel.width() !== newWidth) {
                    carousel.css('width', newWidth).data('resizing', 'true');
                    initCarousel(carouselObj, false);
                    carousel.jcarousel('scroll', 1);
                    var timer = window.setTimeout(function () {
                        window.clearTimeout(timer);
                        carousel.data('resizing', null);
                    }, 600);
                }
            });
        }
    }

    function resizeAllCarousels() {
        if ($().jcarousel && allCarousels) {
            for (var i = 0; i < allCarousels.length; i++) {
                resizeCarousel(allCarousels[i]);
            }
        }
    }

    function initAllCarousels() {
        if ($().jcarousel && allCarousels) {
            for (var i = 0; i < allCarousels.length; i++) {
                initCarousel(allCarousels[i], true);
            }
        }
    }

    initAllCarousels();

    /* ---------------------------------------------------------------------- */
    /* Tiny Nav
     /* ---------------------------------------------------------------------- */

    if ($().tinyNav) {

        $('html').addClass('js');
        $("#navlist").tinyNav();

    }

    /* ---------------------------------------------------------------------- */
    /* Responsive Search (must be placed after Tiny Nav)
     /* ---------------------------------------------------------------------- */

    var searchInput = $('#s');
    if (searchInput.length > 0) {
        var responsiveSearchInstance = searchInput.responsiveSearch();
    }

    /* ---------------------------------------------------------------------- */
    /* Responsive Video Embeds (must be called before the FlexSlider initialization)
     /* ---------------------------------------------------------------------- */

    function resizeVideoEmbed() {
        if ($().fitVids) {
            $(".entry-video").fitVids();
        }
    }

    resizeVideoEmbed();

    /* ---------------------------------------------------------------------- */
    /* Flex Slider
     /* ---------------------------------------------------------------------- */

    var allFlexSliders = [
        {
            'controlsContainer': '#flexslider-home',
            'animation': 'fade',
            'slideshow': true,
            'slideshowSpeed': 7000,
            'animationSpeed': 600
        },
        {
            'controlsContainer': '#flexslider-about-us',
            'animation': 'slide',
            'slideshow': false,
            'slideshowSpeed': 7000,
            'animationSpeed': 600
        },
        {
            'controlsContainer': '#flexslider-portfolio-item',
            'animation': 'slide',
            'slideshow': false,
            'slideshowSpeed': 7000,
            'animationSpeed': 600
        }
    ];

    function initAllFlexSliders() {
        if ($().flexslider && allFlexSliders) {
            for (var i = 0; i < allFlexSliders.length; i++) {
                $().flexSliderInitializer(allFlexSliders[i]);
            }
        }
    }

    initAllFlexSliders();

    /* ---------------------------------------------------------------------- */
    /* Revolution Slider
     /* ---------------------------------------------------------------------- */

    if ($().revolution) {

        var tpj = jQuery;               // MAKE JQUERY PLUGIN CONFLICTFREE
        tpj.noConflict();

        tpj(document).ready(function () {

            if (tpj.fn.cssOriginal != undefined)   // CHECK IF fn.css already extended
                tpj.fn.css = tpj.fn.cssOriginal;

            tpj('.fullwidthbanner').revolution(
                {
                    delay: 9000,
                    startheight: 400,
                    startwidth: 940,

                    hideThumbs: 200,

                    thumbWidth: 100,							// Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
                    thumbHeight: 50,
                    thumbAmount: 5,

                    navigationType: "bullet",				// bullet, thumb, none
                    navigationArrows: "solo",			// nextto, solo, none

                    navigationStyle: "none",				// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item),

                    navigationHAlign: "center",				// Vertical Align top,center,bottom
                    navigationVAlign: "bottom",					// Horizontal Align left,center,right
                    navigationHOffset: 0,
                    navigationVOffset: 15,

                    soloArrowLeftHalign: "left",
                    soloArrowLeftValign: "center",
                    soloArrowLeftHOffset: 0,
                    soloArrowLeftVOffset: 0,

                    soloArrowRightHalign: "right",
                    soloArrowRightValign: "center",
                    soloArrowRightHOffset: 0,
                    soloArrowRightVOffset: 0,

                    touchenabled: "on",						// Enable Swipe Function : on/off
                    onHoverStop: "on",						// Stop Banner Timet at Hover on Slide on/off


                    stopAtSlide: -1,							// Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
                    stopAfterLoops: -1,						// Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

                    hideCaptionAtLimit: 0,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
                    hideAllCaptionAtLilmit: 0,				// Hide all The Captions if Width of Browser is less then this value
                    hideSliderAtLimit: 0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value

                    shadow: 0,								//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
                    fullWidth: "on"							// Turns On or Off the Fullwidth Image Centering in FullWidth Modus

                });
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Lightbox
     /* ---------------------------------------------------------------------- */

    function lightbox() {
        if ($().fancybox) {

            function calculateLightboxIFrameSize(origWidth, origHeight) {
                var windowWidth = $(window).width();
                if (windowWidth < origWidth * 1.3) {
                    var width = windowWidth * 0.75;
                    var height = (width * origHeight) / origWidth;
                    return {'width': width, 'height': height};
                } else {
                    return false;
                }
            }

            /* Video in Lightbox */
            $(".lightbox-video").each(function () {
                var $this = $(this);
                var origWidth = $this.data('width') ? $this.data('width') : 800;
                var origHeight = $this.data('height') ? $this.data('height') : 450;
                $this.fancybox({
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    nextEffect: 'fade',
                    prevEffect: 'fade',
                    arrows: !Modernizr.touch,

                    autoScale: false,
                    transitionIn: 'none',
                    transitionOut: 'none',
                    title: this.title,
                    width: origWidth,
                    height: origHeight,
                    type: 'iframe',
                    fitToView: false,


                    helpers: {
                        title: {
                            type: 'inside'
                        },
                        buttons: {},
                        media: {}
                    },
                    beforeShow: function () {
                        var $this = this;
                        var size = calculateLightboxIFrameSize(origWidth, origHeight);
                        if (size) {
                            $this.width = size.width;
                            $this.height = size.height;
                        }
                    },
                    onUpdate: function () {
                        var $this = this;
                        var size = calculateLightboxIFrameSize(origWidth, origHeight);
                        if (size) {
                            $this.width = size.width;
                            $this.height = size.height;
                        }
                    },
                    beforeLoad: function () {
                        this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
                    }
                });
            });

            /* Image in Lightbox */
            var lightboxImages = [];
            $('.lightbox, .fancybox').each(function () {
                var parent = $(this).parent();
                var add = true;
                if (parent && parent.hasClass('clone')) {
                    add = false;
                }
                if (add) {
                    lightboxImages.push(this);
                }
            });

            $(lightboxImages).fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                nextEffect: 'fade',
                prevEffect: 'fade',
                arrows: !Modernizr.touch,
                helpers: {
                    title: {
                        type: 'inside'
                    },
                    buttons: {},
                    media: {}
                },
                beforeLoad: function () {
                    this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
                }
            });
        }
    }

    lightbox();

    /* ---------------------------------------------------------------------- */
    /* Tooltips
     /* ---------------------------------------------------------------------- */

    if ($().tipsy) {

        $('.clients img[title], .social-links a[title], .entry-slider img[title]').tipsy({
            fade: true,
            gravity: $.fn.tipsy.autoNS,
            offset: 3
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Scroll to Top
     /* ---------------------------------------------------------------------- */

    if ($().UItoTop) {

        $().UItoTop({
            scrollSpeed: 400
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Fix for YouTube Iframe Z-Index
     /* ---------------------------------------------------------------------- */

    $("iframe").each(function () {
        var ifr_source = $(this).attr('src');
        if (ifr_source) {
            var wmode = "wmode=transparent";
            if (ifr_source.indexOf('?') !== -1) {
                var getQString = ifr_source.split('?');
                var oldString = getQString[1];
                var newString = getQString[0];
                $(this).attr('src', newString + '?' + wmode + '&' + oldString);
            }
            else {
                $(this).attr('src', ifr_source + '?' + wmode);
            }
        }
    });

    /* ---------------------------------------------------------------------- */
    /* Notification Boxes
     /* ---------------------------------------------------------------------- */

    $(".notification-close-info").click(function () {
        $(this).parent().fadeOut("fast");
        return false;
    });

    $(".notification-close-success").click(function () {
        $(this).parent().fadeOut("fast");
        return false;
    });

    $(".notification-close-warning").click(function () {
        $(this).parent().fadeOut("fast");
        return false;
    });

    $(".notification-close-error").click(function () {
        $(this).parent().fadeOut("fast");
        return false;
    });

    /* ---------------------------------------------------------------------- */
    /* Tabs
     /* ---------------------------------------------------------------------- */

    if ($().tabs) {
        $(".tabs").each(function () {
            var settings = {};
            var active = $(this).data('active');
            if (active && $.isNumeric(active)) {
                settings.active = parseInt(active) - 1;
            }

            var heightStyle = $(this).data('heightStyle');
            if (heightStyle) {
                settings.heightStyle = heightStyle;
            }

            var disabled = $(this).data('disabled');
            if (disabled) {
                if ($.isNumeric(disabled)) {
                    disabled = [parseInt(disabled) - 1];
                } else {
                    disabled = $.map(disabled.split(','), function (value) {
                        return parseInt(value, 10) - 1;
                    });
                }
                settings.disabled = disabled;
            }

            $(this).tabs(settings);
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Accordion & Toggle
     /* ---------------------------------------------------------------------- */

    if ($().accordion) {
        $(".toggle").each(function () {
            // for backwards compatibility
            var active = $(this).data('id');
            if (active && active === 'opened') {
                active = true;
            } else {
                active = $(this).data('active');
            }
            if (active && (active === 'true' || active === true)) {
                active = 0;
            } else {
                active = false;
            }

            var heightStyle = $(this).data('heightStyle');
            if (!heightStyle) {
                heightStyle = 'content';
            }

            var disabled = $(this).data('disabled');
            disabled = disabled && (disabled === 'true' || disabled === true);

            $(this).accordion({
                header: '.toggle-title',
                collapsible: true,
                heightStyle: heightStyle,
                disabled: disabled,
                active: active
            });
        });

        $(".accordion").each(function () {
            var heightStyle = $(this).data('heightStyle');
            if (!heightStyle) {
                heightStyle = 'content';
            }

            var active = $(this).data('active');
            if (active && $.isNumeric(active)) {
                active = parseInt(active) - 1;
            } else {
                active = false;
            }

            var disabled = $(this).data('disabled');
            disabled = disabled && (disabled === 'true' || disabled === true);

            $(this).accordion({
                header: '.accordion-title',
                collapsible: true,
                heightStyle: heightStyle,
                disabled: disabled,
                active: active
            });
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Portfolio Filter
     /* ---------------------------------------------------------------------- */

    var $container = $('#gallery');
    // set selected menu items
    var $optionSets = $('.option-set');
    var $optionLinks = $optionSets.find('a');

    function doIsotopeFilter() {
        if ($().isotope) {
            var isotopeFilter = '';
            $optionLinks.each(function () {
                var selector = $(this).attr('data-filter');
                var link = window.location.href;
                var firstIndex = link.indexOf('filter=');
                if (firstIndex > 0) {
                    var id = link.substring(firstIndex + 7, link.length);
                    if ('.' + id == selector) {
                        isotopeFilter = '.' + id;
                    }
                }
            });
            if (isotopeFilter.length > 0) {
                // initialize Isotope
                $container.isotope({
                    itemSelector: '.entry',
                    filter: isotopeFilter
                });
                $optionLinks.each(function () {
                    var $this = $(this);
                    var selector = $this.attr('data-filter');
                    if (selector == isotopeFilter) {
                        if (!$this.hasClass('selected')) {
                            var $optionSet = $this.parents('.option-set');
                            $optionSet.find('.selected').removeClass('selected');
                            $this.addClass('selected');
                        }
                    }
                });
            }

            // filter items when filter link is clicked
            $optionLinks.click(function () {
                var $this = $(this);
                var selector = $this.attr('data-filter');
                $container.isotope({itemSelector: '.entry', filter: selector});

                if (!$this.hasClass('selected')) {
                    var $optionSet = $this.parents('.option-set');
                    $optionSet.find('.selected').removeClass('selected');
                    $this.addClass('selected');
                }

                return false;
            });

        }
    }

    var isotopeTimer = window.setTimeout(function () {
        window.clearTimeout(isotopeTimer);
        doIsotopeFilter();
    }, 1000);

    /* ---------------------------------------------------------------------- */
    /* Form Validation
     /* ---------------------------------------------------------------------- */

    if ($().validate) {
        $("#comment-form").validate();
    }

    var contactForm = $("#contact-form");
    if (contactForm && contactForm.length > 0) {
        var hideMessageTimeout = 7000; //7 seconds
        var contactFormSubmit = contactForm.find("#submit");

        contactFormSubmit.on("click", function (evt) {

            if (contactForm.valid()) {
                contactFormSubmit.attr('disabled', 'disabled');
                $.ajax({
                    type: "POST",
                    url: "contact-processor.php",
                    data: getFormData(),
                    statusCode: {
                        200: function () {
                            var successBoxElement = $("#contact-notification-box-success");
                            successBoxElement.css('display', '');
                            contactFormSubmit.removeAttr('disabled', '');
                            resetFormData();
                            if (hideMessageTimeout > 0) {
                                var timer = window.setTimeout(function () {
                                    window.clearTimeout(timer);
                                    successBoxElement.fadeOut("slow");
                                }, hideMessageTimeout);
                            }
                        },
                        500: function (jqXHR, textStatus, errorThrown) {
                            var errorBoxElement = $('#contact-notification-box-error');
                            var errorMsgElement = $('#contact-notification-box-error-msg');
                            var errorMessage = jqXHR.responseText;
                            if (!errorMessage || errorMessage.length == 0) {
                                errorMessage = errorMsgElement.data('default-msg');
                            }
                            errorMsgElement.text(errorMessage);
                            errorBoxElement.css('display', '');
                            contactFormSubmit.removeAttr('disabled');
                            if (hideMessageTimeout > 0) {
                                var timer = window.setTimeout(function () {
                                    window.clearTimeout(timer);
                                    errorBoxElement.fadeOut("slow");
                                }, hideMessageTimeout);
                            }
                        }
                    }
                });
            }

            function getFormData() {
                var data = 'timestamp=' + evt.timeStamp;
                contactForm.find(":input").each(function () {
                    var field = $(this);
                    var add = true;
                    if (field.is(':checkbox') && !field.is(':checked')) {
                        add = false;
                    }
                    if (add) {
                        var fieldName = field.attr('name');
                        var fieldValue = $.trim(field.val());
                        if (fieldValue.length > 0) {
                            data += '&' + fieldName + '=' + fieldValue;
                        }
                    }
                });
                return data;
            }

            function resetFormData() {
                contactForm.find(":input").each(function () {
                    var field = $(this);
                    var tagName = field.prop("nodeName").toLowerCase();
                    if (tagName == 'select') {
                        field.prop('selectedIndex', 0);
                    } else {
                        if (field.is(':checkbox')) {
                            field.attr("checked", field.prop("defaultChecked"));
                        } else {
                            var defaultValue = field.prop("defaultValue");
                            if (defaultValue) {
                                field.val(defaultValue);
                            } else {
                                field.val('');
                            }
                        }
                    }
                });
            }

            return false;
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Newsletter Subscription
     /* ---------------------------------------------------------------------- */

    if ($().validate) {
        $("#send-newsletter-form").validate();
    }

    var newsletterForm = $("#newsletter-form");
    if (newsletterForm && newsletterForm.length > 0) {
        var newsletterNotificationTimeout = 5000; //5 seconds
        var newsletterSubscribeButton = newsletterForm.find("#subscribe");
        var newsletterEmailInput = newsletterForm.find("#newsletter");

        newsletterSubscribeButton.on("click", function () {

            if ($("#newsletter-form").valid()) {
                $("#subscribe").attr('disabled', 'disabled');
                jQuery.ajax({
                    type: "POST",
                    url: "newsletter.php",
                    data: {email: newsletterEmailInput.val()},
                    statusCode: {
                        200: function () {
                            var successBoxElement = $("#newsletter-notification-box-success");
                            successBoxElement.css('display', '');
                            newsletterSubscribeButton.removeAttr('disabled', '');
                            newsletterEmailInput.val('');
                            if (newsletterNotificationTimeout > 0) {
                                var timer = window.setTimeout(function () {
                                    window.clearTimeout(timer);
                                    successBoxElement.fadeOut("slow");
                                }, newsletterNotificationTimeout);
                            }
                        },
                        500: function (jqXHR, textStatus, errorThrown) {
                            var errorMessage = jqXHR.responseText;
                            var errorBoxElement = $("#newsletter-notification-box-error");
                            errorBoxElement.find('p').html(errorMessage);
                            errorBoxElement.css('display', '');
                            newsletterSubscribeButton.removeAttr('disabled');
                            if (newsletterNotificationTimeout > 0) {
                                var timer = window.setTimeout(function () {
                                    window.clearTimeout(timer);
                                    errorBoxElement.fadeOut("slow");
                                }, newsletterNotificationTimeout);
                            }
                        }
                    }
                });
            }

            return false;
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Twitter Widget
     /* ---------------------------------------------------------------------- */

    if ($().tweet) {
        var apiUrl = '';
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src && src.length > 0 && src.indexOf('/js/custom.js') >= 0) {
                apiUrl = src.replace('/js/custom.js', '/twitter-proxy.php');
            }
        }
        $(".tweet").each(function () {
            try {
                var wrapper = $(this);
                var settings = {
                    username: "ixtendo", // Change username here
                    twitter_api_url: apiUrl,
                    join_text: false,
                    avatar_size: false, // you can activate the avatar
                    count: 2, // number of tweets
                    view_text: "view tweet on twitter",
                    just_now_text: "just now",
                    seconds_ago_text: "about %d seconds ago",
                    a_minutes_ago_text: "about a minute ago",
                    minutes_ago_text: "about %d minutes ago",
                    a_hours_ago_text: "about an hour ago",
                    hours_ago_text: "about %d hours ago",
                    a_day_ago_text: "about a day ago",
                    days_ago_text: "about %d days ago",
                    template: "{avatar}{text}{join}{time}" // [string or function] template used to construct each tweet <li> - see code for available vars
                };

                var username = wrapper.data('username');
                if (typeof username !== 'undefined') {
                    settings.username = username;
                }
                var joinText = wrapper.data('joinText');
                if (typeof joinText !== 'undefined') {
                    settings.join_text = joinText;
                }
                var avatarSize = wrapper.data('avatarSize');
                if (typeof avatarSize !== 'undefined') {
                    settings.avatar_size = avatarSize;
                }
                var count = wrapper.data('count');
                if (typeof count !== 'undefined') {
                    settings.count = count;
                }
                var retweets = wrapper.data('retweets');
                if (typeof retweets !== 'undefined') {
                    settings.retweets = retweets;
                }
                var viewText = wrapper.data('viewText');
                if (typeof viewText !== 'undefined') {
                    settings.view_text = viewText;
                }
                var justNowText = wrapper.data('justNowText');
                if (typeof justNowText !== 'undefined') {
                    settings.just_now_text = justNowText;
                }
                var secondsAgoText = wrapper.data('secondsAgoText');
                if (typeof secondsAgoText !== 'undefined') {
                    settings.seconds_ago_text = secondsAgoText;
                }
                var aMinutesAgoText = wrapper.data('aMinutesAgoText');
                if (typeof aMinutesAgoText !== 'undefined') {
                    settings.a_minutes_ago_text = aMinutesAgoText;
                }
                var minutesAgoText = wrapper.data('minutesAgoText');
                if (typeof minutesAgoText !== 'undefined') {
                    settings.minutes_ago_text = minutesAgoText;
                }
                var aHoursAgoText = wrapper.data('aHoursAgoText');
                if (typeof aHoursAgoText !== 'undefined') {
                    settings.a_hours_ago_text = aHoursAgoText;
                }
                var hoursAgoText = wrapper.data('hoursAgoText');
                if (typeof hoursAgoText !== 'undefined') {
                    settings.hours_ago_text = hoursAgoText;
                }
                var aDayAgoText = wrapper.data('aDayAgoText');
                if (typeof aDayAgoText !== 'undefined') {
                    settings.a_day_ago_text = aDayAgoText;
                }
                var daysAgoText = wrapper.data('daysAgoText');
                if (typeof daysAgoText !== 'undefined') {
                    settings.days_ago_text = daysAgoText;
                }
                var template = wrapper.data('template');
                if (typeof template !== 'undefined') {
                    settings.template = template;
                }

                wrapper.tweet(settings);
            } catch (e) {
                console.log(e);
            }
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Flickr Widget
     /* ---------------------------------------------------------------------- */

    if ($().jflickrfeed) {

        $('.flickr-feed').jflickrfeed({
            limit: 6,
            qstrings: {
                id: '52617155@N08' // Flickr ID (Flickr IDs can be found using this tool: http://idgettr.com/)
            },
            itemTemplate: '<li><a href="{{link}}" title="{{title}}" target="_blank"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Google Maps
     /* ---------------------------------------------------------------------- */

    var mapObject = $('#map');
    if ($().gMap && mapObject.length > 0) {
        var lat = mapObject.data('lat'); //uses data-lat attribute
        var lng = mapObject.data('lng'); //uses data-lng attribute
        var addr = mapObject.data('address'); //uses data-address attribute
        var zoom = mapObject.data('zoom'); //uses data-zoom attribute
        var markers = {};
        if (addr) {
            markers['address'] = addr;
        } else {
            markers['latitude'] = lat;
            markers['longitude'] = lng;
        }

        mapObject.gMap({markers: [markers], zoom: zoom});
    }

    function resizeGoogleMap() {
        if (mapObject.length > 0) {
            var mapWidth = mapObject.width();
            var mapHeight = Math.round(mapWidth * 0.425);
            mapObject.height(mapHeight);
        }
    }

    resizeGoogleMap();

    /* ---------------------------------------------------------------------- */
    /* Sticky Footer
     /* ---------------------------------------------------------------------- */

    // Set minimum height so that the footer will stay at the bottom of the window even if there isn't enough content
    function setMinHeight() {
        var body = $('body');
        var wrap = $('#wrap');
        var content = $('#content');
        content.css('min-height',
            $(window).outerHeight(true)
            - ( body.outerHeight(true) - body.height() )
            - ( wrap.outerHeight(true) - wrap.height() )
            - $('#header').outerHeight(true)
            - $('#slider-home').outerHeight(true)
            - $('#page-title').outerHeight(true)
            - ( content.outerHeight(true) - content.height() )
            - $('#footer').outerHeight(true)
        );
    }

    // Init
    setMinHeight();

    // Window resize
    $(window).on('resize', function () {
        var timer = window.setTimeout(function () {
            window.clearTimeout(timer);
            setMinHeight();
            resizeAllCarousels();
            resizeGoogleMap();
        }, 30);
    });


    if (Modernizr.touch) {
        $(document).on('touchstart', function (e) {
            var target = e.target;
            if (responsiveSearchInstance) {
                responsiveSearchInstance.hide(target);
            }
            Util.closeDDLevelsMenu(e, target);
        });
    } else {
        $(document).click(function (e) {
            Util.closeDDLevelsMenu(e, '');
            if (responsiveSearchInstance) {
                responsiveSearchInstance.hide(e.target);
            }
        });
    }

/* ---------------------------------------------------------------------- */
    /* Style Switcher
     /* ---------------------------------------------------------------------- */

    var windowWidth = $(window).width();
    if (windowWidth > 480) {
        var sw = (window.location.href.indexOf('#nosw') < 0);
        if ($().styleSwitcher && sw) {
            var styleSwitcher = $().styleSwitcher();
            styleSwitcher.loadStyleSwitcher();
            styleSwitcher.applySettings();
        }
    }

});