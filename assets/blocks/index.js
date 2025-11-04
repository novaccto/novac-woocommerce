/**
 * WooCommerce dependencies
 */
import {
    registerPaymentMethod,
} from '@woocommerce/blocks-registry';

/**
 * Internal dependencies
 *
 * reference: https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/checkout-payment-methods/payment-method-integration.md
 */
import paymentMethod from 'wcnovac/blocks/payment-method';

// Register Novac Payment Request.
registerPaymentMethod( paymentMethod );

// TODO: implement a Direct Card payment metho