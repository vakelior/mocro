<?php
/**
 * Header template.
 *
 * @package MOCRO
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="profile" href="https://gmpg.org/xfn/11" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="screen-reader-text" href="#mocro-content"><?php esc_html_e( 'Skip to content', 'mocro' ); ?></a>

<header class="mocro-header">
	<div class="mocro-container mocro-header__inner">

		<div class="mocro-brand">
			<?php if ( has_custom_logo() ) : ?>
				<div class="mocro-logo"><?php the_custom_logo(); ?></div>
			<?php else : ?>
				<a class="mocro-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<?php bloginfo( 'name' ); ?><span class="mocro-logo__dot"></span>
				</a>
			<?php endif; ?>
		</div>

		<button class="mocro-nav-toggle" aria-controls="primary-menu" aria-expanded="false" data-nav-toggle>
			<i data-lucide="menu"></i>
			<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'mocro' ); ?></span>
		</button>

		<nav class="mocro-nav" id="primary-menu" data-nav>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'mocro-nav__list',
					'fallback_cb'    => 'mocro_primary_menu_fallback',
				)
			);
			?>
		</nav>

	</div>
</header>

<main id="mocro-content" class="mocro-main">
