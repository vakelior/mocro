<?php
/**
 * Post summary partial — used in archives and index.
 *
 * @package MOCRO
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'mocro-post' ); ?>>

	<div class="mocro-post__thumb">
		<a href="<?php the_permalink(); ?>">
			<?php
			if ( has_post_thumbnail() ) {
				the_post_thumbnail( 'mocro-card' );
			} else {
				echo '<div style="width:100%;height:100%;background:var(--mocro-gray-100);display:grid;place-items:center;color:var(--mocro-gray-300);"><i data-lucide="image" style="width:40px;height:40px;"></i></div>';
			}
			?>
		</a>
	</div>

	<div>
		<div class="mocro-post__meta">
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<?php if ( has_category() ) : ?>
				<span>&bull;</span>
				<span><?php the_category( ', ' ); ?></span>
			<?php endif; ?>
		</div>

		<h2 class="mocro-post__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>

		<div class="mocro-post__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></div>

		<a class="mocro-post__link" href="<?php the_permalink(); ?>">
			<?php esc_html_e( 'Read more', 'mocro' ); ?> <i data-lucide="arrow-right"></i>
		</a>
	</div>

</article>
