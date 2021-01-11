$(document).ready(function() {

    $('.main-faq-item-header').click(function() {
        var curItem = $(this).parent();
        curItem.toggleClass('open');
        curItem.find('.main-faq-item-text').slideToggle();
    });

    $('.main-map').each(function() {
        $('.main-map-content').html('<svg viewBox="0 0 1107.77 630.12" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>');

        var newMap = '';
        var newHints = '';

        for (var i = 0; i < opendataRegions.length; i++) {
            var curRegion = opendataRegions[i];
            newMap += '<g>' + curRegion.svg + '</g>';
        }

        for (var i = 0; i < mainRegionsData.length; i++) {
            var curCity = mainRegionsData[i];
            var curURL = ' data-url="' +  + '"';
            newHints += '<a href="' + curCity.link + '" class="window-link main-map-item" style="left:' + (curCity.coords[0] / 1108 * 100) + '%; top:' + (curCity.coords[1] / 630 * 100) + '%">' +
                            '<div class="main-map-item-icon"></div>' +
                            '<div class="main-map-item-window">' +
                                '<div class="main-map-item-window-title">' + curCity.title + '</div>' +
                                '<div class="main-map-item-window-info">' +
                                    '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-1.svg" alt="" width="22" height="22" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.math + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-2.svg" alt="" width="21" height="20" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.genom + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-3.svg" alt="" width="19" height="22" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.ntr + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-4.svg" alt="" width="24" height="24" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.nomc + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</a>';
        }
        $('.main-map-content svg').html(newMap);
        $('.main-map-content').append(newHints);
    });

    $('body').on('mouseenter', '.main-map-item', function() {
        if ($(window).width() > 1199) {
            var curItem = $(this);
            curItem.find('.main-map-item-window').css({'left': curItem.offset().left, 'top': curItem.offset().top - $(window).scrollTop() - 8});
            curItem.addClass('visible');
        }
    });

    $('body').on('mouseleave', '.main-map-item', function() {
        $('.main-map-item.visible').removeClass('visible');
    });

    $('.main-map-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.window-info-item-title', function(e) {
        $(this).parent().toggleClass('open');
        $(this).parent().find('.window-info-item-content').slideToggle();
        e.preventDefault();
    });

    $('.mobile-menu-link').click(function(e) {
        if ($('html').hasClass('mobile-menu-open')) {
            $('html').removeClass('mobile-menu-open');
            $('meta[name="viewport"]').attr('content', 'width=device-width');
            $('.wrapper').css('margin-top', 0);
            $(window).scrollTop($('html').data('scrollTop'));
        } else {
            var curWidth = $(window).width();
            if (curWidth < 480) {
                curWidth = 480;
            }
            var curScroll = $(window).scrollTop();
            $('html').addClass('mobile-menu-open');
            $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
            $('html').data('scrollTop', curScroll);
            $('.wrapper').css('margin-top', -curScroll);
        }
        e.preventDefault();
    });

});

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curWidth = $(window).width();
        if (curWidth < 480) {
            curWidth = 480;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}