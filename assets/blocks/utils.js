/**
 * WooCommerce dependencies
 */
import { getSetting, WC_ } from '@woocommerce/settings';

export const getBlocksConfiguration = () => {
    const novacServerData = getSetting( 'novac_data', null );

    if ( ! novacServerData ) {
        throw new Error( 'Novac initialization data is not available' );
    }

    return novacServerData;
};

/**
 * Creates a payment request using cart data from WooCommerce.
 *
 * @param {Object} Novac - The Novac JS object.
 * @param {Object} cart - The cart data response from the store's AJAX API.
 *
 * @return {Object} A Novac payment request.
 */
export const createPaymentRequestUsingCart = ( novac, cart ) => {
    const options = {
        total: cart.order_data.total,
        currency: cart.order_data.currency,
        country: cart.order_data.country_code,
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: getBlocksConfiguration()?.checkout
            ?.needs_payer_phone,
        requestShipping: !!cart.shipping_required,
        displayItems: cart.order_data.displayItems,
    };

    if ( options.country === 'PR' ) {
        options.country = 'US';
    }

    return novac.paymentRequest( options );
};

/**
 * Updates the given PaymentRequest using the data in the cart object.
 *
 * @param {Object} paymentRequest  The payment request object.
 * @param {Object} cart  The cart data response from the store's AJAX API.
 */
export const updatePaymentRequestUsingCart = ( paymentRequest, cart ) => {
    const options = {
        total: cart.order_data.total,
        currency: cart.order_data.currency,
        displayItems: cart.order_data.displayItems,
    };

    paymentRequest.update( options );
};

/**
 * Returns the Novac public key
 *
 * @throws Error
 * @return {string} The public api key for the Novac payment method.
 */
export const getPublicKey = () => {
    const public_key = getBlocksConfiguration()?.public_key;
    if ( ! public_key ) {
        throw new Error(
            'There is no public key available for Novac. Make sure it is available on the wc.novac_data.public_key property.'
        );
    }
    return public_key;
};