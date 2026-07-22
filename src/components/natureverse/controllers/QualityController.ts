import type { QualitySettings, QualityTier } from '../types';
import { makeSettings } from '../config/natureVerseConfig';

export class QualityController {
  private samples: number[] = [];
  private stableSeconds = 0;
  private lastCheck = 0;

  constructor(private settings: QualitySettings, private readonly onTierChange: (settings: QualitySettings) => void) {}

  get current() {
    return this.settings;
  }

  record(delta: number, elapsed: number) {
    if (this.settings.reducedMotion || this.settings.tier === 'static') return;
    const fps = 1 / Math.max(delta, 0.001);
    this.samples.push(fps);
    if (this.samples.length > 90) this.samples.shift();
    if (elapsed - this.lastCheck < 2) return;
    this.lastCheck = elapsed;

    const average = this.samples.reduce((sum, value) => sum + value, 0) / Math.max(1, this.samples.length);
    if (average >= 45) {
      this.stableSeconds += 2;
      return;
    }

    this.stableSeconds = 0;
    if (average < 15) {
      this.setTier('static');
    } else if (average < 20 && this.settings.tier !== 'low') {
      this.setTier('low');
    } else if (average < 30 && this.settings.tier === 'high') {
      this.setTier('medium');
    }
  }

  private setTier(tier: QualityTier) {
    if (this.settings.tier === tier) return;
    this.settings = makeSettings(tier, this.settings.reducedMotion);
    this.onTierChange(this.settings);
  }
}
