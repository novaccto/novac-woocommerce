/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { PAYMENT_METHOD_NAME } from './contants';
import {
    getBlocksConfiguration,
} from 'wcnovac/blocks/utils';

/**
 * Content component
 */
const Content = () => {
    return <div>{ decodeEntities( getBlocksConfiguration()?.description || __('You may be redirected to a secure page to complete your payment.', 'novac-woo') ) }</div>;
};

const NOVAC_ASSETS = getBlocksConfiguration()?.asset_url ?? null;


const paymentMethod = {
    name: PAYMENT_METHOD_NAME,
    label: (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2em', alignItems: 'center'}}>
            <img
                src={ `${NOVAC_ASSETS}/img/logo.png` }
                alt={ decodeEntities(
                    getBlocksConfiguration()?.title || __( 'Novac', 'novac-woo' )
                ) }
            />
            <b><h4>Novac</h4></b>
        </div>
    ),
    placeOrderButtonLabel: __(
        'Checkout with Novac',
        'novac-woo'
    ),
    ariaLabel: decodeEntities(
        getBlocksConfiguration()?.title ||
        __( 'Payment via Novac', 'novac-woo' )
    ),
    canMakePayment: () => true,
    content: <Content />,
    edit: <Content />,
    paymentMethodId: PAYMENT_METHOD_NAME,
    supports: {
        features:  getBlocksConfiguration()?.supports ?? [],
    },
}

export default paymentMethod;