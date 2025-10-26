<?php
/**
 * Plugin Name:       WP Dev Habit: Your Daily Content Prompter
 * Plugin URI:        https://wp-devhabit.com
 * Description:       A simple, elegant tool that asks probing questions to help you generate content and document your daily progress.
 * Version:           0.2.0
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
 * Adds the WP Dev Habit admin menu pages.
 */
function devhabit_add_admin_menu() {
    // Main journaling page
    add_menu_page(
        __( 'WP DevHabit', 'wp-devhabit' ),          // Page Title
        __( 'WP DevHabit Log', 'wp-devhabit' ),         // Menu Title (Changed for clarity)
        'manage_options',                             // Capability
        'wp-devhabit',                                // Menu Slug (Main page)
        'devhabit_render_admin_page',                 // Callback function
        'dashicons-edit-page',                        // Icon
        80                                            // Position
    );

    // Settings sub-menu page
    add_submenu_page(
        'wp-devhabit',                                // Parent Slug
        __( 'WP DevHabit Settings', 'wp-devhabit' ),    // Page Title
        __( 'Settings', 'wp-devhabit' ),              // Menu Title
        'manage_options',                             // Capability
        'wp-devhabit-settings',                       // Menu Slug (Settings page)
        'devhabit_render_settings_page'               // Callback function
    );
}
add_action( 'admin_menu', 'devhabit_add_admin_menu' );


/**
 * Renders the HTML for the main WP Dev Habit admin page (the journal tool).
 */
function devhabit_render_admin_page() {
    $current_version = '0.2.0'; // Define current version
    $settings_url = admin_url('admin.php?page=wp-devhabit-settings');   
    ?>
    <div class="wrap devhabit-page-wrapper">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <div class="devhabit-intro-text" style="max-width: 700px; margin: 1.5em auto 1.5em auto; text-align: center;">
            <p style="margin-bottom: 0.5em; color: #50575e; font-size: 0.9em;">
                <?php printf( esc_html__( 'Version %s', 'wp-devhabit' ), esc_html( $current_version ) ); ?>
                 <span class="update-when-official">| <a href="https://wordpress.org/plugins/wp-dev-habit/#developers"><?php esc_html_e( 'View Changelog', 'wp-devhabit' ); ?></a></span>
            </p>
            <p style="margin-bottom: 0.5em; color: #50575e;">
                <span class="dashicons dashicons-info-outline" style="vertical-align: text-bottom; margin-right: 4px;"></span>
                <?php esc_html_e( 'Tip: Use Ctrl+Enter (Cmd+Enter on Mac) to quickly advance.', 'wp-devhabit' ); ?>
            </p>
            <p style="margin-bottom: 0;"> <?php // Remove bottom margin on last paragraph ?>
                <span class="dashicons dashicons-admin-settings" style="vertical-align: text-bottom; margin-right: 4px;"></span>
                <?php printf(
                    wp_kses_post( __( 'Configure your <a href="%s">GitHub Settings</a> to enable auto-saving.', 'wp-devhabit' ) ),
                    esc_url( $settings_url )
                 ); ?>
            </p>
        </div>
        
    </div>
    <hr class="wp-header-end">
    <div id="appContainer" class="devhabit-app-container">
        <!-- The app will be rendered here by admin.js -->
        <p style="text-align: center; color: #64748b; margin-top: 2em;">Loading Journal Tool...</p>
    </div>
    <?php
}

/**
 * Renders the HTML for the WP Dev Habit settings page.
 */
function devhabit_render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'WP Dev Habit Settings', 'wp-devhabit' ); ?></h1>
        <form method="post" action="options.php">
            <?php
            // Output security fields for the registered setting "devhabit_settings"
            settings_fields( 'devhabit_settings_group' );
            // Output setting sections and their fields
            do_settings_sections( 'wp-devhabit-settings' );
            // Output save settings button
            submit_button( __( 'Save Settings', 'wp-devhabit' ) );
            ?>
        </form>
    </div>
    <?php
}

/**
 * Initializes the settings API for the GitHub integration.
 */
function devhabit_settings_init() {
    // Register the setting group that will hold all our options
    register_setting(
        'devhabit_settings_group',      // Option group (used in settings_fields)
        'devhabit_github_options',      // Option name (stored in wp_options table)
        'devhabit_sanitize_options'     // Sanitization callback
    );

    // Add a section to the settings page
    add_settings_section(
        'devhabit_github_section',                      // ID
        __( 'GitHub Integration Settings', 'wp-devhabit' ), // Title
        'devhabit_github_section_callback',             // Callback to render section description
        'wp-devhabit-settings'                          // Page slug where this section appears
    );

    // Add fields to the section
    add_settings_field(
        'github_pat',                                   // Field ID
        __( 'GitHub Personal Access Token', 'wp-devhabit' ), // Field Title
        'devhabit_render_github_pat_field',             // Callback to render the input
        'wp-devhabit-settings',                         // Page slug
        'devhabit_github_section'                       // Section ID
    );

    add_settings_field(
        'github_username',
        __( 'GitHub Username', 'wp-devhabit' ),
        'devhabit_render_github_username_field',
        'wp-devhabit-settings',
        'devhabit_github_section'
    );

     add_settings_field(
        'github_repo',
        __( 'Target Repository Name', 'wp-devhabit' ),
        'devhabit_render_github_repo_field',
        'wp-devhabit-settings',
        'devhabit_github_section'
    );

     add_settings_field(
        'github_path',
        __( 'Default File Path (Optional)', 'wp-devhabit' ),
        'devhabit_render_github_path_field',
        'wp-devhabit-settings',
        'devhabit_github_section'
    );
}
add_action( 'admin_init', 'devhabit_settings_init' );

