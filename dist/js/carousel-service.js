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
  const carouselWrapper = document.querySelector('.carousel-wrapper');

  // Hide all hover content initially
  const allHoverContent = document.querySelectorAll('.hover-content');
  allHoverContent.forEach(content => {
    content.style.display = 'none';
  });
  
  let currentIndex = 0;
  let slideWidth = slides[0].getBoundingClientRect().width;
  let slidesToShow = 3;
  let gap = 20; // Default gap between slides
  
  // Calculate total slides that can be fully shown
  function calculateMaxIndex() {
    // For the last slide, we need to make sure it's fully visible
    return Math.max(0, slides.length - Math.floor(slidesToShow));
  }

  // Responsive slidesToShow
  function updateSlidesToShow() {
    if (window.innerWidth <= 480) {
      slidesToShow = 1.5; // Show 1.5 slides on mobile
      gap = 15; // Smaller gap on mobile
    } else if (window.innerWidth <= 1024) {
      slidesToShow = 2;
      gap = 15;
    } else {
      slidesToShow = 3;
      gap = 20;
    }
    
    slideWidth = slides[0].getBoundingClientRect().width;
    
    // Ensure current index is valid with new slidesToShow
    const maxIndex = calculateMaxIndex();
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    
    updateSlidePosition();
    updateButtonVisibility();
  }

  function updateSlidePosition() {
    // Special handling for last slide(s)
    if (currentIndex >= slides.length - Math.floor(slidesToShow)) {
      // Position to show the last slide completely
      const offset = slides.length - slidesToShow;
      carousel.style.transform = `translateX(-${offset * (slideWidth + gap)}px)`;
    } else {
      carousel.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
    }
  }

  function updateButtonVisibility() {
    if (prevButton) {
      prevButton.disabled = currentIndex <= 0;
      prevButton.style.opacity = currentIndex <= 0 ? "0.5" : "1";
    }
    
    if (nextButton) {
      const maxIndex = calculateMaxIndex();
      nextButton.disabled = currentIndex >= maxIndex;
      nextButton.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }

  // Navigation
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const maxIndex = calculateMaxIndex();
      currentIndex = Math.min(currentIndex + 1, maxIndex);
      updateSlidePosition();
      updateButtonVisibility();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      updateSlidePosition();
      updateButtonVisibility();
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
  window.addEventListener('mouseup', dragEnd, { passive: true });
  window.addEventListener('touchend', dragEnd, { passive: true });
  window.addEventListener('mousemove', drag, { passive: false });
  window.addEventListener('touchmove', drag, { passive: false }); 
  window.addEventListener('mouseleave', dragEnd, { passive: true });

  function dragStart(e) {
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    isDragging = true;
    startPos = getPositionX(e);
    
    // Get current transform value
    const transform = window.getComputedStyle(carousel).getPropertyValue('transform');
    if (transform !== 'none') {
      // Extract the translateX value
      const matrix = new DOMMatrix(transform);
      prevTranslate = matrix.m41; // Get the X translation
    } else {
      prevTranslate = 0;
    }
    
    currentTranslate = prevTranslate;
  }

  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
    
    // Apply transform
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > slideWidth / 3) {
      if (movedBy < 0) {
        // Moving to next slide
        const maxIndex = calculateMaxIndex();
        currentIndex = Math.min(currentIndex + 1, maxIndex);
      } else {
        // Moving to previous slide
        currentIndex = Math.max(currentIndex - 1, 0);
      }
    }
    
    updateSlidePosition();
    updateButtonVisibility();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  }

  // Add a resize observer for more reliable size updates
  const resizeObserver = new ResizeObserver(() => {
    updateSlidesToShow();
  });
  
  if (carouselWrapper) {
    resizeObserver.observe(carouselWrapper);
  }

  // Also keep the window resize handler
  window.addEventListener('resize', updateSlidesToShow, { passive: true });
  
  // Initialize carousel
  updateSlidesToShow();
});
