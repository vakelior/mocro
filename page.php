<?php
/**
 * Page template.
 *
 * @package MOCRO
 */

get_header();
?>

<div class="mocro-container">
<?php
while ( have_posts() ) :
	the_post();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'mocro-single' ); ?>>

		<h1 class="entry-title" style="text-align:center;"><?php the_title(); ?></h1>

		<?php if ( has_post_thumbnail() ) : ?>
			<div class="mocro-post__thumb" style="margin-bottom:var(--mocro-space-4); aspect-ratio:16/7;">
				<?php the_post_thumbnail( 'mocro-hero' ); ?>
			</div>
		<?php endif; ?>

		<div class="entry-content">
			<?php
			the_content();

			wp_link_pages(
				array(
					'before' => '<div class="mocro-pagination">',
					'after'  => '</div>',
				)
			);
			?>
		</div>

		<?php if ( comments_open() || get_comments_number() ) : ?>
			<div style="margin-top:var(--mocro-space-5);">
				<?php comments_template(); ?>
			</div>
		<?php endif; ?>

	</article>
	<?php
endwhile;
?>
</div>

<?php
get_footer();
