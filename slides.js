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
    var $slide = $(window.location.hash);
    gotoSlide($slide.length > 0 ? $slide : 0, true);
  }

  function exitSlideMode() {
    slideMode = false;
    $(".slide").removeClass("hidden", "fast");
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
    $slides.not($slide).addClass("hidden", "fast");
    $slide.removeClass("hidden", "fast");
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
    window.setTimeout(function() {
      moving = false;
    }, 10);
  }

  function findClosestSlide() {
    var $closest;
    var scrollTop = $("body").scrollTop();
    $slides.each(function() {
      var $slide = $(this);
      if (!$closest || $slide.position().top < scrollTop) {
        $closest = $slide;
      }
    });
    return $closest;
  }

  $(document).on("keydown", function(e) {

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

  })
  .on("scroll", function(e) {
    if (!slideMode || moving) {
      return;
    }
    var $closestSlide = findClosestSlide();
    if ($closestSlide.attr("id") !== $slides.eq(slide).attr("id")) {
      gotoSlide($closestSlide);
    }
  });

});