/**
 * Callback function to render the description for the GitHub settings section.
 */
function devhabit_github_section_callback() {
    echo '<p>' . esc_html__( 'Configure your GitHub settings to automatically save logs.', 'wp-devhabit' ) . '</p>';
    echo '<p>' . wp_kses_post( __( 'You need to create a <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer">Personal Access Token</a> with the <code>public_repo</code> or <code>repo</code> scope.', 'wp-devhabit' ) ) . '</p>';

}

// --- Callback functions to render each settings field ---

function devhabit_render_github_pat_field() {
    $options = get_option( 'devhabit_github_options' );
    $pat = isset( $options['github_pat'] ) ? $options['github_pat'] : '';
    ?>
    <input type="password" name="devhabit_github_options[github_pat]" value="<?php echo esc_attr( $pat ); ?>" class="regular-text" />
    <p class="description"><?php esc_html_e( 'Your GitHub PAT. This is stored securely but treated like a password.', 'wp-devhabit' ); ?></p>
    <?php
}

function devhabit_render_github_username_field() {
    $options = get_option( 'devhabit_github_options' );
    $username = isset( $options['github_username'] ) ? $options['github_username'] : '';
    ?>
    <input type="text" name="devhabit_github_options[github_username]" value="<?php echo esc_attr( $username ); ?>" class="regular-text" />
    <?php
}

function devhabit_render_github_repo_field() {
    $options = get_option( 'devhabit_github_options' );
    $repo = isset( $options['github_repo'] ) ? $options['github_repo'] : '';
    ?>
    <input type="text" name="devhabit_github_options[github_repo]" value="<?php echo esc_attr( $repo ); ?>" class="regular-text" placeholder="e.g., my-project-logs" />
    <p class="description"><?php esc_html_e( 'The name of the repository where logs should be saved.', 'wp-devhabit' ); ?></p>
    <?php
}

function devhabit_render_github_path_field() {
    $options = get_option( 'devhabit_github_options' );
    $path = isset( $options['github_path'] ) ? $options['github_path'] : '_logs/'; // Default value
    ?>
    <input type="text" name="devhabit_github_options[github_path]" value="<?php echo esc_attr( $path ); ?>" class="regular-text" placeholder="e.g., _logs/ or leave blank for root" />
    <p class="description"><?php esc_html_e( 'The folder within the repository to save logs. Must end with a slash if specified. Defaults to _logs/.', 'wp-devhabit' ); ?></p>
    <?php
}

/**
 * Sanitizes the options before saving them to the database.
 */
function devhabit_sanitize_options( $input ) {
    $sanitized_input = array();

    if ( isset( $input['github_pat'] ) ) {
        // Basic sanitization, but avoid stripping necessary characters for a token
        $sanitized_input['github_pat'] = sanitize_text_field( $input['github_pat'] );
    }
    if ( isset( $input['github_username'] ) ) {
        $sanitized_input['github_username'] = sanitize_text_field( $input['github_username'] );
    }
     if ( isset( $input['github_repo'] ) ) {
        // Sanitize like a slug but allow hyphens
        $sanitized_input['github_repo'] = sanitize_title_with_dashes( $input['github_repo'] );
    }
     if ( isset( $input['github_path'] ) ) {
         // Ensure path ends with a slash if not empty
        $path = sanitize_text_field( $input['github_path'] );
        if ( ! empty( $path ) && substr( $path, -1 ) !== '/' ) {
            $path .= '/';
        }
        $sanitized_input['github_path'] = $path;
    }

    return $sanitized_input;
}


/**
 * Enqueues the necessary scripts and styles for the admin page.
 */
function devhabit_enqueue_admin_scripts( $hook ) {
    // Only load our scripts on the WP Dev Habit pages.
    // $hook will be 'toplevel_page_wp-devhabit' for the main page
    // and 'dev-habit-log_page_wp-devhabit-settings' for the settings page.
    if ( 'toplevel_page_wp-devhabit' !== $hook && 'dev-habit-log_page_wp-devhabit-settings' !== $hook) {
        return;
    }

    $plugin_url = plugin_dir_url( __FILE__ );
    $plugin_version = '0.2.0'; // Update version

    // Only enqueue JS/CSS for the main journaling tool page
    if ( 'toplevel_page_wp-devhabit' === $hook ) {
        wp_enqueue_script(
            'wp-devhabit-admin-js',
            $plugin_url . 'admin.js',
            [], // Dependencies
            $plugin_version,
            true // Load in footer
        );

        wp_enqueue_style(
            'wp-devhabit-admin-css',
            $plugin_url . 'admin.css',
            [], // Dependencies
            $plugin_version
        );

        // Localize script to pass AJAX URL and nonce
        wp_localize_script('wp-devhabit-admin-js', 'devhabit_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('devhabit_save_log_nonce') // Action name for nonce
        ));

    }
}
add_action( 'admin_enqueue_scripts', 'devhabit_enqueue_admin_scripts' );

