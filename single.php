<?php
/**
 * Single post template.
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

		<div class="mocro-post__meta">
			<span><?php echo esc_html( get_the_date() ); ?></span>
			<span>&bull;</span>
			<span><?php the_author(); ?></span>
			<?php if ( has_category() ) : ?>
				<span>&bull;</span>
				<span><?php the_category( ', ' ); ?></span>
			<?php endif; ?>
		</div>

		<h1 class="entry-title"><?php the_title(); ?></h1>

		<?php if ( has_post_thumbnail() ) : ?>
			<div class="mocro-post__thumb" style="margin-bottom:var(--mocro-space-4); aspect-ratio:16/9;">
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

		<?php if ( has_tag() ) : ?>
			<div class="mocro-post__meta" style="margin-top:var(--mocro-space-4);">
				<i data-lucide="tag"></i> <?php the_tags( '', ' &middot; ' ); ?>
			</div>
		<?php endif; ?>

	</article><!-- .mocro-single -->

	<div class="mocro-single" style="padding-top:0;">
		<nav class="mocro-post__nav" style="display:flex;justify-content:space-between;gap:var(--mocro-space-3);margin-top:var(--mocro-space-4);">
			<div><?php previous_post_link( '%link', '<span class="mocro-post__link"><i data-lucide="arrow-left"></i> ' . esc_html__( 'Previous', 'mocro' ) . '</span>' ); ?></div>
			<div><?php next_post_link( '%link', '<span class="mocro-post__link">' . esc_html__( 'Next', 'mocro' ) . ' <i data-lucide="arrow-right"></i></span>' ); ?></div>
		</nav>

		<?php
		if ( comments_open() || get_comments_number() ) {
			comments_template();
		}
		?>
	</div>
	<?php
endwhile;
?>
</div>

<?php
get_footer();
