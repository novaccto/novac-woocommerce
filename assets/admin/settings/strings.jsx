/* eslint-disable max-len */
/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import interpolateComponents from '@automattic/interpolate-components';

export default {
    button: {
        get_started: __(
            'Get Started!',
            'novac-woo'
        ),
        save_settings: __(
            'Save Configuration',
            'novac-woo'
        ),
        enable_test_mode: __( 'Enable Test mode', 'novac-woo' ),
        disable_test_mode: __( 'Disable Test mode', 'novac-woo' ),
    },
    heading: ( firstName ) =>
        sprintf(
            /* translators: %s: first name of the merchant, if it exists, %s: Novac. */
            __( 'Hi%s,\n Welcome to %s!', 'novac-woo' ),
            firstName ? ` ${ firstName }` : '',
            'Novac'
        ),
    settings: {
        general: __(
            'API/Webhook Settings',
            'novac-woo'
        ),
        checkout: __(
            'Checkout Settings',
            'novac-woo'
        ),
    },
    card: __(
        'Offer card payments',
        'novac-woo'
    ),
    sandboxMode: {
        title: __(
            "Test Mode: I'm setting up a store for someone else.",
            'novac-woo'
        ),
        description: sprintf(
            /* translators: %s: Novac */
            __(
                'This option will set up %s in test mode. When you’re ready to launch your store, switching to live payments is easy.',
                'novac-woo'
            ),
            'Novac'
        ),
    },
    testModeNotice: interpolateComponents( {
        mixedString: __(
            'Test mode is enabled, only test credentials can be used to make payments. If you want to process live transactions, please {{learnMoreLink}}disable it{{/learnMoreLink}}.',
            'novac-woo'
        ),
        components: {
            learnMoreLink: (
                // Link content is in the format string above. Consider disabling jsx-a11y/anchor-has-content.
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                />
            ),
        },
    } ),
    infoNotice: {
        button: __( 'enable collection.', 'novac-woo' ),
    },
    infoModal: {
        title: sprintf(
            /* translators: %s: Novac */
            __( 'Verifying your information with %s', 'novac-woo' ),
            'Novac'
        ),

    },
    stepsHeading: __(
        'You’re only steps away from getting paid',
        'novac-woo'
    ),
    step1: {
        heading: __(
            'Create and connect your account',
            'novac-woo'
        ),
        description: __(
            'To ensure safe and secure transactions, a WordPress.com account is required.',
            'novac-woo'
        ),
    },
    step3: {
        heading: __( 'Setup complete!', 'novac-woo' ),
        description: sprintf(
            /* translators: %s: Novac */
            __(
                'You’re ready to start using the features and benefits of %s.',
                'novac-woo'
            ),
            'Novac'
        ),
    },
    onboardingDisabled: __(
        "We've temporarily paused new account creation. We'll notify you when we resume!",
        'novac-woo'
    ),
    incentive: {
        termsAndConditions: ( url ) =>
            createInterpolateElement(
                __(
                    '*See <a>Terms and Conditions</a> for details.',
                    'novac-woo'
                ),
                {
                    a: (
                        // eslint-disable-next-line jsx-a11y/anchor-has-content
                        <a
                            href={ url }
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }
            ),
    },
    nonSupportedCountry: createInterpolateElement(
        sprintf(
            /* translators: %1$s: Novac */
            __(
                '<b>%1$s is not currently available in your location</b>.',
                'novac-woo'
            ),
            'Novac'
        ),
        {
            b: <b />,
            a: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                />
            ),
        }
    ),
};