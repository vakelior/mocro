<?php
/**
 * MOCRO template tags and helper functions.
 *
 * @package MOCRO
 */

/**
 * Fallback primary menu.
 */
function mocro_primary_menu_fallback() {
	echo '<ul class="mocro-nav__list">';
	echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'mocro' ) . '</a></li>';
	echo '<li><a href="' . esc_url( home_url( '/#services' ) ) . '">' . esc_html__( 'Services', 'mocro' ) . '</a></li>';
	echo '<li><a href="' . esc_url( home_url( '/#about' ) ) . '">' . esc_html__( 'About', 'mocro' ) . '</a></li>';
	echo '</ul>';
}

/**
 * Display the post author avatar next to a meta label.
 *
 * @param int $size Avatar size in pixels.
 */
function mocro_posted_by( $size = 32 ) {
	$author_id = get_the_author_meta( 'ID' );
	?>
	<span class="mocro-post__author" style="display:inline-flex;align-items:center;gap:8px;">
		<?php echo get_avatar( $author_id, $size, '', '', array( 'style' => 'border-radius:50%;' ) ); ?>
		<a href="<?php echo esc_url( get_author_posts_url( $author_id ) ); ?>"><?php the_author(); ?></a>
	</span>
	<?php
}
