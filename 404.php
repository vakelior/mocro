<?php
/**
 * 404 template.
 *
 * @package MOCRO
 */

get_header();
?>

<div class="mocro-container">
	<section class="mocro-404">
		<div class="mocro-404__code">4<span>0</span>4</div>
		<h1 class="mocro-section-title"><?php esc_html_e( 'This page wandered off', 'mocro' ); ?></h1>
		<p style="color:var(--mocro-gray-500); max-width:440px; margin:0 auto var(--mocro-space-3);">
			<?php esc_html_e( 'The page you\u2019re looking for doesn\u2019t exist or has been moved. Let\u2019s get you back on track.', 'mocro' ); ?>
		</p>

		<?php get_search_form(); ?>

		<a class="mocro-btn" href="<?php echo esc_url( home_url( '/' ) ); ?>" style="margin-top:var(--mocro-space-3);">
			<i data-lucide="home"></i> <?php esc_html_e( 'Back to home', 'mocro' ); ?>
		</a>
	</section>
</div>

<?php
get_footer();
