<?php
/**
 * Front page template — a striking black & white hero with feature sections.
 *
 * @package MOCRO
 */

get_header();
?>

<!-- ============================= HERO ============================= -->
<section class="mocro-hero">
	<div class="mocro-container mocro-hero__grid">

		<div class="mocro-hero__content">
			<span class="mocro-hero__eyebrow"><i data-lucide="sparkles"></i> <?php esc_html_e( 'Black & White. Pure. 2026.', 'mocro' ); ?></span>
			<h1 class="mocro-hero__title">
				<?php esc_html_e( 'Elegance in', 'mocro' ); ?><br />
				<span class="accent"><?php esc_html_e( 'monochrome', 'mocro' ); ?></span>
			</h1>
			<p class="mocro-hero__sub">
				<?php esc_html_e( 'A sharp, minimal WordPress theme built for clarity and contrast. Less noise, more impact.', 'mocro' ); ?>
			</p>
			<div class="mocro-hero__actions">
				<a class="mocro-btn" href="#services">
					<?php esc_html_e( 'Explore', 'mocro' ); ?> <i data-lucide="arrow-right"></i>
				</a>
				<a class="mocro-btn mocro-btn--ghost" href="<?php echo esc_url( home_url( '/blog' ) ); ?>">
					<?php esc_html_e( 'Read the blog', 'mocro' ); ?>
				</a>
			</div>
		</div>

		<div class="mocro-hero__visual">
			<i data-lucide="aperture"></i>
		</div>

	</div>
</section>

<!-- ============================= SERVICES ============================= -->
<section class="mocro-section" id="services">
	<div class="mocro-container">
		<div class="mocro-section-head">
			<h2 class="mocro-section-title"><?php esc_html_e( 'What we do', 'mocro' ); ?></h2>
			<span class="mocro-section-more"><?php esc_html_e( 'Our craft', 'mocro' ); ?> <i data-lucide="arrow-up-right"></i></span>
		</div>

		<div class="mocro-grid mocro-grid--3">
			<div class="mocro-card">
				<div class="mocro-card__icon"><i data-lucide="pen-tool"></i></div>
				<h3><?php esc_html_e( 'Design', 'mocro' ); ?></h3>
				<p><?php esc_html_e( 'Minimal, bold interfaces that communicate instantly and age gracefully.', 'mocro' ); ?></p>
			</div>
			<div class="mocro-card">
				<div class="mocro-card__icon"><i data-lucide="code-2"></i></div>
				<h3><?php esc_html_e( 'Development', 'mocro' ); ?></h3>
				<p><?php esc_html_e( 'Fast, accessible, standards-based builds with obsessive attention to detail.', 'mocro' ); ?></p>
			</div>
			<div class="mocro-card">
				<div class="mocro-card__icon"><i data-lucide="rocket"></i></div>
				<h3><?php esc_html_e( 'Strategy', 'mocro' ); ?></h3>
				<p><?php esc_html_e( 'Clear thinking that turns complexity into focused, measurable outcomes.', 'mocro' ); ?></p>
			</div>
		</div>
	</div>
</section>

<!-- ============================= ABOUT (alt dark) ============================= -->
<section class="mocro-section mocro-section--alt" id="about">
	<div class="mocro-container">
		<div class="mocro-hero__grid" style="align-items:center;">
			<div>
				<h2 class="mocro-section-title" style="color:var(--mocro-white);"><?php esc_html_e( 'Less, but better', 'mocro' ); ?></h2>
			</div>
			<div style="opacity:0.85;">
				<p><?php esc_html_e( 'We believe great design is the reduction of noise. By stripping away the unnecessary, we reveal what truly matters — crisp type, strong contrast, and pure intent.', 'mocro' ); ?></p>
				<ul class="mocro-nav__list" style="margin-top:24px; gap:24px;">
					<li style="display:flex;align-items:center;gap:8px;"><i data-lucide="check" style="width:18px;height:18px;"></i> <?php esc_html_e( 'Accessible', 'mocro' ); ?></li>
					<li style="display:flex;align-items:center;gap:8px;"><i data-lucide="check" style="width:18px;height:18px;"></i> <?php esc_html_e( 'Fast', 'mocro' ); ?></li>
					<li style="display:flex;align-items:center;gap:8px;"><i data-lucide="check" style="width:18px;height:18px;"></i> <?php esc_html_e( 'Timeless', 'mocro' ); ?></li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- ============================= LATEST POSTS ============================= -->
<section class="mocro-section">
	<div class="mocro-container">
		<div class="mocro-section-head">
			<h2 class="mocro-section-title"><?php esc_html_e( 'Latest from the blog', 'mocro' ); ?></h2>
			<a class="mocro-section-more" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ); ?>">
				<?php esc_html_e( 'View all', 'mocro' ); ?> <i data-lucide="arrow-up-right"></i>
			</a>
		</div>

		<?php
		$mocro_latest = new WP_Query(
			array(
				'posts_per_page'      => 3,
				'ignore_sticky_posts' => true,
			)
		);

		if ( $mocro_latest->have_posts() ) :
			echo '<div class="mocro-grid mocro-grid--3">';
			while ( $mocro_latest->have_posts() ) :
				$mocro_latest->the_post();
				?>
				<a class="mocro-card" href="<?php the_permalink(); ?>">
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="mocro-post__thumb" style="margin-bottom:var(--mocro-space-3);">
							<?php the_post_thumbnail( 'mocro-card' ); ?>
						</div>
					<?php endif; ?>
					<div class="mocro-post__meta"><?php echo esc_html( get_the_date() ); ?></div>
					<h3 style="margin-bottom:var(--mocro-space-1);"><?php the_title(); ?></h3>
					<p style="color:var(--mocro-gray-500); margin:0;"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 16 ) ); ?></p>
				</a>
				<?php
			endwhile;
			echo '</div>';
			wp_reset_postdata();
		endif;
		?>
	</div>
</section>

<!-- ============================= CTA ============================= -->
<section class="mocro-section" style="padding-top:0;">
	<div class="mocro-container">
		<div class="mocro-card" style="text-align:center; padding:var(--mocro-space-5);">
			<h2 class="mocro-section-title" style="margin-bottom:var(--mocro-space-2);"><?php esc_html_e( 'Ready to start?', 'mocro' ); ?></h2>
			<p style="color:var(--mocro-gray-500); max-width:480px; margin:0 auto var(--mocro-space-4);">
				<?php esc_html_e( 'Let\u2019s build something clean, sharp, and unforgettable together.', 'mocro' ); ?>
			</p>
			<a class="mocro-btn" href="mailto:<?php echo esc_attr( get_option( 'admin_email' ) ); ?>">
				<?php esc_html_e( 'Get in touch', 'mocro' ); ?> <i data-lucide="mail"></i>
			</a>
		</div>
	</div>
</section>

<?php
get_footer();
