import * as Haptics from 'expo-haptics';
import { usePlayerStore } from '../../store/usePlayerStore';

class SoundServiceImpl {
  async playSunCollect() {
    this.triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  async playPlant() {
    this.triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
  }

  async playShoot() {
    // Minimal vibration / sound
  }

  async playSplat() {
    this.triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  async playExplosion() {
    this.triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
  }

  async playLawnMower() {
    this.triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
  }

  private triggerHaptic(style: Haptics.ImpactFeedbackStyle) {
    if (usePlayerStore.getState().hapticEnabled) {
      try {
        Haptics.impactAsync(style);
      } catch {
        // Fallback for unsupported devices/web
      }
    }
  }
}

export const SoundService = new SoundServiceImpl();
