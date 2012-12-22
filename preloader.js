(function($) {
  $.fn.preloader = function(opts) {
    return this.each(function() {
      var $this = $(this),
          data = $this.data('preloader'),
          options = typeof opts == "object" && opts;

      if(!data) {
        $this.data('preloader',(data = new Preloader(this,opts)));
      }
    }); 
  };
  
  $.fn.preloader.Contructor = Preloader; 

  var preloader = $.fn.preloader.defaults = {
    fadeDelayTime:     350,
    parentNode:        'div',
    checkLoadedStatus: 300,
    fadeIn:            600,

    onDone: function() {},

    onEachLoad: function(image, delay) {
      $(image).css({visibility: "visible"})
              .delay(delay)
              .animate({opacity: 1}, this.fadeIn,'linear', function() {
                $(this).parents().removeClass('preloader');
              });
      $(image).trigger('image:loaded', {image: image });
    }
  };

  function Preloader(element,options) {
    this.el = element;
    this.$el = $(element);  
    this.images = null;
    this.isLoaded = [];
    this.settings = $.extend({},preloader,options);

    this._setUp();
  }
  
  Preloader.prototype = {
    Constructor: Preloader,
    
    _updateTags: function(element) {
      var parentNode = $(element).parents().first()[0],
          nextSibling = $(element).next()[0];

      parentNode.removeChild(element);
      
      return function() {
        if(nextSibling) {
          parentNode.insertBefore(element,nextSibling);
        } else {
          parentNode.appendChild(element); 
        }
      };
    },

    _setImageStyle: function(img) {
       img.style.visibility = "hidden";
       img.style.opacity = "0";
    },

    _getImages: function() {
      var ii = 0,images,length;

      /* if the plugin is being defined on a per-image basis */
      if(this.el.tagName.toLowerCase() === 'img') {
        this._setImageStyle(this.el);

        return this.images = [this.el];
      }

      images = this.el.getElementsByTagName('img');
      length = images.length;
      
      if(images.length < 1) {
        return false;
      }

      /* Setting multiple image attributes will trigger a lot of reflows, 
         so we remove the parent el and add style out of the dom, 
         then re-insert the images' parent element */

      if(images.length > 1) {
        var reInsert = this._updateTags(this.el);

        for(ii; ii < length; ii++) {
          this._setImageStyle(images[ii])
        }

        reInsert();
      } else {
        this._setImageStyle(images[0]);
      }
      
      return this.images = images;
    },

    _wrapImages: function() {
      var ii = 0, images = this.images, length = images.length;

      for(ii; ii < length; ii++) {
        $(images[ii]).wrap("<a class='preloader'></a>");
        this.isLoaded[ii] = false;
      }
    },

    _createLoadingIcon: function() {
      var icon = document.createElement('img');
      
      icon.src = "89.gif";
      icon.style.display = "none";
      document.body.appendChild(icon);

      return icon;
    },
    
    _preloadLoadingIcon: function() {
      var timer, self = this,
          icon = this._createLoadingIcon();

      function loaded() {
        if(icon.complete === true) {
          clearInterval(timer);
  			  document.body.removeChild(icon);
          self._initialize();

          return;
  		  }
      }

      timer = setInterval(function() {           
        loaded.call(self);
      }, 50);

    },
    
    _setUp: function() {
      this._getImages();
      this._wrapImages();
      this._preloadLoadingIcon();
    },

    _initialize: function() {
      var ii = 0, images = this.images,
          length = images.length, delay = this.settings.fadeDelayTime,
          counter = 0, timer, isLoaded = this.isLoaded, self = this;

      function imagePreloaded() {
        if(counter >= isLoaded.length) {
          clearInterval(timer);
          self.settings.onDone();

          return self.el;
        }
        
        for(ii; ii < length; ii++) {
          if(images[ii].complete === true) {
            if(isLoaded[ii] === false) {
              isLoaded[ii] = true
              ++counter;
              // Global delay setting in case each image gets a plugin attached
              preloader.fadeDelayTime += delay;
            }

            self.settings.onEachLoad(images[ii],preloader.fadeDelayTime,self.settings.fadeIn);
          }
        }
      }

      timer = setInterval(function() {
        imagePreloaded.call(self);
      },this.settings.checkLoadedStatus);
    }
  };
}(window.jQuery));