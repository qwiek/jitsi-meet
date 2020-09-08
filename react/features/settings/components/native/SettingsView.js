// @flow

import React from 'react';
import { Alert, NativeModules, View, Text, TextInput, TouchableOpacity, Image, Linking } from 'react-native';

import { translate } from '../../../base/i18n';
import { JitsiModal } from '../../../base/modal';
import { connect } from '../../../base/redux';
import { SETTINGS_VIEW_ID } from '../../constants';
import { normalizeUserInputURL, isServerURLChangeEnabled } from '../../functions';
import {
    AbstractSettingsView,
    _mapStateToProps as _abstractMapStateToProps,
    type Props as AbstractProps
} from '../AbstractSettingsView';

import { ColorPalette } from "../../../base/styles";
import styles from './styles';


/**
 * Application information module.
 */
const { AppInfo } = NativeModules;

type State = {

    /**
     * State variable for the disable call integration switch.
     */
    disableCallIntegration: boolean,

    /**
     * State variable for the disable p2p switch.
     */
    disableP2P: boolean,

    /**
     * State variable for the disable crash reporting switch.
     */
    disableCrashReporting: boolean,

    /**
     * State variable for the display name field.
     */
    displayName: string,

    /**
     * State variable for the email field.
     */
    email: string,

    /**
     * State variable for the server URL field.
     */
    serverURL: string,

    /**
     * Whether to show advanced settings or not.
     */
    showAdvanced: boolean,

    /**
     * State variable for the start with audio muted switch.
     */
    startWithAudioMuted: boolean,

    /**
     * State variable for the start with video muted switch.
     */
    startWithVideoMuted: boolean,
}

/**
 * The type of the React {@code Component} props of
 * {@link SettingsView}.
 */
type Props = AbstractProps & {

    /**
     * Flag indicating if URL can be changed by user.
     *
     * @protected
     */
    _serverURLChangeEnabled: boolean
}

/**
 * The native container rendering the app settings page.
 *
 * @extends AbstractSettingsView
 */
class SettingsView extends AbstractSettingsView<Props, State> {
    _urlField: Object;

