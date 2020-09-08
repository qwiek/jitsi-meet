import React from 'react';
import {
    Animated,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';

import { getName } from '../../app/functions';
import { ColorSchemeRegistry } from '../../base/color-scheme';
import { translate } from '../../base/i18n';
import { Icon, IconMenu } from '../../base/icons';
import { MEDIA_TYPE } from '../../base/media';
import { LoadingIndicator, Text } from '../../base/react';
import { connect } from '../../base/redux';
import { ColorPalette } from '../../base/styles';
import {
    createDesiredLocalTracks,
    destroyLocalTracks
} from '../../base/tracks';
import { SettingsView } from '../../settings';
import { setSideBarVisible } from '../actions';

import { setActiveModalId } from '../../base/modal';
import { SETTINGS_VIEW_ID } from '../../settings';

import {
    AbstractWelcomePage,
    _mapStateToProps as _abstractMapStateToProps
} from './AbstractWelcomePage';
import WelcomePageLists from './WelcomePageLists';
import styles from './styles';
import Card from './Card';


/**
 * The native container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Constructor of the Component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state._fieldFocused = false;
        this.state.hintBoxAnimation = new Animated.Value(0);

        // Bind event handlers so they are only bound once per instance.
        this._onFieldFocusChange = this._onFieldFocusChange.bind(this);
        this._onShowSideBar = this._onShowSideBar.bind(this);

        // Specially bind functions to avoid function definition on render.
        this._onFieldBlur = this._onFieldFocusChange.bind(this, false);
        this._onFieldFocus = this._onFieldFocusChange.bind(this, true);

        this._onOpenSettings = this._onOpenSettings.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        this._updateRoomname();

        const { dispatch } = this.props;

        if (this.props._settings.startAudioOnly) {
            dispatch(destroyLocalTracks());
        } else {
            // Make sure we don't request the permission for the camera from
            // the start. We will, however, create a video track iff the user
            // already granted the permission.
            navigator.permissions.query({ name: 'camera' }).then(response => {
                response === 'granted'
                    && dispatch(createDesiredLocalTracks(MEDIA_TYPE.VIDEO));
            });
        }
    }

    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // We want to have the welcome page support the reduced UI layout,
        // but we ran into serious issues enabling it so we disable it
        // until we have a proper fix in place. We leave the code here though, because
        // this part should be fine when the bug is fixed.
        //
        // NOTE: when re-enabling, don't forget to uncomment the respective _mapStateToProps line too

        /*
        const { _reducedUI } = this.props;

        if (_reducedUI) {
            return this._renderReducedUI();
        }
        */

        return this._renderFullUI();
    }

    /**
     * Callback for when the room field's focus changes so the hint box
     * must be rendered or removed.
     *
     * @private
     * @param {boolean} focused - The focused state of the field.
     * @returns {void}
     */
    _onFieldFocusChange(focused) {
        focused
            && this.setState({
                _fieldFocused: true
            });

        Animated.timing(
            this.state.hintBoxAnimation,
            {
                duration: 300,
                toValue: focused ? 1 : 0
            })
            .start(animationState =>
                animationState.finished
                && !focused
                && this.setState({
                    _fieldFocused: false
                }));
    }

    /**
     * Toggles the side bar.
     *
     * @private
     * @returns {void}
     */
    _onShowSideBar() {
        Keyboard.dismiss();
        this.props.dispatch(setSideBarVisible(true));
    }

    /**
     * Renders the join button.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderJoinButton() {
        const { t } = this.props;
        let children;


        if (this.state.joining) {
            // TouchableHighlight is picky about what its children can be, so
            // wrap it in a native component, i.e. View to avoid having to
            // modify non-native children.
            children = (
                <View>
                    <LoadingIndicator
                        color={styles.buttonText.color}
                        size='small' />
                </View>
            );
        } else {
            children = (
                <Text style={styles.buttonText}>
                    {this.props.t('welcomepage.join')}
                </Text>
            );
        }

        return (
            <TouchableHighlight
                accessibilityLabel=
                {t('welcomepage.accessibilityLabel.join')}
                onPress={this._onJoin}
                style={styles.button}
                underlayColor={ColorPalette.white}>
                {children}
            </TouchableHighlight>
        );
    }

    _onOpenSettings: () => void;

    /**
     * Shows the {@link SettingsView}.
     *
     * @private
     * @returns {void}
     */
    _onOpenSettings() {
        const { dispatch } = this.props;

        dispatch(setSideBarVisible(false));
        dispatch(setActiveModalId(SETTINGS_VIEW_ID));
    }

    /**
     * Renders the full welcome page.
     *
     * @returns {ReactElement}
     */
    _renderFullUI() {
        const { _headerStyles, t } = this.props;

        return (
            <View style={{ flex: 1, top: 0, right: 0, backgroundColor: ColorPalette.lightBackground }}>
                <View style={styles.backgroundShade}></View>
                <View style={_headerStyles.page}>
                    <TouchableOpacity style={styles.triangleCorner} onPress={this._onOpenSettings}>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navImage} onPress={this._onOpenSettings}>
                        <Icon
                            src={IconMenu}
                            style={[{ ..._headerStyles.headerButtonIcon }, { ...styles.navImage }]} />
                    </TouchableOpacity>
                    <SafeAreaView style={styles.roomContainer} >
                        <Text style={styles.enterRoomText}>
                            <Text style={styles.lightText}>Voer het </Text>
                            <Text style={styles.boldText}>serienummer </Text>
                            <Text style={styles.lightText}>van de </Text>
                            <Text style={styles.boldText}>Qwiek.Up </Text>
                            <Text style={styles.lightText}>in om mee te verbinden</Text>
                        </Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                autoCapitalize='none'
                                autoComplete='off'
                                autoCorrect={false}
                                autoFocus={false}
                                onBlur={this._onFieldBlur}
                                onChangeText={this._onRoomChange}
                                onFocus={this._onFieldFocus}
                                onSubmitEditing={this._onJoin}
                                placeholderTextColor={ColorPalette.textColor}
                                returnKeyType={'go'}
                                style={styles.textInput}
                                underlineColorAndroid='transparent'
                                value={this.state.room} />
                            <TouchableOpacity style={styles.joinButton} onPress={this._onJoin}>
                                <Image style={{ width: 30, height: 30 }} source={require("../../base/icons/png/arrow_right.png")} />
                            </TouchableOpacity>
                        </View>
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardTitleText}>Verbinding Geschiedenis</Text>
                            <WelcomePageLists disabled={this.state._fieldFocused} />
                        </Card>
                    </SafeAreaView>
                </View>
                {this._renderWelcomePageModals()}
            </View>
        );
    }

    /**
     * Renders a "reduced" version of the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderReducedUI() {
        const { t } = this.props;

        return (
            <View style={styles.reducedUIContainer}>
                <Text style={styles.reducedUIText}>
                    {t('welcomepage.reducedUIText', { app: getName() })}
                </Text>
            </View>
        );
    }

    /**
     * Renders JitsiModals that are supposed to be on the welcome page.
     *
     * @returns {Array<ReactElement>}
     */
    _renderWelcomePageModals() {
        return [
            <SettingsView key='settings' />
        ];
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        ..._abstractMapStateToProps(state),
        _headerStyles: ColorSchemeRegistry.get(state, 'Header')

        // _reducedUI: state['features/base/responsive-ui'].reducedUI
    };
}

export default translate(connect(_mapStateToProps)(WelcomePage));
