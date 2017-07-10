Modernizr.load({
    load:   [
        'core/plugins/reset.css',
        'core/plugins/fancybox/jquery.fancybox.css',
        'core/plugins/countdown/jquery.countdown.css',
        'core/main.css',
        'core/plugins/jquery-1.11.1.min.js',
        'core/plugins/fancybox/jquery.fancybox.pack.js',
        'core/plugins/countdown/jquery.plugin.min.js',
        'core/plugins/countdown/jquery.countdown.min.js',
        'core/plugins/countdown/jquery.countdown-ru.js',
        'core/plugins/scrollTo/jquery.scrollTo.min.js',
        'core/plugins/jquery.inputmask.js',
        'http://api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug" type="text/javascript'
    ],
    complete: function(){
        $(document).ready(function(){
            var myDevice = new checkDevice();
            initPopup();
            initTooltip();
            initTimer();
            initTriggerForm();
            initToTopBtn();
            initFakeSelect();
            initMask();
            
            var myMap;
            ymaps.ready(function () { 
                initMap();                  
            })
        });
    }
})

var checkDevice = function(){
    this.userDeviceArray = [
		{platform: 'Android', agent: /Android/},
		{platform: 'iPhone', agent: /iPhone/},
		{platform: 'iPad', agent: /iPad/},
		{platform: 'Symbian', agent: /Symbian/},
		{platform: 'Windows Phone', agent: /Windows Phone/},
		{platform: 'Tablet OS', agent: /Tablet OS/},
		{platform: 'Linux', agent: /Linux/},
		{platform: 'Windows', agent: /Windows NT/},
		{platform: 'Macintosh', agent: /Macintosh/}
	];
	this.useragent = navigator.userAgent;
	this.getPlatform = function(){
	   for (var i in this.userDeviceArray) {
			if (this.userDeviceArray[i].agent.test(this.useragent)) {
				return this.userDeviceArray[i].platform;
			}
		}
		return 'Unknown platform' + this.useragent;
	};
	this.getDevice = function(){
	    var result = this.getPlatform();
	    if (
	       result == 'Android' || 
	       result == 'iPhone' || 
	       result == 'iPad' || 
	       result == 'Symbian' || 
	       result == 'Windows Phone' || 
	       result == 'Tablet OS'
        ){
            return 'mobile';
		}
		if (
			result == 'Linux' || 
			result == 'Windows' || 
			result == 'Macintosh'
        ){
			return 'desktop';
		}
	};
}

function initPopup(){
    $('[data-popup="true"]').each(function(){
        var button = $(this);
        var target = $(button.attr('href'));
        var close = $('.js-close', target);
        var thisWidth = target.width();
        var thisHeight = target.height();
        
        target.hide();
        
        button.fancybox({
            padding: 0,
            autoSize: false,
            fitToView: false,
            scrolling: 'no',
            width: thisWidth,
            height: thisHeight
        });
        
        close.on('click', function(event){
            event.preventDefault();
            $.fancybox.close();
        })
    })
}
function initTooltip(){
    $('[data-tooltip="true"]').each(function(){
        var button = $(this);
        var target = button.attr('href');
        var context = button.parent();
        
        button.on('click', function(event){
            event.preventDefault;
            context.addClass('tooltip-show')
        });
        $(document).click(function(event){
           if( $(event.target).closest(target).length == 0 && $(event.target).attr('data-tooltip') != 'true'){
               context.removeClass('tooltip-show')
           }
        })
    });
    
}
function initTimer(){
    $('.js-timer').each(function(){
        var timer = $(this);
        var text = timer.attr('data-time');
        liftoffTime = new Date(text.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));
        timer.countdown(
            $.extend(
                {
                    until: liftoffTime, 
                    format: 'dHM',
                    padZeroes: true
                }, 
                $.countdown.regionalOptions['ru']
            )
        );
        
    })
}
function initTriggerForm(){
    var context = $('.js-trigger-container');
    var trigger = $('.js-trigger', context);
    var container = $('.js-show-container');
    
    trigger.each(function(){
        var current = $(this).attr('data-target');
        $(this).on('click', function(){
            if(current == 'show1'){
                container.removeClass('show2').addClass('show1');
            }
            if(current == 'show2'){
                container.removeClass('show1').addClass('show2');
            }
        })    
    })
}
function initToTopBtn(){
    $('.js-to-top').click(function(event){
        event.preventDefault();
        $('body').scrollTo( { top:0,left:0} , 800 );
    });  
}
function initFakeSelect(){
    $('.js-fake-select-container').each(function(){
        var context = $(this);
        var select =  $('.js-fake-select', context);
        var dropdown = $('.js-fake-select-dropdown', context);
        var option = $('.option', dropdown);
        var inputHidden = $('.js-select-input', context);
        
        select.on('click', function(){
            context.toggleClass('opened');
        })
        option.on('click', function(){
            option.removeClass('current');
            $(this).addClass('current');
            var value = $(this).children('span').html();
            $('span', select).html(value);
            inputHidden.val(value)
            context.toggleClass('opened');  
        })
    }) 
}
function initMask(){
    $('.js_phone_mask').inputmask({
        mask: '+7 ( 999 ) 999 - 99 - 99',
        clearMaskOnLostFocus: false
     });
}
function initMap(){
    myMap = new ymaps.Map('map', {
        zoom: 14,
        center: [55.666954, 37.913369],
        behaviors: ['default', 'scrollZoom'],
        controls: []
    });
        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="popover top">' +
                    '<div class="arrow"></div>' +
                    '<div class="popover-inner">' +
                        '$[[options.contentLayout observeSize minWidth=458 maxWidth=458 maxHeight=200]]' +
                    '</div>' +
                '</div>', {
                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.popover', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },
                clear: function () {
                    this._$element.find('.close')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },
                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }),

        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
                '<div class="popover-content">$[properties.balloonContent]</div>'
        ),
        myPlacemark = window.myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            balloonHeader: '<span>8 800</span> 000-00-00',
            balloonContent: 'Московская область, Люберцы,<br> Хлебозаводской пр., 9'
        }, {
            balloonShadow: false,
            balloonLayout: MyBalloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            balloonPanelMaxMapArea: 0
            // Не скрываем иконку при открытом балуне.
            // hideIconOnBalloonOpen: false,
            // И дополнительно смещаем балун, для открытия над иконкой.
            // balloonOffset: [3, -40]
        });

    myMap.geoObjects.add(myPlacemark);
    myPlacemark.balloon.open();
}