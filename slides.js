/*
Copyright © 2013 Greg Smith

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall
be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
*/
$(function() {

  var $slides = $(".slide");

  var i;
  var totalSlides;
  var slideMode = false;
  var slide;
  var totalSlides = $slides.length;
  var moving = false;

  for (i = 0; i < $slides.length; i++) {
    if (!$slides.eq(i).attr("id")) {
      $slides.eq(i).attr("id", "slide" + (i + 1));
    }
  } 

  function enterSlideMode() {
    slideMode = true;
    var $slide = findClosestSlide();
    $("body").css("margin-bottom", $(window).height() + "px");
    gotoSlide($slide);
    message("Slide Mode");
  }

  function exitSlideMode() {
    slideMode = false;
    $(".slide").removeClass("hidden", "fast");
    $("body").css("margin-bottom", "0px");
    message("Webpage Mode");
  }

  function gotoSlide(n, andPosition) {
    moving = true;
    if (n < 0 || n >= totalSlides) {
      return;
    }
    var $slide;
    if (typeof n !== "number") {
      $slide = n;
      n = $slide.index();
    }
    else {
      $slide = $slides.eq(n);
    }
    slide = n;
    $slides.not($slide).addClass("hidden");
    var id;
    if (andPosition) {
      window.location.hash = $slide.attr("id");
    }
    else {
      id = $slide.attr("id");
      $slide.attr("id", "please-be-patient");
      window.location.hash = id;
      $slide.attr("id", id);
    }
    $slide.removeClass("hidden", "fast", function() {
      moving = false;
    });
  }

  function findClosestSlide() {
    var $closest;
    var scrollTop = $(window).scrollTop();
    $slides.each(function() {
      var $slide = $(this);
      if (!$closest || $slide.position().top <
                       scrollTop + ($(window).height() / 2)) {
        $closest = $slide;
      }
    });
    return $closest;
  }

  function message(str) {
    var $msg = $("<div></div>", {
      "class": "message",
      text: str
    });
    $("body").prepend($msg);
    window.setTimeout(function() {
      $msg.addClass("hidden", "fast", "", function() {
        $msg.remove();
      });
    }, 200);
  }

  $(document).on("keydown", debounce(function(e) {

    // escape
    if (e.keyCode === 27) {
      if (!slideMode) {
        enterSlideMode();
      }
      else {
        exitSlideMode();
      }
    }

    // left
    else if (e.keyCode === 39) {
      if (slideMode) {
        gotoSlide(slide + 1, true);
      }
    }

    // right
    else if (e.keyCode === 37) {
      if (slideMode) {
        gotoSlide(slide - 1, true);
      }
    }

  }, 200))
  .on("scroll", debounce(function(e) {
    if (!slideMode || moving) {
      return;
    }
    var $closestSlide = findClosestSlide();
    if ($closestSlide.attr("id") !== $slides.eq(slide).attr("id")) {
      gotoSlide($closestSlide);
    }
  }));

  function debounce(func, threshold, execAsap) {
    var timeout;
    return function debounced () {
        var obj = this, args = arguments;
        function delayed () {
            if (!execAsap)
                func.apply(obj, args);
            timeout = null; 
        };
        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(obj, args);
        timeout = setTimeout(delayed, threshold || 100); 
    };
  }

});