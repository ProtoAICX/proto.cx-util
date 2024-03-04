!function() {
  const video_wrapper = $('.product-demo_video-container');

  var WindowWidth = $(window).width();

  const video_mobile = '<video id="demo-video" autoplay loop muted playsinline controlsList="nodownload" disablePictureInPicture style="position:absolute; width:100%; height:100%; z-index: 1;"> <source src="https://www.dropbox.com/scl/fi/ocmxadh0zbgogdykqjpf7/product-demo-mobile.mp4?rlkey=rpyqw7oi42q59sjlh3x84wlo9&raw=1&autoplay=1" type="video/mp4"> </video>';
  const video_desktop = '<video id="demo-video" autoplay loop muted playsinline controlsList="nodownload" disablePictureInPicture style="position:absolute; width:100%; height:100%; z-index: 1;"> <source src="https://www.dropbox.com/scl/fi/xh2w4sac6m122sghkn2pj/product-demo-desktop.mp4?rlkey=hiryv25kb3n6xcg1y2m9fwjkk&raw=1&autoplay=1" type="video/mp4"> </video>';

  if (WindowWidth < 479) {
    video_wrapper.append(video_mobile);
  } else {
    video_wrapper.append(video_desktop);
  }

  var video_toggle = document.getElementById("product-demo-controls");
  var video_fullscreen = document.getElementById("product-demo-fullscreen");
  var video = document.getElementById("demo-video");

  video_toggle.addEventListener("click", toggleControls);
  video_fullscreen.addEventListener("click", toggleFullscreen);

  function toggleControls() {
    if (video.hasAttribute("controls")) {
      video.removeAttribute("controls")   
    } else {
      video.setAttribute("controls","controls")   
    }
  }

  function toggleFullscreen() {
    if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }  else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }  else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }  
  }

};
