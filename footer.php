<?php
/**
 * Footer template.
 *
 * @package MOCRO
 */
?>
</main>

<footer class="mocro-footer">
	<div class="mocro-container">

		<div class="mocro-footer__grid">
			<div class="mocro-footer__brand">
				<a class="mocro-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<?php bloginfo( 'name' ); ?><span class="mocro-logo__dot"></span>
				</a>
				<p style="margin-top:16px; opacity:0.7; max-width:320px;">
					<?php echo esc_html( get_bloginfo( 'description' ) ); ?>
				</p>
				<div class="mocro-footer__social">
					<?php
					$mocro_social = array(
						'twitter'   => 'X',
						'github'    => 'Github',
						'linkedin'  => 'Linkedin',
						'instagram' => 'Instagram',
					);
					foreach ( $mocro_social as $slug => $label ) :
						$url = get_theme_mod( 'mocro_social_' . $slug, '' );
						if ( $url ) :
							?>
							<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener" aria-label="<?php echo esc_attr( $label ); ?>">
								<?php if ( 'twitter' === $slug ) : ?>
									<i data-lucide="twitter"></i>
								<?php elseif ( 'github' === $slug ) : ?>
									<i data-lucide="github"></i>
								<?php elseif ( 'linkedin' === $slug ) : ?>
									<i data-lucide="linkedin"></i>
								<?php else : ?>
									<i data-lucide="instagram"></i>
								<?php endif; ?>
							</a>
							<?php
						endif;
					endforeach;
					?>
				</div>
			</div>

			<div>
				<h4><?php esc_html_e( 'Explore', 'mocro' ); ?></h4>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => false,
						'fallback_cb'    => false,
					)
				);
				?>
			</div>

			<div>
				<h4><?php esc_html_e( 'Company', 'mocro' ); ?></h4>
				<ul>
					<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'mocro' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#about' ) ); ?>"><?php esc_html_e( 'About', 'mocro' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#services' ) ); ?>"><?php esc_html_e( 'Services', 'mocro' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/blog' ) ); ?>"><?php esc_html_e( 'Blog', 'mocro' ); ?></a></li>
				</ul>
			</div>

			<div>
				<h4><?php esc_html_e( 'Newsletter', 'mocro' ); ?></h4>
				<p style="opacity:0.7; font-size:0.9rem;"><?php esc_html_e( 'Stay in the loop with our latest updates.', 'mocro' ); ?></p>
				<form class="mocro-search-form" style="margin:0; max-width:none;">
					<input type="email" placeholder="<?php esc_attr_e( 'Your email', 'mocro' ); ?>" />
					<button class="mocro-btn" type="submit"><i data-lucide="arrow-right"></i></button>
				</form>
			</div>
		</div>

		<div class="mocro-footer__bottom">
			<span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', 'mocro' ); ?></span>
			<span><?php esc_html_e( 'Crafted in black & white.', 'mocro' ); ?></span>
		</div>

	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
