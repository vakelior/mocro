<?php
/**
 * MOCRO Customizer settings.
 *
 * @package MOCRO
 */

/**
 * Register customizer options.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function mocro_customize_register( $wp_customize ) {

	// Social links section.
	$wp_customize->add_section(
		'mocro_social',
		array(
			'title'    => __( 'MOCRO — Social Links', 'mocro' ),
			'priority' => 30,
		)
	);

	$mocro_socials = array(
		'twitter'   => __( 'X (Twitter) URL', 'mocro' ),
		'github'    => __( 'GitHub URL', 'mocro' ),
		'linkedin'  => __( 'LinkedIn URL', 'mocro' ),
		'instagram' => __( 'Instagram URL', 'mocro' ),
	);

	foreach ( $mocro_socials as $key => $label ) {
		$wp_customize->add_setting(
			'mocro_social_' . $key,
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
			)
		);

		$wp_customize->add_control(
			'mocro_social_' . $key,
			array(
				'label'   => $label,
				'section' => 'mocro_social',
				'type'    => 'url',
			)
		);
	}
}
add_action( 'customize_register', 'mocro_customize_register' );
