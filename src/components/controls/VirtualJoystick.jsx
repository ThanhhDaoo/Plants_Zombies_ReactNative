import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

const JOYSTICK_RADIUS = 60;
const KNOB_RADIUS = 26;

export const VirtualJoystick = ({ onMove }) => {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const centerRef = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Center is the start touch location
        setKnobPos({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const dist = Math.hypot(dx, dy);

        let clampedX = dx;
        let clampedY = dy;
        let vx = 0;
        let vy = 0;

        if (dist > 0) {
          const maxDist = JOYSTICK_RADIUS;
          const factor = Math.min(dist, maxDist) / dist;
          clampedX = dx * factor;
          clampedY = dy * factor;

          vx = clampedX / maxDist;
          vy = clampedY / maxDist;
        }

        setKnobPos({ x: clampedX, y: clampedY });
        if (onMove) {
          onMove({ vx, vy });
        }
      },
      onPanResponderRelease: () => {
        setKnobPos({ x: 0, y: 0 });
        if (onMove) {
          onMove({ vx: 0, vy: 0 });
        }
      },
      onPanResponderTerminate: () => {
        setKnobPos({ x: 0, y: 0 });
        if (onMove) {
          onMove({ vx: 0, vy: 0 });
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Outer Glow Ring */}
      <View style={styles.outerRing}>
        {/* Direction Crosshairs */}
        <View style={styles.crosshairH} />
        <View style={styles.crosshairV} />

        {/* Floating Knob */}
        <View
          style={[
            styles.knob,
            {
              transform: [
                { translateX: knobPos.x },
                { translateY: knobPos.y },
              ],
            },
          ]}
        >
          <View style={styles.knobInner} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    width: JOYSTICK_RADIUS * 2 + 30,
    height: JOYSTICK_RADIUS * 2 + 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  outerRing: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: 'rgba(20, 30, 20, 0.45)',
    borderWidth: 2.5,
    borderColor: 'rgba(102, 187, 106, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: JOYSTICK_RADIUS * 1.5,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  crosshairV: {
    position: 'absolute',
    height: JOYSTICK_RADIUS * 1.5,
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  knob: {
    width: KNOB_RADIUS * 2,
    height: KNOB_RADIUS * 2,
    borderRadius: KNOB_RADIUS,
    backgroundColor: 'rgba(76, 175, 80, 0.85)',
    borderWidth: 2,
    borderColor: '#a5d6a7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  knobInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
});
