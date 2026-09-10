/**
 * MOCRO — theme interactions.
 *
 * Handles the mobile navigation toggle and icon re-initialization after
 * dynamic content changes.
 */
( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		var toggle = document.querySelector( '[data-nav-toggle]' );
		var nav = document.querySelector( '[data-nav]' );

		if ( toggle && nav ) {
			toggle.addEventListener( 'click', function () {
				var isOpen = nav.classList.toggle( 'is-open' );
				toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );

				// Swap the icon between menu and close.
				var icon = toggle.querySelector( '[data-lucide]' );
				if ( icon ) {
					icon.setAttribute( 'data-lucide', isOpen ? 'x' : 'menu' );
					if ( window.lucide ) {
						window.lucide.createIcons();
					}
				}
			} );
		}

		// Initialize Lucide icons.
		if ( window.lucide ) {
			window.lucide.createIcons();
		}
	} );
} )();
