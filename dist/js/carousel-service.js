document.addEventListener('DOMContentLoaded', function() {
  // Check if carousel exists first
  const carousel = document.querySelector('.carousel');
  if (!carousel) return; // Exit if carousel doesn't exist

  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  // Exit if no slides found
  if (!slides.length) return;

  const nextButton = document.querySelector('.nav-button.next');
  const prevButton = document.querySelector('.nav-button.prev');
  const expandButtons = document.querySelectorAll('.expand-btn');
  const closeButtons = document.querySelectorAll('.close-btn');

  // Hide all hover content initially
  const allHoverContent = document.querySelectorAll('.hover-content');
  allHoverContent.forEach(content => {
    content.style.display = 'none';
  });
  
  let currentIndex = 0;
  let slideWidth = slides[0].getBoundingClientRect().width;
  let slidesToShow = 3;
  let isMobile = false;

  // Responsive slidesToShow
  function updateSlidesToShow() {
    if (window.innerWidth <= 480) {
      slidesToShow = 1.5; // Keep the 1.5 slides view for visual effect
      isMobile = true;
    } else if (window.innerWidth <= 1024) {
      slidesToShow = 2;
      isMobile = false;
    } else {
      slidesToShow = 3;
      isMobile = false;
    }
    slideWidth = slides[0].getBoundingClientRect().width;
    updateSlidePosition();
    updateButtonState();
  }

  function updateSlidePosition() {
    // Special handling for the last slide
    if (isMobile && currentIndex >= slides.length - 1) {
      // For the last slide, adjust position to show it fully
      const offset = slides.length - slidesToShow;
      carousel.style.transform = `translateX(-${offset * slideWidth}px)`;
    } else {
      carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  }

  function updateButtonState() {
    if (prevButton) {
      prevButton.disabled = currentIndex <= 0;
    }
    
    if (nextButton) {
      nextButton.disabled = currentIndex >= slides.length - 1;
    }
  }

  // Navigation
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlidePosition();
        updateButtonState();
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlidePosition();
        updateButtonState();
      }
    });
  }

  // Expand/Close handlers
  expandButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const slide = e.target.closest('.carousel-slide');
      const hoverContent = slide.querySelector('.hover-content');
      hoverContent.style.display = 'flex';
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const slide = e.target.closest('.carousel-slide');
      const hoverContent = slide.querySelector('.hover-content');
      hoverContent.style.display = 'none';
    });
  });

  // Touch/Drag functionality
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  carousel.addEventListener('mousedown', dragStart, { passive: false });
  carousel.addEventListener('touchstart', dragStart, { passive: true });
  carousel.addEventListener('mouseup', dragEnd, { passive: true });
  carousel.addEventListener('touchend', dragEnd, { passive: true });
  carousel.addEventListener('mousemove', drag, { passive: false });
  carousel.addEventListener('touchmove', drag, { passive: false }); 
  carousel.addEventListener('mouseleave', dragEnd, { passive: true });

  function dragStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    prevTranslate = currentTranslate;
  }

  function drag(e) {
    if (!isDragging) return;
    
    if (e.type.includes('mouse')) {
      e.preventDefault();
    } else if (e.cancelable) {
      e.preventDefault();
    }
    
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > slideWidth / 3) {
      if (movedBy < 0 && currentIndex < slides.length - 1) {
        // Moving forward
        currentIndex++;
      } else if (movedBy > 0 && currentIndex > 0) {
        // Moving backward
        currentIndex--;
      }
    }
    
    updateSlidePosition();
    updateButtonState();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Responsive handling
  window.addEventListener('resize', updateSlidesToShow, { passive: true });
  
  // Initialize carousel
  updateSlidesToShow();
});
