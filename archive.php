<?php
/**
 * Archive template.
 *
 * @package MOCRO
 */

get_header();
?>

<div class="mocro-container">
	<?php if ( have_posts() ) : ?>

		<header style="padding-top:var(--mocro-space-5); padding-bottom:var(--mocro-space-4);">
			<h1 class="mocro-section-title"><?php the_archive_title(); ?></h1>
			<?php the_archive_description( '<p style="color:var(--mocro-gray-500);margin-top:8px;">', '</p>' ); ?>
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
			<h2><?php esc_html_e( 'Nothing here yet', 'mocro' ); ?></h2>
		</div>
	<?php endif; ?>
</div>

<?php
get_footer();
