$(document).ready(function() {

    $('.main-faq-item-header').click(function() {
        var curItem = $(this).parent();
        curItem.toggleClass('open');
        curItem.find('.main-faq-item-text').slideToggle();
    });

    $('.main-map').each(function() {
        drawMainMap();
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
            $('html').removeClass('search-window-open');
            $('html').removeClass('header-cabinet-open');
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

    $('.faq-menu a').click(function(e) {
        var curBlock = $(this.hash);
        if (curBlock.length == 1) {
            $('html, body').animate({'scrollTop': curBlock.offset().top});
            e.preventDefault();
        }
    });

    $('.gallery').each(function() {
        var curGallery = $(this);
        curGallery.on('init', function(event, slick) {
            var curSlide = curGallery.find('.slick-current');
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
        var options = {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            adaptiveHeight: true,
            fade: true,
            dots: false,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        arrows: false,
                        dots: true
                    }
                }
            ]
        };
        curGallery.slick(
            options
        ).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            var curSlide = curGallery.find('.slick-slide:not(.slick-cloned)').eq(nextSlide);
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
    });

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('inputDate',
        function(curDate, element) {
            if (this.optional(element) && curDate == '') {
                return true;
            } else {
                if (curDate.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    return true;
                } else {
                    $.validator.messages['inputDate'] = 'Дата введена некорректно';
                    return false;
                }
            }
        },
        ''
    );

    $('body').on('focus', '.form-input input, .form-input textarea', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input, .form-input textarea', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('body').on('input', '.form-input textarea', function() {
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-input span').html('<em>' + curName + '<a href="#"></a></em>');
        } else {
            curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
        }
    });

    $('body').on('click', '.form-file-input span em a', function(e) {
        var curField = $(this).parents().filter('.form-file');
        curField.find('input').val('');
        curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    function popupCenter(url, title) {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (480 / 2)) + dualScreenLeft;
        var top = ((height / 3) - (360 / 3)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + 480 + ', height=' + 360 + ', top=' + top + ', left=' + left);
        if (window.focus) {
            newWindow.focus();
        }
    }

    $('body').on('click', '.news-detail-social-fb', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://www.facebook.com/sharer/sharer.php?u=' + curUrl, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.news-detail-social-twitter', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('http://twitter.com/share?text=' + curTitle + '&url=' + curUrl + '&counturl=' + curUrl, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.news-detail-social-vk', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://vk.com/share.php?url=' + curUrl + '&description=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('.news-header-filter select').change(function() {
        $('.news-header-filter form').trigger('submit');
    });

    $('.faq-group-title').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $('.news-header-filter-link').click(function(e) {
        $('.news-header').toggleClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.text-with-hint-link', function(e) {
        var curBlock = $(this).parent();
        if (curBlock.hasClass('open')) {
            curBlock.removeClass('open');
        } else {
            $('.text-with-hint.open').removeClass('open');
            curBlock.removeClass('to-right');
            curBlock.addClass('open');
            var curPopup = curBlock.find('.text-with-hint-popup');
            if (curPopup.offset().left + curPopup.outerWidth() > $(window).width()) {
                curBlock.addClass('to-right');
            }
        }
        e.preventDefault();
    });

    $('body').on('click', '.text-with-hint-popup-close', function(e) {
        $('.text-with-hint.open').removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.text-with-hint').length == 0) {
            $('.text-with-hint.open').removeClass('open');
        }
    });

    $('.new-tabs').each(function() {
        var curTabs = $(this);
        var curTabsMenu = curTabs.find('> .new-tabs-menu');
        var curTabsContainer = curTabs.find('> .new-tabs-container');
        var newHTML = '';
        curTabsContainer.find('> .new-tabs-content').each(function() {
            var curTabTitle = $(this).find('> .new-tabs-content-title').text();
            newHTML += '<div class="new-tabs-menu-item"><a href="#">' + curTabTitle + '</a></div> ';
        });
        curTabsContainer.find('> .new-tabs-content').eq(0).addClass('active');
        curTabsMenu.html(newHTML);
        curTabsMenu.find('.new-tabs-menu-item').eq(0).addClass('active');
    });

    $('body').on('click', '.new-tabs-menu-item a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curTabs = curLi.parents().filter('.new-tabs');
            curTabs.find('.new-tabs-menu-item.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = curTabs.find('.new-tabs-menu-item').index(curLi);
            curTabs.find('.new-tabs-content.active').removeClass('active');
            curTabs.find('.new-tabs-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('body').on('click', '.new-tabs-content-title', function(e) {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', '.centers-item-more a', function(e) {
        $(this).parent().parent().toggleClass('more-open');
        e.preventDefault();
    });

    $('.header-search-link').click(function(e) {
        $('html').addClass('search-window-open');
        $('.search-window-form-input input').trigger('focus');
        e.preventDefault();
    });

    $('.search-window-close').click(function(e) {
        $('html').removeClass('search-window-open');
        e.preventDefault();
    });

    $('body').on('click', '.search-window-bg', function(e) {
        $('html').removeClass('search-window-open');
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            $('html').removeClass('search-window-open');
        }
    });

    $('.search-window-form-back a').click(function(e) {
        $('html').removeClass('search-window-open');
        e.preventDefault();
    });

    $('.header-cabinet-link').click(function(e) {
        if ($(window).width() < 1200 && $('.header-cabinet-menu').length > 0) {
            $('html').addClass('header-cabinet-open');
            e.preventDefault();
        }
    });

    $('.header-cabinet-back a').click(function(e) {
        $('html').removeClass('header-cabinet-open');
        e.preventDefault();
    });

    $('.nav ul li').each(function() {
        if ($(this).find('ul').length > 0) {
            $(this).addClass('with-submenu');
            $(this).find('ul').prepend('<li class="nav-back-link"><a href="#">' + $(this).find('> a').html() + '</a></li>');
        }
    });

    $('.nav ul li a').click(function(e) {
        if ($(window).width() < 1200) {
            var curLI = $(this).parent();
            if (curLI.find('ul').length > 0) {
                curLI.toggleClass('open');
                e.preventDefault();
            }
        }
    });

    $('body').on('click', '.nav ul li ul li.nav-back-link a', function(e) {
        $(this).parent().parent().parent().removeClass('open');
        e.preventDefault();
    });

    $('.header-mobile-menu').html($('.top-menu').html());

    $('.main-map-filter-link').click(function(e) {
        $('html').toggleClass('main-map-filter-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.main-map-filter').length == 0) {
            $('html').removeClass('main-map-filter-open');
        }
    });

    $('.main-map-filter-window input').change(function() {
        updateMainMapFilter();
    });

    $('body').on('click', '.main-map-filter-params-item a', function(e) {
        var curValue = $(this).parent().attr('data-value');
        $('.main-map-filter-window input[value="' + curValue + '"]').prop('checked', false);
        updateMainMapFilter();
        e.preventDefault();
    });

    if ($('.faq').length > 0) {
        if (window.location.hash != '') {
            var curID = window.location.hash.replace('#', '');
            $('.main-faq-item[data-id="' + curID + '"]').each(function() {
                var curItem = $(this);
                curItem.addClass('open');
                curItem.find('.main-faq-item-text').show();
                curItem.parents().filter('.faq').addClass('open');
                if ($(window).width() > 1199) {
                    $('html, body').animate({'scrollTop': curItem.offset().top - 60});
                } else {
                    $('html, body').animate({'scrollTop': curItem.offset().top - $('header').height()});
                }
            });
        }
    }

    if ($('.new-tabs').length > 0) {
        if (window.location.hash != '') {
            var curID = window.location.hash.replace('#', '');
            $('.new-tabs-content[data-id="' + curID + '"]').each(function() {
                var curItem = $(this);
                var curTabs = curItem.parents().filter('.new-tabs');
                var curIndex = curTabs.find('.new-tabs-content').index(curItem);
                curTabs.find('.new-tabs-menu-item a').eq(curIndex).trigger('click');
            });

            $('.centers-item[data-id="' + curID + '"]').each(function() {
                var curItem = $(this);
                var curTab = curItem.parents().filter('.new-tabs-content');
                var curTabs = curTab.parents().filter('.new-tabs');
                var curIndex = curTabs.find('.new-tabs-content').index(curTab);
                curTabs.find('.new-tabs-menu-item a').eq(curIndex).trigger('click');
                curTab.addClass('open');
                $('html, body').animate({'scrollTop': curItem.offset().top - $('header').height()});
            });
        }
    }

    $('.nav ul li ul li a').click(function(e) {
        var curID = this.hash.replace('#', '');
        if ($('.new-tabs-content[data-id="' + curID + '"]').length == 1) {
            $('.new-tabs-content[data-id="' + curID + '"]').each(function() {
                var curItem = $(this);
                var curTabs = curItem.parents().filter('.new-tabs');
                var curIndex = curTabs.find('.new-tabs-content').index(curItem);
                curTabs.find('.new-tabs-menu-item a').eq(curIndex).trigger('click');
            });
            e.preventDefault();
        }
    });

    $('body').on('click', '.form-select-with-colors-current', function() {
        var curSelect = $(this).parent();
        if (curSelect.hasClass('open')) {
            curSelect.removeClass('open');
        } else {
            $('.form-select-with-colors.open').removeClass('open');
            curSelect.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.form-select-with-colors').length == 0) {
            $('.form-select-with-colors.open').removeClass('open');
        }
    });

    $('body').on('change', '.form-select-with-colors-item input', function() {
        var curInput = $(this);
        var curSelect = curInput.parents().filter('.form-select-with-colors');
        curSelect.find('.form-select-with-colors-current').removeClass('default');
        curSelect.find('.form-select-with-colors-current').html(curInput.parent().find('span').html());
        curSelect.removeClass('open');
        $('.news-header-filter form').trigger('submit');
    });

    $('.form-select-with-colors-item input:checked').each(function() {
        var curInput = $(this);
        var curSelect = curInput.parents().filter('.form-select-with-colors');
        curSelect.find('.form-select-with-colors-current').removeClass('default');
        curSelect.find('.form-select-with-colors-current').html(curInput.parent().find('span').html());
    });

});

