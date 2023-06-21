"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimatedValues = void 0;
var react_1 = __importStar(require("react"));
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var useNode_1 = require("../hooks/useNode");
var propsContext_1 = require("./propsContext");
var constants_1 = require("../constants");
if (!react_native_reanimated_1.useValue) {
    throw new Error("Incompatible Reanimated version (useValue not found)");
}
var AnimatedValueContext = react_1.default.createContext(undefined);
function AnimatedValueProvider(_a) {
    var children = _a.children;
    var value = useSetupAnimatedValues();
    return (react_1.default.createElement(AnimatedValueContext.Provider, { value: value }, children));
}
exports.default = AnimatedValueProvider;
function useAnimatedValues() {
    var value = react_1.useContext(AnimatedValueContext);
    if (!value) {
        throw new Error("useAnimatedValues must be called from within AnimatedValueProvider!");
    }
    return value;
}
exports.useAnimatedValues = useAnimatedValues;
function useSetupAnimatedValues() {
    var props = propsContext_1.useProps();
    var containerSize = react_native_reanimated_1.useValue(0);
    var touchInit = react_native_reanimated_1.useValue(0); // Position of initial touch
    var activationDistance = react_native_reanimated_1.useValue(0); // Distance finger travels from initial touch to when dragging begins
    var touchAbsolute = react_native_reanimated_1.useValue(0); // Finger position on screen, relative to container
    var panGestureState = react_native_reanimated_1.useValue(react_native_gesture_handler_1.State.UNDETERMINED);
    var isTouchActiveNative = react_native_reanimated_1.useValue(0);
    var disabled = react_native_reanimated_1.useValue(0);
    var horizontalAnim = react_native_reanimated_1.useValue(props.horizontal ? 1 : 0);
    var activeIndexAnim = react_native_reanimated_1.useValue(-1); // Index of hovering cell
    var spacerIndexAnim = react_native_reanimated_1.useValue(-1); // Index of hovered-over cell
    var activeCellSize = react_native_reanimated_1.useValue(0); // Height or width of acctive cell
    var activeCellOffset = react_native_reanimated_1.useValue(0); // Distance between active cell and edge of container
    var isDraggingCell = useNode_1.useNode(react_native_reanimated_1.and(isTouchActiveNative, react_native_reanimated_1.greaterThan(activeIndexAnim, -1)));
    var scrollOffset = react_native_reanimated_1.useValue(0);
    var outerScrollOffset = props.outerScrollOffset || constants_1.DEFAULT_PROPS.outerScrollOffset;
    var outerScrollOffsetSnapshot = react_native_reanimated_1.useValue(0); // Amount any outer scrollview has scrolled since last gesture event.
    var outerScrollOffsetDiff = react_native_reanimated_1.sub(outerScrollOffset, outerScrollOffsetSnapshot);
    var scrollViewSize = react_native_reanimated_1.useValue(0);
    var touchCellOffset = useNode_1.useNode(react_native_reanimated_1.sub(touchInit, activeCellOffset));
    var hoverAnimUnconstrained = useNode_1.useNode(react_native_reanimated_1.add(outerScrollOffsetDiff, react_native_reanimated_1.sub(react_native_reanimated_1.sub(touchAbsolute, activationDistance), touchCellOffset)));
    var hoverAnimConstrained = useNode_1.useNode(react_native_reanimated_1.min(react_native_reanimated_1.sub(containerSize, activeCellSize), react_native_reanimated_1.max(0, hoverAnimUnconstrained)));
    var hoverAnim = props.dragItemOverflow
        ? hoverAnimUnconstrained
        : hoverAnimConstrained;
    var hoverOffset = useNode_1.useNode(react_native_reanimated_1.add(hoverAnim, scrollOffset));
    react_native_reanimated_1.useCode(function () {
        return react_native_reanimated_1.onChange(touchAbsolute, 
        // If the list is being used in "nested" mode (ie. there's an outer scrollview that contains the list)
        // then we need a way to track the amound the outer list has auto-scrolled during the current touch position.
        react_native_reanimated_1.set(outerScrollOffsetSnapshot, outerScrollOffset));
    }, [outerScrollOffset]);
    var placeholderOffset = react_native_reanimated_1.useValue(0);
    // Note: this could use a refactor as it combines touch state + cell animation
    var resetTouchedCell = useNode_1.useNode(react_native_reanimated_1.block([
        react_native_reanimated_1.set(touchAbsolute, 0),
        react_native_reanimated_1.set(touchInit, 0),
        react_native_reanimated_1.set(activeCellOffset, 0),
        react_native_reanimated_1.set(activationDistance, 0),
    ]));
    var value = react_1.useMemo(function () { return ({
        activationDistance: activationDistance,
        activeCellOffset: activeCellOffset,
        activeCellSize: activeCellSize,
        activeIndexAnim: activeIndexAnim,
        containerSize: containerSize,
        disabled: disabled,
        horizontalAnim: horizontalAnim,
        hoverAnim: hoverAnim,
        hoverAnimConstrained: hoverAnimConstrained,
        hoverAnimUnconstrained: hoverAnimUnconstrained,
        hoverOffset: hoverOffset,
        isDraggingCell: isDraggingCell,
        isTouchActiveNative: isTouchActiveNative,
        panGestureState: panGestureState,
        placeholderOffset: placeholderOffset,
        resetTouchedCell: resetTouchedCell,
        scrollOffset: scrollOffset,
        scrollViewSize: scrollViewSize,
        spacerIndexAnim: spacerIndexAnim,
        touchAbsolute: touchAbsolute,
        touchCellOffset: touchCellOffset,
        touchInit: touchInit,
    }); }, [
        activationDistance,
        activeCellOffset,
        activeCellSize,
        activeIndexAnim,
        containerSize,
        disabled,
        horizontalAnim,
        hoverAnim,
        hoverAnimConstrained,
        hoverAnimUnconstrained,
        hoverOffset,
        isDraggingCell,
        isTouchActiveNative,
        panGestureState,
        placeholderOffset,
        resetTouchedCell,
        scrollOffset,
        scrollViewSize,
        spacerIndexAnim,
        touchAbsolute,
        touchCellOffset,
        touchInit,
    ]);
    react_1.useEffect(function () {
        var _a;
        (_a = props.onAnimValInit) === null || _a === void 0 ? void 0 : _a.call(props, value);
    }, [value]);
    return value;
}
