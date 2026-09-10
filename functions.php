<?php
/**
 * MOCRO theme functions and definitions.
 *
 * @package MOCRO
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MOCRO_VERSION', '1.0.0' );

/**
 * Theme setup.
 */
function mocro_setup() {
	// Translations.
	load_theme_textdomain( 'mocro', get_template_directory() . '/languages' );

	// Theme supports.
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style.css' );

	// Menus.
	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'mocro' ),
			'footer'  => __( 'Footer Menu', 'mocro' ),
		)
	);

	// Image sizes.
	add_image_size( 'mocro-card', 640, 480, true );
	add_image_size( 'mocro-hero', 1600, 900, true );
}
add_action( 'after_setup_theme', 'mocro_setup' );

/**
 * Content width.
 */
function mocro_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'mocro_content_width', 760 );
}
add_action( 'after_setup_theme', 'mocro_content_width', 0 );

/**
 * Enqueue scripts and styles.
 */
function mocro_scripts() {
	// Main stylesheet.
	wp_enqueue_style( 'mocro-style', get_stylesheet_uri(), array(), MOCRO_VERSION );

	// Google Fonts (Inter + JetBrains Mono).
	wp_enqueue_style(
		'mocro-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);

	// Lucide icons.
	wp_enqueue_script(
		'mocro-lucide',
		'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js',
		array(),
		MOCRO_VERSION,
		true
	);

	// Main JS.
	wp_enqueue_script( 'mocro-main', get_template_directory_uri() . '/assets/js/main.js', array( 'mocro-lucide' ), MOCRO_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'mocro_scripts' );

/**
 * Register widget areas.
 */
function mocro_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Sidebar', 'mocro' ),
			'id'            => 'sidebar-1',
			'description'   => __( 'Add widgets here.', 'mocro' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'mocro_widgets_init' );

/**
 * Body classes.
 */
function mocro_body_classes( $classes ) {
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}
	return $classes;
}
add_filter( 'body_class', 'mocro_body_classes' );

/**
 * Excerpt length.
 */
function mocro_excerpt_length( $length ) {
	return 24;
}
add_filter( 'excerpt_length', 'mocro_excerpt_length' );

/**
 * Excerpt "more" text.
 */
function mocro_excerpt_more( $more ) {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'mocro_excerpt_more' );

/**
 * Ensure Lucide icons are created on load.
 */
function mocro_lucide_init() {
	echo '<script type="text/javascript">if (window.lucide) { lucide.createIcons(); }</script>';
}
add_action( 'wp_footer', 'mocro_lucide_init', 99 );

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Template tags helpers.
 */
require get_template_directory() . '/inc/template-tags.php';
