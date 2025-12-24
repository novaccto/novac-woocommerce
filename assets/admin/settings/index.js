import { registerPlugin } from "@wordpress/plugins";
import { addFilter } from "@wordpress/hooks";
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { useEffect, useState } from '@wordpress/element';
// import { sanitizeHTML } from '@woocommerce/utils';
// import { RawHTML } from '@wordpress/element';
// Example of RawHTML and sanitize HTML: https://github.com/Saggre/woocommerce/blob/e38ffc8427ec4cc401d90482939bae4cddb69d7c/plugins/woocommerce-blocks/assets/js/extensions/payment-methods/bacs/index.js#L24

import {
    Button,
    Panel,
    PanelBody,
    Card,
    Snackbar,
    CheckboxControl,
    ToggleControl,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    __experimentalInputControl as InputControl,
    ResponsiveWrapper
} from '@wordpress/components';
import { WooNavigationItem } from "@woocommerce/navigation";
// import * as Woo from '@woocommerce/components';
import { Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
// import { addQueryArgs } from '@wordpress/url';

/** Internal Dependencies */
import strings from './strings';
import Page from 'wcnovac/admin/components/page';
import Input, { CustomSelectControl } from 'wcnovac/admin/components/input';
// import { CheckoutIcon, EyeIcon } from 'wcnovac/admin/icons';

const NAMESPACE = "novac/v1";
const ENDPOINT = "/settings";

import './index.scss';

apiFetch({ path: NAMESPACE + ENDPOINT }).then((configuration) => console.log(configuration));

// https://woocommerce.github.io/woocommerce-blocks/?path=/docs/icons-icon-library--docs

const NovacSaveButton = ( { children, onClick } ) => {
    const [isBusy, setIsBusy] = useState(false);
    useEffect(() => {}, [isBusy]);
    return (
        <Button
            className="novac-settings-cta"
            variant="secondary"
            isBusy={ isBusy }
            disabled={ false }
            onClick={ () => {
                setIsBusy(true);
                onClick(setIsBusy);
            } }
        >
            { children }
        </Button>
    )
}

const EnableTestModeButton = ({ onClick, isDestructive, isBusy, children}) => {
    const [ isRed, setIsRed ] = useState(isDestructive);
    useEffect(() => {}, [isDestructive]);
    return (
        <Button
            className="novac-settings-cta"
            variant="secondary"
            isBusy={ isBusy }
            disabled={ false }
            isDestructive={ isRed }
            onClick={ () => {
                onClick()
                setIsRed(!isRed)
            } }
        >
            {children}
        </Button>
    )
}

const NovacSettings = () => {
    /** Initial Values */
    const default_settings = novacData?.novac_defaults;
    const [openGeneralPanel, setOpenGeneralPanel] = useState(false);
    ;	const firstName = wcSettings.admin?.currentUserData?.first_name || 'there';
    const NOVAC_LOGO_URL = novacData?.novac_logo;
    const [novacSettings, setNovacSettings] = useState(default_settings);
    const [enableGetStartedBtn, setEnabledGetstartedBtn] = useState(false);
    const payment_style_on_checkout_options = [
        { label: 'Redirect', value: 'redirect' },
        // { label: 'Popup', value: 'inline' },
    ];

    const [errors, setErrors] = useState({
        live_secret_key: '',
        live_public_key: '',
        test_secret_key: '',
        test_public_key: '',
    });

    let headingStyle = {  };

    if(firstName != '') {
        headingStyle['whiteSpaceCollapse'] = 'preserve-breaks';
    }
    /** Initial Values End */

    /** Handlers */
    const handleChange = (key, value) => {
        setNovacSettings(prevSettings => ({
            ...prevSettings,
            [key]: value
        }));
    };

    const validateKey = (key, type) => {
        if (type === 'public') {
            return key.startsWith('nc_livepk_') || key.startsWith('nc_testpk_');
        }
        if (type === 'secret') {
            return key.startsWith('nc_livesk_') || key.startsWith('nc_testsk_');
        }
        return false;
    };


    const handleSecretKeyChange = (value) => {
        handleChange('live_secret_key', value);

        const isValid = validateKey(value, 'secret');
        setErrors((prev) => ({
            ...prev,
            live_secret_key: isValid ? '' : 'Invalid Secret Key. Must start with nc_livesk_',
        }));
    };

    const handlePublicKeyChange = (value) => {
        handleChange('live_public_key', value);

        const isValid = validateKey(value, 'public');
        setErrors((prev) => ({
            ...prev,
            live_public_key: isValid ? '' : 'Invalid Public Key. Must start with nc_livepk_',
        }));
    };

    const handlePaymentTitle = (evt) => {
        handleChange('title', evt);
    }


    const handleTestSecretKeyChange = (value) => {
        handleChange('test_secret_key', value);

        const isValid = validateKey(value, 'secret');
        setErrors((prev) => ({
            ...prev,
            test_secret_key: isValid ? '' : 'Invalid Secret Key. Must start with nc_testsk_',
        }));
    };

    const handleTestPublicKeyChange = (value) => {
        handleChange('test_public_key', value);

        const isValid = validateKey(value, 'public');
        setErrors((prev) => ({
            ...prev,
            test_public_key: isValid ? '' : 'Invalid Public Key. Must start with nc_livesk_',
        }));
    };

    return (
        <Fragment>
            <Page isNarrow >
                <Card className="novac-page-banner">

                    <div className="novac-page__heading">
                        <img className="novac__settings_logo" alt="novac-logo" src={ NOVAC_LOGO_URL } id="novac__settings_logo" />

                        <h2 className="novac-font-heading" style={{ marginLeft: "15px", ...headingStyle }}>{ strings.heading( firstName ) }</h2>
                    </div>

                    <div className="novac-page__buttons">
                        <Button
                            variant="primary"
                            isBusy={ false }
                            disabled={ enableGetStartedBtn }
                            onClick={ () => {
                                setOpenGeneralPanel(true);
                                setEnabledGetstartedBtn(false);
                            } }
                        >
                            { strings.button.get_started }
                        </Button>
                    </div>

                </Card>

                <Panel className="novac-page__general_settings-panel">
                    <PanelBody
                        title={ strings.settings.general }
                        initialOpen={ openGeneralPanel }
                    >
                        <div className="novac-settings__general">
                            <ToggleControl
                                checked={ novacSettings.enabled == 'yes' }
                                label="Enable Novac"
                                onChange={() => setNovacSettings( prevSettings => ({
                                    ...prevSettings,
                                    enabled: prevSettings.enabled == 'yes' ? 'no' : 'yes' // Toggle the value
                                }) )}
                            />

                            <div className="novac-settings__inputs">
                                <Input labelName="Secret Key" initialValue={ novacSettings.live_secret_key } onChange={ handleSecretKeyChange } isConfidential error={errors.live_secret_key} />
                                <Input labelName="Public Key" initialValue={ novacSettings.live_public_key } onChange={ handlePublicKeyChange }  error={errors.live_public_key}/>
                            </div>

                            <Text className="novac-webhook-link" numberOfLines={1} color="red" >
                                { novacData.novac_webhook }
                            </Text>

                            <Text className="novac-webhook-instructions" numberOfLines={1} >
                                Please add this webhook URL and paste on the webhook section on your dashboard.
                            </Text>
                        </div>

                        <div className="novac-settings-btn-center">
                            <NovacSaveButton onClick={ (setIsBusy) => {
                                apiFetch({
                                    path: NAMESPACE + ENDPOINT,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-WP-Nonce': wpApiSettings.nonce,
                                    },
                                    data: novacSettings // Send the updated settings to the server
                                }).then(response => {
                                    console.log('Settings saved successfully:', response);
                                    // Optionally, you can update the UI or show a success message here
                                    setIsBusy(false);

                                }).catch(error => {
                                    console.error('Error saving settings:', error);
                                    // Handle errors if any
                                });
                            } }>
                                { strings.button.save_settings }
                            </NovacSaveButton>
                        </div>
                    </PanelBody>
                </Panel>

                <Panel className="novac-page__checkout_settings-panel">
                    <PanelBody
                        title={ strings.settings.checkout }
                        // icon={ CheckoutIcon }
                        initialOpen={ false }
                    >
                        {/* <Woo.CheckboxControl
						instanceId="novac-autocomplete-order"
						checked={ true }
						label="Autocomplete Order After Payment"
						onChange={ ( isChecked ) => {
							console.log(isChecked);
						} }
						/> */}


                        <div className="novac-settings__inputs">
                            <CheckboxControl
                                checked={ novacSettings.autocomplete_order == 'yes' }
                                help="should we complete the order on a confirmed payment?"
                                label="Autocomplete Order After Payment"
                                onChange={ () => setNovacSettings( prevSettings => ({
                                    ...prevSettings,
                                    autocomplete_order: prevSettings.autocomplete_order == 'yes' ? 'no' : 'yes' // Toggle the value
                                }) ) }
                            />
                            <Input labelName="Payment method Title" initialValue={ novacSettings.title } onChange={ handlePaymentTitle } />
                            <CustomSelectControl labelName="Payment Style on Checkout" initialValue={ novacSettings.payment_style } options={ payment_style_on_checkout_options } />
                        </div>

                        <div className="novac-settings-btn-center">
                            <NovacSaveButton onClick={ (setIsBusy) => {
                                apiFetch({
                                    path: NAMESPACE + ENDPOINT,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-WP-Nonce': wpApiSettings.nonce,
                                    },
                                    data: novacSettings // Send the updated settings to the server
                                }).then(response => {
                                    console.log('Settings saved successfully:', response);
                                    // Optionally, you can update the UI or show a success message here
                                    setIsBusy(false);

                                }).catch(error => {
                                    console.error('Error saving settings:', error);
                                    // Handle errors if any
                                });
                            } }>
                                { strings.button.save_settings }
                            </NovacSaveButton>
                        </div>
                    </PanelBody>
                </Panel>

                <Panel className="novac-page__sandbox-mode-panel">
                    <PanelBody
                        title={ strings.sandboxMode.title }
                        initialOpen={ false }
                    >
                        <p>{ strings.sandboxMode.description }</p>
                        <div className="budpday-settings__inputs">
                            <Input labelName="Test Secret Key" initialValue={ novacSettings.test_secret_key } onChange={ handleTestSecretKeyChange }  isConfidential error={errors.test_secret_key}/>
                            <Input labelName="Test Public Key" initialValue={ novacSettings.test_public_key } onChange={ handleTestPublicKeyChange }  error={errors.test_public_key}/>
                        </div>
                        <EnableTestModeButton
                            className="novac-settings-cta"
                            variant="secondary"
                            isBusy={ false }
                            disabled={ false }
                            isDestructive={ novacSettings.go_live == 'no' }
                            onClick={ () => {
                                setNovacSettings( prevSettings => ({
                                    ...prevSettings,
                                    go_live: (prevSettings.go_live == 'yes') ? 'no' : 'yes' // Toggle the value
                                }) )

                                apiFetch({
                                    path: NAMESPACE + ENDPOINT,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-WP-Nonce': wpApiSettings.nonce,
                                    },
                                    data: { ...novacSettings, go_live: (novacSettings.go_live == 'yes') ? 'no' : 'yes'  } // Send the updated settings to the server
                                }).then(response => {
                                    console.log('Test mode enabled successfully:', response);
                                    // Optionally, you can update the UI or show a success message here
                                }).catch(error => {
                                    console.error('Error saving settings:', error);
                                    // Handle errors if any
                                });
                            } }
                        >
                            { (novacSettings.go_live === 'yes') ?  strings.button.enable_test_mode: strings.button.disable_test_mode  }
                        </EnableTestModeButton>
                    </PanelBody>
                </Panel>
            </Page>
        </Fragment>
    );
}

addFilter("woocommerce_admin_pages_list", "novac", (pages) => {
    pages.push({
        container: NovacSettings,
        path: "/novac",
        wpOpenMenu: "toplevel_page_woocommerce",
        breadcrumbs: ["Novac"],
    });

    return pages;
});

const NovacNav = () => {
    return (
        <WooNavigationItem parentMenu="novac-root" item="novac-1">
            <a className="components-button" href="https://novac.com/1">
                Novac
            </a>
        </WooNavigationItem>
    );
};

registerPlugin("my-plugin", { render: NovacNav });