function drawMainMap() {
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

        var isFilter = false;
        if ($('.main-map-filter-window input:checked').length == 0) {
            isFilter = true;
        } else {
            if ($('.main-map-filter-window input[value="math"]').prop('checked') && curCity.math > 0) {
                isFilter = true;
            }
            if ($('.main-map-filter-window input[value="genom"]').prop('checked') && curCity.genom > 0) {
                isFilter = true;
            }
            if ($('.main-map-filter-window input[value="ntr"]').prop('checked') && curCity.ntr > 0) {
                isFilter = true;
            }
            if ($('.main-map-filter-window input[value="nomc"]').prop('checked') && curCity.nomc > 0) {
                isFilter = true;
            }
        }

        if (isFilter) {
            newHints += '<a href="' + curCity.link + '" class="window-link main-map-item" style="left:' + (curCity.coords[0] / 1108 * 100) + '%; top:' + (curCity.coords[1] / 630 * 100) + '%">' +
                            '<div class="main-map-item-icon"></div>' +
                            '<div class="main-map-item-window">' +
                                '<div class="main-map-item-window-title">' + curCity.title + '</div>' +
                                '<div class="main-map-item-window-info">';

            newHints +=             '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-1.svg" alt="" width="22" height="22" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.math + '</div>' +
                                        '</div>' +
                                    '</div>';

            newHints +=             '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-2.svg" alt="" width="21" height="20" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.genom + '</div>' +
                                        '</div>' +
                                    '</div>';

            newHints +=             '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-3.svg" alt="" width="19" height="22" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.ntr + '</div>' +
                                        '</div>' +
                                    '</div>';

            newHints +=             '<div class="main-map-item-window-info-item">' +
                                        '<div class="main-map-item-window-info-item-inner">' +
                                            '<div class="main-map-item-window-info-icon"><img src="' + pathTemplate + 'images/main-about-types-4.svg" alt="" width="24" height="24" /></div>' +
                                            '<div class="main-map-item-window-info-text">' + curCity.nomc + '</div>' +
                                        '</div>' +
                                    '</div>';

            newHints +=         '</div>' +
                            '</div>' +
                        '</a>';
        }
    }
    $('.main-map-content svg').html(newMap);
    $('.main-map-content').append(newHints);
}

