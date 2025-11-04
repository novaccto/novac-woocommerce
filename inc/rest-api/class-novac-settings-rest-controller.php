<?php
/**
 * Base For Novac Endpoint.
 *
 * @package    Novac/WooCommerce/RestApi
 */

/**
 * Novac Settings Endpoint.
 */
final class Novac_Settings_Rest_Controller extends WP_REST_Controller {
    /**
     * Endpoint namespace.
     *
     * @var string
     */
    protected $namespace;

    /**
     * Rest base for the current object.
     *
     * @var string
     */
    protected $rest_base;

    /**
     * Settings Route Constructor.
     */
    public function __construct() {
        $this->namespace = 'novac/v1';
        $this->rest_base = 'settings';
    }

    /**
     * Register Routes and their Verbs.
     */
    public function register_routes() {

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array( $this, 'get_item' ),
                    'permission_callback' => array( $this, 'get_items_permissions_check' ),
                    'args'                => $this->get_endpoint_args_for_item_schema(),
                ),
                array(
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => array( $this, 'update_item' ),
                    'permission_callback' => array( $this, 'update_item_permissions_check' ),
                    'args'                => $this->novac_update_validations(),

                ),
                'schema' => array( $this, 'get_public_item_schema' ),
            )
        );
    }

    /**
     * Update validations.
     */
    public function novac_update_validations() {
        return array(
            array(
                'live_secret_key'    => true,
                'test_secret_key'    => true,
                'live_public_key'    => true,
                'test_public_key'    => true,
                'go_live'            => array(
                    'validate_callback' => function ( $param ) {
                        if ( ! gettype( $param ) === 'yes' && ! gettype( $param ) === 'no' ) {
                            return new WP_Error(
                                'rest_invalid_param',
                                __( 'The go_live value provided is invalid. Please provide a yes or no.', 'novac-woo' ),
                                array( 'status' => WP_Http::BAD_REQUEST )
                            );
                        }
                        return true;
                    },
                ),
                'autocomplete_order' => array(
                    'validate_callback' => function ( $param ) {
                        if ( ! gettype( $param ) === 'yes' && ! gettype( $param ) === 'no' ) {
                            return new WP_Error(
                                'rest_invalid_param',
                                __( 'The autocomplete_order value provided is invalid. Please provide a yes or no.', 'novac-woo' ),
                                array( 'status' => WP_Http::BAD_REQUEST )
                            );
                        }
                        return true;
                    },
                ),
                'enabled'            => array(
                    'validate_callback' => function ( $param ) {
                        if ( ! gettype( $param ) === 'yes' && ! gettype( $param ) === 'no' ) {
                            return new WP_Error(
                                'rest_invalid_param',
                                __( 'The enabled value provided is invalid. Please provide a yes or no.', 'novac-woo' ),
                                array( 'status' => WP_Http::BAD_REQUEST )
                            );
                        }
                        return true;
                    },
                ),
            ),
        );
    }

    /**
     * Get Current Users Permission.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return bool|WP_Error
     */
    public function get_items_permissions_check( $request ) {
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'rest_cannot_view',
                __( 'Your user is not permitted to access this resource.', 'novac-woo' ),
                array( 'status' => rest_authorization_required_code() )
            );
        }

        return true;
    }

    /**
     * Checks if the user has the necessary permissions to get global styles information.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return bool|WP_Error
     */
    public function update_item_permissions_check( $request ) {
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'rest_cannot_view',
                __( 'Your user is not permitted to access this resource.', 'novac-woo' ),
                array( 'status' => rest_authorization_required_code() )
            );
        }

        return true;
    }

    /**
     * Get the current settings.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_item( $request ): WP_REST_Response {
        $settings = get_option( 'woocommerce_novac_settings', array() );

        return new WP_REST_Response( $settings, WP_Http::OK );
    }

    /**
     * Update Novac Settings.
     *
     * @param WP_REST_Request $request the request.
     */
    public function update_item( $request ): WP_REST_Response {
        $settings = $request->get_params();
        update_option( 'woocommerce_novac_settings', $settings );
        return new WP_REST_Response(
            array(
                'message' => 'Updated Successfully',
                'data'    => $settings,
            ),
            WP_Http::OK
        );
    }
}