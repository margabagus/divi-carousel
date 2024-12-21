document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.carousel');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextButton = document.querySelector('.nav-button.next');
  const prevButton = document.querySelector('.nav-button.prev');
  const expandButtons = document.querySelectorAll('.expand-btn');
  const closeButtons = document.querySelectorAll('.close-btn');
  
  let currentIndex = 0;
  let slideWidth = slides[0].getBoundingClientRect().width;
  let slidesToShow = 3;

  // Responsive slidesToShow
  function updateSlidesToShow() {
    if (window.innerWidth <= 480) {
      slidesToShow = 1.5;
    } else if (window.innerWidth <= 1024) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
    slideWidth = slides[0].getBoundingClientRect().width;
    updateSlidePosition();
  }

  function updateSlidePosition() {
    carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  // Navigation
  nextButton.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, slides.length - slidesToShow);
    updateSlidePosition();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateSlidePosition();
  });

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

  // Touch/Drag functionality dengan passive event listeners
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Menambahkan passive event listeners untuk touch events
  carousel.addEventListener('mousedown', dragStart, { passive: false });
  carousel.addEventListener('touchstart', dragStart, { passive: true });
  carousel.addEventListener('mouseup', dragEnd, { passive: true });
  carousel.addEventListener('touchend', dragEnd, { passive: true });
  carousel.addEventListener('mousemove', drag, { passive: false });
  carousel.addEventListener('touchmove', drag, { passive: false }); // Tidak bisa passive karena menggunakan preventDefault
  carousel.addEventListener('mouseleave', dragEnd, { passive: true });

  function dragStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    prevTranslate = currentTranslate;
  }

  function drag(e) {
    if (!isDragging) return;
    
    // Hanya mencegah default untuk mouse events atau ketika benar-benar diperlukan
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
      if (movedBy < 0) {
        currentIndex = Math.min(currentIndex + 1, slides.length - slidesToShow);
      } else {
        currentIndex = Math.max(currentIndex - 1, 0);
      }
    }
    
    updateSlidePosition();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Responsive handling dengan passive event listener
  window.addEventListener('resize', updateSlidesToShow, { passive: true });
  updateSlidesToShow();
});