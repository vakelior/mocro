<?php
/**
 * Main index template.
 *
 * @package MOCRO
 */

get_header();
?>

<div class="mocro-container">
	<?php if ( have_posts() ) : ?>

		<header class="mocro-section-masthead" style="padding-top:var(--mocro-space-5); padding-bottom:var(--mocro-space-4);">
			<h1 class="mocro-section-title">
				<?php
				if ( is_home() && ! is_front_page() ) {
					single_post_title();
				} elseif ( is_archive() ) {
					the_archive_title();
				} elseif ( is_search() ) {
					/* translators: %s: search query */
					printf( esc_html__( 'Search results for "%s"', 'mocro' ), '<span>' . get_search_query() . '</span>' );
				} else {
					esc_html_e( 'Latest', 'mocro' );
				}
				?>
			</h1>
		</header>

		<div class="mocro-archive">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content', 'summary' );
			endwhile;
			?>
		</div>

		<?php the_posts_pagination( array( 'class' => 'mocro-pagination' ) ); ?>

	<?php else : ?>

		<div class="mocro-404">
			<div class="mocro-404__code">404<span>.</span></div>
			<h2><?php esc_html_e( 'Nothing found', 'mocro' ); ?></h2>
			<p style="color:var(--mocro-gray-500);"><?php esc_html_e( 'Try a different search or browse the latest posts below.', 'mocro' ); ?></p>
			<?php get_search_form(); ?>
		</div>

	<?php endif; ?>
</div>

<?php
get_footer();