// AJAX Handler for Saving Log to GitHub
function devhabit_ajax_save_log_to_github() {
    // 1. Verify Nonce
    check_ajax_referer('devhabit_save_log_nonce', 'nonce');

    // 2. Check User Capability
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( 'Permission denied.', 403 );
    }

    // 3. Get Log Content from POST request
    if ( ! isset( $_POST['log_content'] ) || empty( trim( $_POST['log_content'] ) ) ) {
         wp_send_json_error( 'Log content is missing.', 400 );
    }
    $log_content = sanitize_textarea_field( wp_unslash( $_POST['log_content'] ) ); // Sanitize the content

    // 4. Get GitHub Options
    $options = get_option( 'devhabit_github_options' );
    $pat = isset( $options['github_pat'] ) ? $options['github_pat'] : '';
    $username = isset( $options['github_username'] ) ? $options['github_username'] : '';
    $repo = isset( $options['github_repo'] ) ? $options['github_repo'] : '';
    $path = isset( $options['github_path'] ) ? $options['github_path'] : '_logs/'; // Ensure default

    // 5. Validate Settings
    if ( empty( $pat ) || empty( $username ) || empty( $repo ) ) {
        wp_send_json_error( 'GitHub settings are incomplete. Please check the Dev Habit Settings page.', 400 );
    }

    // --- GitHub API Interaction ---
    $date_slug = date('Y-m-d');
    $file_name = $date_slug . '-log.md';
    $full_path = trim( $path, '/' ) . '/' . $file_name; // Ensure path format is correct
    if ( $path === '' || $path === '/' ) { // Handle root path case
        $full_path = $file_name;
    }

    $api_url = sprintf(
        'https://api.github.com/repos/%s/%s/contents/%s',
        $username,
        $repo,
        $full_path
    );

    $commit_message = 'Add dev log for ' . $date_slug;
    $content_base64 = base64_encode( $log_content ); // Content must be base64 encoded

    $body = json_encode( array(
        'message' => $commit_message,
        'content' => $content_base64,
        'branch'  => 'main' // Or make this configurable? For now, assume 'main'.
    ) );

    $args = array(
        'method'  => 'PUT',
        'headers' => array(
            'Authorization' => 'Bearer ' . $pat,
            'Accept'        => 'application/vnd.github.v3+json',
            'Content-Type'  => 'application/json',
            'User-Agent'    => 'WP Dev Habit Plugin' // Good practice to identify your app
        ),
        'body'    => $body,
        'timeout' => 15, // Increase timeout slightly for API calls
    );

    $response = wp_remote_request( $api_url, $args );

    if ( is_wp_error( $response ) ) {
        wp_send_json_error( 'Failed to connect to GitHub API: ' . $response->get_error_message(), 500 );
    } else {
        $status_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );
        $decoded_body = json_decode( $response_body, true );

        if ( $status_code === 201 || $status_code === 200 ) { // 201 = Created, 200 = Updated (if file existed, though PUT usually creates/replaces)
             wp_send_json_success( array(
                 'message' => 'Log saved successfully to GitHub!',
                 'url' => isset($decoded_body['content']['html_url']) ? $decoded_body['content']['html_url'] : '#'
                 )
             );
        } else {
             // Try to provide a more helpful error from GitHub
            $error_message = 'Failed to save log to GitHub.';
            if ( isset( $decoded_body['message'] ) ) {
                $error_message .= ' GitHub Error: ' . $decoded_body['message'];
            }
             wp_send_json_error( $error_message, $status_code );
        }
    }

    // wp_die(); // this is required to terminate immediately and return a proper response
}
// Hook for logged-in users
add_action( 'wp_ajax_devhabit_save_log_to_github', 'devhabit_ajax_save_log_to_github' );

/**
 * Adds a support link to the admin footer on WP Dev Habit pages.
 */
function devhabit_add_admin_footer_link( $footer_text ) {
    // Get the current screen object
    $screen = get_current_screen();

    // Check if we are on one of the WP Dev Habit pages
    if ( $screen && ( $screen->id === 'toplevel_page_wp-devhabit' || $screen->id === 'dev-habit-log_page_wp-devhabit-settings' ) ) {
        $support_url = 'https://wp-devhabit.com/support/';

        // Append your link to the existing footer text
        $footer_text .= ' | ' . sprintf(
            wp_kses_post( __( 'Need help? Visit the <a href="%s" target="_blank" rel="noopener noreferrer">WP Dev Habit Support</a> page.', 'wp-devhabit' ) ),
            esc_url( $support_url )
        );
    }

    return $footer_text; // Return the modified or original text
}
add_filter( 'admin_footer_text', 'devhabit_add_admin_footer_link' );

?>
