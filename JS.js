$( "<a href='#' class='top-menu-link'>&#9776;</a><a href='#menu' class='left-menu-link'><i class='fa fa-chevron-right'></i></a><div class='footer-menu-link'><i class='fa fa-chevron-up'></i></div>" ).insertBefore( "#wrapper" );
$(document).ready(function() {
	$('.left-menu-link').bigSlide();
	$('.left-links').addClass("panel");
	$('left-links').attr('id', 'menu');

});
$(".links").hide();
$(".footer-bar").hide();

#top 
$(".top-menu-link").click(function(){
	$(".links").toggle();
})

$(".footer-menu-link").click(function(){
	$(".footer-menu-link").hide();
	$(".footer-bar").toggle();
})

$("#main-content,#right-nav,#wrapper").mouseup(function(){
	$(".footer-bar").hide();
	$(".footer-menu-link").show();
});

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  'use strict';

  function _cleanInlineCSS(inlineCSS, toRemove){
    var inlineCSSArray  = inlineCSS.split(';');
    var toRemoveArray   = toRemove.split(' ');

    var cleaned         = '';
    var keep;

    for (var i = 0, j = inlineCSSArray.length; i < j; i++) {
      keep = true;
      for (var a = 0, b = toRemoveArray.length; a < b; a++) {
        if (inlineCSSArray[i] === '' || inlineCSSArray[i].indexOf(toRemoveArray[a]) !== -1) {
          keep = false;
        }
      }
      if(keep) {cleaned += inlineCSSArray[i] + '; ';}
    }

    return cleaned;
  }


  $.fn.bigSlide = function(options) {
    // store the menuLink in a way that is globally accessible
    var menuLink = this;

    // plugin settings
    var settings = $.extend({
      'menu': ('.left-links'),
      'push': ('.push'),
      'side': 'left',
      'menuWidth': '15.625em',
      'speed': '300',
      'state': 'closed',
      'activeBtn': 'active',
      'easyClose': true,
      'beforeOpen': function () {},
      'afterOpen': function() {},
      'beforeClose': function() {},
      'afterClose': function() {}
    }, options);

    var baseCSSDictionary = 'transition -o-transition -ms-transition -moz-transitions webkit-transition ' + settings.side;

    var model = {
      menuCSSDictionary: baseCSSDictionary + ' position top bottom height width',
      pushCSSDictionary: baseCSSDictionary,
      'state': settings.state
    };

    var controller = {
      init: function(){
        view.init();
      },

      // remove bigSlide behavior from the menu
      _destroy: function(){
        view._destroy();

        delete menuLink.bigSlideAPI;

        return menuLink;
      },

      // update the menu's state
      changeState: function(){
        if (model.state === 'closed') {
          model.state = 'open'
        } else {
          model.state = 'closed'
        }
      },

      // check the menu's state
      getState: function(){
        return model.state;
      }
    };

    var view = {
      init: function(){
        // cache DOM values
        this.$menu = $(settings.menu);
        this.$push = $(settings.push);
        this.width = settings.menuWidth;

        // CSS for how the menu will be positioned off screen
        var positionOffScreen = {
          'position': 'fixed',
          'top': '0',
          'bottom': '0',
          'height': '100%'
        };

        // manually add the settings values
        positionOffScreen[settings.side] = '-' + settings.menuWidth;
        positionOffScreen.width = settings.menuWidth;

        // add the css values to position things offscreen
        if (settings.state === 'closed') {
          this.$menu.css(positionOffScreen);
          this.$push.css(settings.side, '0');
        }

        // css for the sliding animation
        var animateSlide = {
          '-webkit-transition': settings.side + ' ' + settings.speed + 'ms ease',
          '-moz-transition': settings.side + ' ' + settings.speed + 'ms ease',
          '-ms-transition': settings.side + ' ' + settings.speed + 'ms ease',
          '-o-transition': settings.side + ' ' + settings.speed + 'ms ease',
          'transition': settings.side + ' ' + settings.speed + 'ms ease'
        };

        // add the animation css
        this.$menu.css(animateSlide);
        this.$push.css(animateSlide);

        // register a click listener for desktop & touchstart for mobile
        menuLink.on('click.bigSlide touchstart.bigSlide', function(e) {
          e.preventDefault();
          if (controller.getState() === 'open') {
            view.toggleClose();
          } else {
            view.toggleOpen();
          }
        });

        // this makes my eyes bleed, but adding it back in as it's a highly requested feature
        if (settings.easyClose) {
          $(document).on('click.bigSlide', function(e) {
           if (!$(e.target).parents().andSelf().is(menuLink) && !$(e.target).closest(settings.menu).length && controller.getState() === 'open')  {
             view.toggleClose();
           }	  
		   
          });
        }
      },

      _destroy: function(){
        this.$menu.each(function(){
          var $this = $(this);
          $this.attr( 'style', _cleanInlineCSS($this.attr('style'), model.menuCSSDictionary).trim() );
        });

        this.$push.each(function(){
          var $this = $(this);
          $this.attr( 'style', _cleanInlineCSS($this.attr('style'), model.pushCSSDictionary).trim() );
        });

        menuLink
          .removeClass(settings.activeBtn)
          .off('click.bigSlide touchstart.bigSlide');

        //release DOM references to avoid memory leaks
        this.$menu = null;
        this.$push = null;
      },

      // toggle the menu open
      toggleOpen: function() {
        settings.beforeOpen();
        controller.changeState();
        this.$menu.css(settings.side, '0');
        this.$push.css(settings.side, this.width);
        menuLink.addClass(settings.activeBtn);
        settings.afterOpen();
		$(".left-menu-link").hide();
      },

      // toggle the menu closed
      toggleClose: function() {
		  
        settings.beforeClose();
        controller.changeState();
        this.$menu.css(settings.side, '-' + this.width);
        this.$push.css(settings.side, '0');
        menuLink.removeClass(settings.activeBtn);
        settings.afterClose();
		$(".left-menu-link").show();
		
      }

    }

    controller.init();

    this.bigSlideAPI = {
      settings: settings,
      model: model,
      controller: controller,
      view: view,
      destroy: controller._destroy
    };

    return this;
  };

}));
