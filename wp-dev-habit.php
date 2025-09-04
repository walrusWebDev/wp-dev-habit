<?php
/**
 * Plugin Name:       WP Dev Habit: Your Daily Content Prompter
 * Plugin URI:        https://wp-devhabit.com
 * Description:       A simple, elegant tool that asks probing questions to help you generate content and document your daily progress.
 * Version:           0.1.0
 * Author:            oneoffboss
 * Author URI:        https://oneoffboss.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-devhabit
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Adds the WP Dev Habit admin menu page.
 */
function autodoc_add_admin_menu() {
    add_menu_page(
        __( 'WP Dev Habit', 'wp-devhabit' ), // Page Title
        __( 'WP Dev Habit', 'wp-devhabit' ),          // Menu Title
        'manage_options',                      // Capability
        'wp-devhabit',                            // Menu Slug
        'devhabit_render_admin_page',           // Callback function
        'dashicons-edit-page',                 // Icon
        80                                     // Position
    );
}
add_action( 'admin_menu', 'devhabit_add_admin_menu' );

/**
 * Renders the HTML for the WP Dev Habit admin page.
 */
function devhabit_render_admin_page() {
    // This is a basic wrapper. The actual app is rendered by our JS.
    ?>
    <div id="appContainer" class="wrap devhabit-wrapper">
        <!-- The app will be rendered here by admin.js -->
    </div>
    <?php
}

/**
 * Enqueues the necessary scripts and styles for the admin page.
 */
function devhabit_enqueue_admin_scripts( $hook ) {
    // Only load our scripts on the WP Dev Habit page.
    if ( 'toplevel_page_wp-devhabit' !== $hook ) {
        return;
    }

    $plugin_url = plugin_dir_url( __FILE__ );

    // Enqueue our JavaScript file
    wp_enqueue_script(
        'wp-devhabit-admin-js',
        $plugin_url . 'admin.js',
        [], // Dependencies
        '0.1.0', // Version
        true // Load in footer
    );

    // Enqueue our CSS file
    wp_enqueue_style(
        'wp-devhabit-admin-css',
        $plugin_url . 'admin.css',
        [], // Dependencies
        '0.1.0' // Version
    );
}
add_action( 'admin_enqueue_scripts', 'devhabit_enqueue_admin_scripts' );
