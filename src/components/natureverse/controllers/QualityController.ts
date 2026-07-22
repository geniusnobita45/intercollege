import type { QualitySettings, QualityTier } from '../types';
import { makeSettings } from '../config/natureVerseConfig';

const downgradeOrder: Record<QualityTier, QualityTier> = {
  high: 'medium',
  medium: 'low',
  low: 'minimal',
  minimal: 'minimal',
};

export class QualityController {
  private samples: number[] = [];
  private below35Seconds = 0;
  private below25Seconds = 0;
  private below18Seconds = 0;
  private lastCheck = 0;

  constructor(private settings: QualitySettings, private readonly onTierChange: (settings: QualitySettings) => void) {}

  get current() {
    return this.settings;
  }

  forceTier(tier: QualityTier) {
    this.setTier(tier);
  }

  record(delta: number, elapsed: number) {
    if (this.settings.reducedMotion || this.settings.tier === 'minimal' || delta <= 0) return;
    const fps = 1 / Math.max(delta, 0.001);
    this.samples.push(fps);
    if (this.samples.length > 120) this.samples.shift();
    if (elapsed - this.lastCheck < 1.5 || this.samples.length < 45) return;
    this.lastCheck = elapsed;

    const average = this.samples.reduce((sum, value) => sum + value, 0) / Math.max(1, this.samples.length);
    this.below35Seconds = average < 35 ? this.below35Seconds + 1.5 : 0;
    this.below25Seconds = average < 25 ? this.below25Seconds + 1.5 : 0;
    this.below18Seconds = average < 18 ? this.below18Seconds + 1.5 : 0;

    if (this.below18Seconds >= 3) {
      this.setTier('minimal');
      this.resetSamples();
    } else if (this.below25Seconds >= 4) {
      this.setTier('low');
      this.resetSamples();
    } else if (this.below35Seconds >= 5) {
      this.setTier(downgradeOrder[this.settings.tier]);
      this.resetSamples();
    }
  }

  private resetSamples() {
    this.samples.length = 0;
    this.below35Seconds = 0;
    this.below25Seconds = 0;
    this.below18Seconds = 0;
  }

  private setTier(tier: QualityTier) {
    if (this.settings.tier === tier) return;
    this.settings = makeSettings(tier, this.settings.reducedMotion);
    this.onTierChange(this.settings);
  }
}