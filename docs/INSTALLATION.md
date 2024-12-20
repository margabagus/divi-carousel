# Installation Guide

## Using with WordPress and Divi Theme

### Method 1: Using CDN (Recommended)
Add this code to your Divi child theme's functions.php:

```php
function enqueue_carousel_assets() {
    wp_enqueue_style('carousel-service', 
        'https://cdn.jsdelivr.net/gh/margabagus/divi-carousel@v1.0.0/dist/css/carousel-service.min.css'
    );
    
    wp_enqueue_script('carousel-service', 
        'https://cdn.jsdelivr.net/gh/margabagus/divi-carousel@v1.0.0/dist/js/carousel-service.min.js', 
        array(), 
        null, 
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_carousel_assets');
```

### Method 2: Local Installation
1. Download the latest release
2. Copy the files from `dist/` to your child theme
3. Add the following to functions.php:

```php
function enqueue_local_carousel_assets() {
    wp_enqueue_style('carousel-service', 
        get_stylesheet_directory_uri() . '/assets/css/carousel-service.min.css');
    
    wp_enqueue_script('carousel-service', 
        get_stylesheet_directory_uri() . '/assets/js/carousel-service.min.js', 
        array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_local_carousel_assets');
```
