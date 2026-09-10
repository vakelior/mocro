<?php
/**
 * Search form template.
 *
 * @package MOCRO
 */

$mocro_unique_id = wp_unique_id( 'search-form-' );
?>
<form role="search" method="get" class="mocro-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="<?php echo esc_attr( $mocro_unique_id ); ?>">
		<?php esc_html_e( 'Search for:', 'mocro' ); ?>
	</label>
	<input type="search" id="<?php echo esc_attr( $mocro_unique_id ); ?>" name="s"
		placeholder="<?php esc_attr_e( 'Search\u2026', 'mocro' ); ?>"
		value="<?php echo get_search_query(); ?>" />
	<button class="mocro-btn" type="submit" aria-label="<?php esc_attr_e( 'Search', 'mocro' ); ?>">
		<i data-lucide="search"></i>
	</button>
</form>
