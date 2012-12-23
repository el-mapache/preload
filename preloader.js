(function($) {
  $.fn.preloader = function(opts) {
    return this.each(function() {
      var $this = $(this),
          data = $this.data('preloader'),
          options = typeof opts == "object" && opts;

      if(!data) {
        $this.data('preloader',(data = new Preloader(this,options)));
      }
    }); 
  };
  
  $.fn.preloader.Contructor = Preloader; 

  var preloader = $.fn.preloader.defaults = {
    fadeDelayTime:     350,
    checkLoadedStatus: 300,
    fadeIn:            600,
    onDone: function() {},
    onEachLoad: function(image, delay, fadeIn) {
      $(image).css({visibility: "visible"})
              .delay(delay)
              .animate({opacity: 1}, fadeIn,'linear', function() {
                $(this).parents().removeClass('preloader');
              });
      $(image).trigger('image:loaded', {image: image });
    }
  };

  function Preloader(element,options) {
    this.el = element;
    this.$el = $(element);  
    this.images = [];
    this.isLoaded = [];
    this.settings = $.extend({},preloader,options);

    this._setUp();
  }
  
  Preloader.prototype = {
    Constructor: Preloader,
    
    _updateNodes: function(element) {
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
        var reInsert = this._updateNodes(this.el);

        for(ii; ii < length; ii++) {
          this._setImageStyle(images[ii])
          this.images[ii] = images[ii];
        }

        reInsert();
      } else {
        this._setImageStyle(images[0]);
      }
      
      return this.images;
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
      
      icon.src = "preloader.gif";
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
      var images = this.images, delay = this.settings.fadeDelayTime,
          timer, isLoaded = this.isLoaded, self = this;

      function imagePreloaded() {
        var ii = 0, length = images.length;

        if(length === 0) {
          clearInterval(timer);
          self.settings.onDone.call(self);
          return self.el;
        }
        
        for(ii; ii < length; ii++) {
          if(images[ii] !== undefined && images[ii].complete === true) {
            if(isLoaded[ii] === false) {
              isLoaded[ii] = true
              isLoaded.splice(ii,1)
              // Global delay setting in case each image gets a plugin attached
              self.settings.fadeDelayTime += delay;
            }

            self.settings.onEachLoad(images[ii],self.settings.fadeDelayTime,self.settings.fadeIn);
            images.splice(ii,1);
          }
        }
      }

      timer = setInterval(function() {
        imagePreloaded.call(self);
      },this.settings.checkLoadedStatus);
    }
  };

}(window.jQuery));