    /**
     * Initializes a new {@code SettingsView} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        const {
            disableCallIntegration,
            disableCrashReporting,
            disableP2P,
            displayName,
            email,
            serverURL,
            startWithAudioMuted,
            startWithVideoMuted
        } = props._settings || {};

        this.state = {
            disableCallIntegration,
            disableCrashReporting,
            disableP2P,
            displayName,
            email,
            serverURL,
            showAdvanced: false,
            startWithAudioMuted,
            startWithVideoMuted
        };

        // Bind event handlers so they are only bound once per instance.
        this._onBlurServerURL = this._onBlurServerURL.bind(this);
        this._onClose = this._onClose.bind(this);
        this._setURLFieldReference = this._setURLFieldReference.bind(this);
        this._showURLAlert = this._showURLAlert.bind(this);
        this._openURL = this._openURL.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}, renders the settings page.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { displayName, email } = this.state;

        return (
            <JitsiModal
                modalId={SETTINGS_VIEW_ID}
                onClose={this._onClose}
                style={{ backgroundColor: ColorPalette.yellow }}>
                <View style={styles.container}>
                    <View style={styles.imageView}>
                        <Image style={{ width: 30, height: 30 }} source={require("../../../base/icons/png/home.png")} />
                    </View>
                    <View style={styles.actionContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Naam</Text>
                            <TextInput
                                style={styles.textInput}
                                aautoCorrect={false}
                                onChangeText={this._onChangeDisplayName}
                                textContentType={'name'} // iOS only
                                value={displayName} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType={'email-address'}
                                onChangeText={this._onChangeEmail}
                                textContentType={'emailAddress'} // iOS only
                                value={email} />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.lightText}>Software versie: v2020.09.1</Text>
                        <View style={styles.footerActions}>
                            <TouchableOpacity onPress={() => this._openURL("https://google.nl")}>
                                <Text style={styles.boldText}>Privacy </Text>
                            </TouchableOpacity>
                            <Text style={styles.boldText}> | </Text>
                            <TouchableOpacity onPress={() => this._openURL("https://qwiek.eu")}>
                                <Text style={styles.boldText}> Voorwaarden</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </JitsiModal>
        );
    }

    _openURL: () => void;

    /**
     * Handler the privacy clicked event
     *
     * @private
     * @param {string} url - The url that should be opened
     * @returns {void}
     */
    _openURL(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    _onBlurServerURL: () => void;

    /**
     * Handler the server URL lose focus event. Here we validate the server URL
     * and update it to the normalized version, or show an error if incorrect.
     *
     * @private
     * @returns {void}
     */
    _onBlurServerURL() {
        this._processServerURL(false /* hideOnSuccess */);
    }

    /**
     * Callback to update the display name.
     *
     * @param {string} displayName - The new value to set.
     * @returns {void}
     */
    _onChangeDisplayName(displayName) {
        super._onChangeDisplayName(displayName);
        this.setState({
            displayName
        });
    }

    /**
     * Callback to update the email.
     *
     * @param {string} email - The new value to set.
     * @returns {void}
     */
    _onChangeEmail(email) {
        super._onChangeEmail(email);
        this.setState({
            email
        });
    }

    /**
     * Callback to update the server URL.
     *
     * @param {string} serverURL - The new value to set.
     * @returns {void}
     */
    _onChangeServerURL(serverURL) {
        super._onChangeServerURL(serverURL);
        this.setState({
            serverURL
        });
    }

    _onClose: () => void;

    /**
     * Callback to be invoked on closing the modal. Also invokes normalizeUserInputURL to validate
     * the URL entered by the user.
     *
     * @returns {boolean} - True if the modal can be closed.
     */
    _onClose() {
        this.setState({ showAdvanced: false });

        return this._processServerURL(true /* hideOnSuccess */);
    }

    /**
     * Processes the server URL. It normalizes it and an error alert is
     * displayed in case it's incorrect.
     *
     * @param {boolean} hideOnSuccess - True if the dialog should be hidden if
     * normalization / validation succeeds, false otherwise.
     * @private
     * @returns {void}
     */
    _processServerURL(hideOnSuccess: boolean) {
        const { serverURL } = this.props._settings;
        const normalizedURL = normalizeUserInputURL(serverURL);

        if (normalizedURL === null) {
            this._showURLAlert();

            return false;
        }

        this._onChangeServerURL(normalizedURL);

        return hideOnSuccess;
    }

    _setURLFieldReference: (React$ElementRef<*> | null) => void;

    /**
     *  Stores a reference to the URL field for later use.
     *
     * @param {Object} component - The field component.
     * @protected
     * @returns {void}
     */
    _setURLFieldReference(component) {
        this._urlField = component;
    }

    _showURLAlert: () => void;

    /**
     * Shows an alert telling the user that the URL he/she entered was invalid.
     *
     * @returns {void}
     */
    _showURLAlert() {
        const { t } = this.props;

        Alert.alert(
            t('settingsView.alertTitle'),
            t('settingsView.alertURLText'),
            [
                {
                    onPress: () => this._urlField.focus(),
                    text: t('settingsView.alertOk')
                }
            ]
        );
    }

    _updateSettings: (Object) => void;

    /**
     * Updates the settings and sets state for disableCrashReporting.
     *
     * @param {boolean} disableCrashReporting - Whether crash reporting is disabled or not.
     * @returns {void}
     */
    _disableCrashReporting(disableCrashReporting) {
        this._updateSettings({ disableCrashReporting });
        this.setState({ disableCrashReporting });
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        ..._abstractMapStateToProps(state),
        _serverURLChangeEnabled: isServerURLChangeEnabled(state)
    };
}


export default translate(connect(_mapStateToProps)(SettingsView));
