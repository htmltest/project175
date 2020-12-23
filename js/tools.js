$(document).ready(function() {

    $('.main-faq-item-header').click(function() {
        var curItem = $(this).parent();
        curItem.toggleClass('open');
        curItem.find('.main-faq-item-text').slideToggle();
    });

    $('.main-map').each(function() {
        $('.main-map-content').html('<svg width="939" height="534" viewBox="0 0 1107.77 630.12" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>');

        var newMap = '';

        for (var j = 0; j < opendataRegions.length; j++) {
            var curRegion = opendataRegions[j];
            for (var i = 0; i < mainRegionsData.length; i++) {
                if (curRegion.id == mainRegionsData[i][0]) {
                    var curURL = '';
                    if (mainRegionsData[i][1].link != null) {
                        curURL = ' data-url="' + mainRegionsData[i][1].link + '"';
                    }
                    newMap += '<g data-id="' + curRegion.id + '"' + curURL + '>' + curRegion.svg + '</g>';
                }
            }
        }
        $('.main-map-content svg').html(newMap);

    });

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('body').on('click', '.main-map-content g', function(e) {
        if ($(this).attr('data-url') !== undefined) {
            windowOpen($(this).attr('data-url'));
        }
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