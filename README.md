# Preloader.js

Simple jquery plugin for preloading images.

## Usage 
Clone the repo and move the preloader.gif image into your assets directory.
Copy the following snippet to your css file: 
    
    .preloader { 
      background: url(preloader.gif) center center no-repeat #fff;
      display: inline-block;
    }


To instantiate, call .preload() on any jQuery wrapped DOM node.
For example, given the following HTML: 

    <div id='gallery'>
      <img src="sweet-img1.jpg"/>
      <img src="sweet-img2.jpg"/>
      <img src="sweet-img3.jpg"/>
      <img src="sweet-img4.jpg"/>
      <img src="sweet-img5.jpg"/>
      <img src="sweet-img6.jpg"/>
      <img src="sweet-img7.jpg"/>
    </div>
    
    <script>
      $(document).ready(function() {    
        $('#gallery').preload();
      });
    </script>

##Options

The preloader provides several defaults related to the timing of image fade-ins and
the frequency with which the plugin checks for images that have finished loading.

To overwrite the defaults, simply pass the options you wish to overwrite in an object when
instantiating the plugin.

The following defaults can be overwritten: 

        $('#gallery').preload({
          fadeDelayTime:     350,
          checkLoadedStatus: 300,
          fadeIn:            600,
          onDone:            function() {},
          onEachLoad:        function() {}
       });

**fadeDelayTime:** Represents the base amount of time (in milliseconds) in between each image being show. 
It increases cumulatively as each photo is loaded.  For example, given a base time of 350ms and three images,
The images will fade in after delays of 350ms, 700ms, and 1050ms, respectively. 

**checkLoadedStatus:** Interval (in milliseconds) at which the plugin will check to see if an image has been loaded.

**fadeIn:** Speed at which the image will fade in.

**onDone:** Callback function that executes when all images have been loaded.

**onEachLoad:** Callback function that shows the image and removes the preloader icon on image load.  
Triggers the "image:loaded" event and passes a reference to the loaded image.  Be careful when overriding this function!
