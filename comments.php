<?php
/**
 * Comments template.
 *
 * @package MOCRO
 */

if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area mocro-single" style="padding:var(--mocro-space-4) 0; margin-top:var(--mocro-space-4); border-top:1px solid var(--mocro-gray-100);">

	<?php if ( have_comments() ) : ?>
		<h2 class="mocro-section-title" style="font-size:1.6rem;">
			<?php
			$mocro_comment_count = get_comments_number();
			/* translators: %s: comment count */
			printf( esc_html( _n( '%s Comment', '%s Comments', $mocro_comment_count, 'mocro' ) ), esc_html( number_format_i18n( $mocro_comment_count ) ) );
			?>
		</h2>

		<ol class="comment-list">
			<?php
			wp_list_comments(
				array(
					'style'      => 'ol',
					'short_ping' => true,
					'avatar_size' => 48,
				)
			);
			?>
		</ol>

		<?php the_comments_pagination(); ?>
	<?php endif; ?>

	<?php
	comment_form(
		array(
			'class_submit'       => 'mocro-btn',
			'title_reply'        => __( 'Leave a comment', 'mocro' ),
			'label_submit'       => __( 'Post comment', 'mocro' ),
		)
	);
	?>

</div>