function updateMainMapFilter() {
    var newHTML = '';

    $('.main-map-filter-window input:checked').each(function() {
        newHTML += '<div class="main-map-filter-params-item" data-value="' + $(this).attr('value') + '">' + $(this).parent().find('span').html() + '<a href="#"></a></div>';
    });

    $('.main-map-filter-params-inner').html(newHTML);

    drawMainMap();
}

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

        $('.window form').each(function() {
            initForm($(this));
        });

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

function initForm(curForm) {
    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('.form-input input:focus, .form-input textarea:focus').each(function() {
        $(this).trigger('focus');
    });

    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
    });

    curForm.find('.form-input-date input').mask('00.00.0000');
    curForm.find('.form-input-date input').attr('autocomplete', 'off');
    curForm.find('.form-input-date input').addClass('inputDate');

    curForm.find('.form-input-date input').on('keyup', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var isCorrectDate = true;
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            } else {
                $(this).addClass('error');
                return false;
            }
        }
    });

    curForm.find('.form-input-date input').each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        if ($(this).hasClass('maxDate1Year')) {
            var curDate = new Date();
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setDate(curDate.getDate() - 1);
            maxDate = curDate;
            var maxDay = curDate.getDate();
            if (maxDay < 10) {
                maxDay = '0' + maxDay
            }
            var maxMonth = curDate.getMonth() + 1;
            if (maxMonth < 10) {
                maxMonth = '0' + maxMonth
            }
            $(this).attr('max', maxDay + '.' + maxMonth + '.' + curDate.getFullYear());
        }
        var startDate = new Date();
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
            }
        }
        $(this).datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            toggleSelected: false
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }

        if ($(window).width() > 1119) {
            options['dropdownAutoWidth'] = true;
        }

        curSelect.select2(options);

        curSelect.parent().find('.select2-container').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.parent().find('.select2-selection').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.on('select2:select', function(e) {
            $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
            if (typeof curSelect.attr('multiple') !== 'undefined') {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full-multiple');
            }
            curSelect.parent().find('select.error').removeClass('error');
            curSelect.parent().find('label.error').remove();
        });

        curSelect.on('select2:unselect', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                curSelect.parent().find('.select2-container').removeClass('select2-container--full select2-container--full-multiple');
            }
        });

        if (curSelect.val() != '' && curSelect.val() !== null) {
            curSelect.trigger({type: 'select2:select'})
            curSelect.parent().find('.select2-container').addClass('select2-container--full');
            if (typeof curSelect.attr('multiple') !== 'undefined') {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full-multiple');
            }
        }
    });

    var curFormOptions = {
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('ajax-form')) {
                curForm.addClass('loading');
                var formData = new FormData(form);

                if (curForm.find('[type=file]').length != 0) {
                    var file = curForm.find('[type=file]')[0].files[0];
                    formData.append('file', file);
                }

                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'html',
                    data: formData,
                    cache: false
                }).done(function(html) {
                    curForm.html(html);
                    initForm(curForm);
                    curForm.removeClass('loading');
                });
            } else if (curForm.hasClass('window-form')) {
                var formData = new FormData(form);

                if (curForm.find('[type=file]').length != 0) {
                    var file = curForm.find('[type=file]')[0].files[0];
                    formData.append('file', file);
                }

                windowOpen(curForm.attr('action'), formData);
            } else {
                form.submit();
            }
        }
    };

    curForm.validate(curFormOptions);
}

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if ($('.up-link').length == 1) {
        if (windowScroll > windowHeight / 2) {
            $('.up-link').addClass('visible');
        } else {
            $('.up-link').removeClass('visible');
        }

        if (windowScroll + windowHeight > $('footer').offset().top) {
            $('.up-link').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top});
        } else {
            $('.up-link').css({'margin-bottom': 0});
        }
    }

    if (windowScroll > 218) {
        $('html').addClass('header-fixed');
    } else {
        $('html').removeClass('header-fixed');
    }

    if ($(window).width() > 1199) {
        $('.new-tabs-content.active').each(function() {
            var curTab = $(this);
            curTab.find('.centers-item').each(function() {
                var curItem = $(this);
                if (windowScroll > curItem.offset().top - $('header').outerHeight()) {
                    if (curItem.height() > curItem.find('.centers-item-info').height()) {
                        if (windowScroll - (curItem.offset().top - $('header').outerHeight()) + curItem.find('.centers-item-info').height() < curItem.height()) {
                            curItem.find('.centers-item-info').css({'margin-top': (windowScroll - (curItem.offset().top - $('header').outerHeight()))});
                        } else {
                            curItem.find('.centers-item-info').css({'margin-top': curItem.height() - curItem.find('.centers-item-info').height()});
                        }
                    } else {
                        curItem.find('.centers-item-info').css({'margin-top': '0'});
                    }
                } else {
                    curItem.find('.centers-item-info').css({'margin-top': '0'});
                }
            });
        });
    } else {
        $('.centers-item-info').css({'margin-top': '0'});
    }
});

$(window).on('load resize', function() {
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if ($('.table-scroll').length > 0) {
        if ($(window).width() < 1200) {
            $('.table-scroll').mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        } else {
            if ($('.table-scroll').length > 0) {
                $('.table-scroll').mCustomScrollbar('destroy');
            }
        }
    }
});