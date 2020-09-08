import { ColorPalette } from '../../../base/styles';

export const ANDROID_UNDERLINE_COLOR = 'transparent';
export const PLACEHOLDER_COLOR = ColorPalette.lightGrey;

const TEXT_SIZE = 17;

/**
 * The styles of the native components of the feature {@code settings}.
 */
export default {
    /**
     * Standardized style for a field container {@code View}.
     */
    fieldContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 65,
        paddingHorizontal: 8
    },

    /**
     * * Appended style for column layout fields.
     */
    fieldContainerColumn: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingVertical: 3
    },

    /**
     * Standard container for a {@code View} containing a field label.
     */
    fieldLabelContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 5
    },

    /**
     * Text of the field labels on the form.
     */
    fieldLabelText: {
        fontSize: TEXT_SIZE
    },

    /**
     * Appended style for column layout fields.
     */
    fieldLabelTextColumn: {
        fontSize: 12
    },

    /**
     * Field container style for all but last row {@code View}.
     */
    fieldSeparator: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },

    /**
     * Style for the {@code View} containing each
     * field values (the actual field).
     */
    fieldValueContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    /**
     * Style fo the form section separator titles.
     */
    formSectionTitle: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 5
    },

    /**
     * Global {@code Text} color for the components.
     */
    text: {
        color: ColorPalette.black
    },

    /**
     * Standard text input field style.
     */
    textInputField: {
        color: ColorPalette.black,
        flex: 1,
        fontSize: TEXT_SIZE,
        textAlign: 'right'
    },

    /**
     * Appended style for column layout fields.
     */
    textInputFieldColumn: {
        backgroundColor: 'rgb(245, 245, 245)',
        borderRadius: 8,
        marginVertical: 5,
        paddingVertical: 3,
        textAlign: 'left'
    },

    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: ColorPalette.yellow
    },

    header: {
        flex: 1,
        margin: 20,
    },

    closeButton: {
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },

    actionContainer: {
        flex: 5,
        justifyContent: "flex-start",
        alignItems: "center",
    },

    footer: {
        flex: 1,
        alignItems: "center"
    },

    footerActions: {
        flexDirection: "row",
    },

    inputContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        marginVertical: 20
    },

    inputLabel: {
        width: "70%",
        fontFamily: "SourceSansPro-SemiBold"

    },

    textInput: {
        backgroundColor: 'white',
        borderColor: ColorPalette.white,
        borderRadius: 4,
        borderWidth: 1,
        color: ColorPalette.textColor,
        fontSize: 23,
        height: 50,
        width: "70%",
        padding: 4,
        textAlign: 'center'
    },

    imageView: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
    },

    lightText: {
        fontFamily: "SourceSansPro-Light"
    },

    boldText: {
        fontFamily: "SourceSansPro-SemiBold"
    },
};
