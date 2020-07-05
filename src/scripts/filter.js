import { gsap } from 'gsap';

class fx {
  constructor(el) {
    this.DOM = el;
  }
  createTimeline() {
    this.tl = gsap.timeline({
      onStart: () => {
        this.DOM.style.filter = `url(${this.filterId}`;
      },
      onComplete: () => {
        this.DOM.style = null;
      }
    });
  }
}

class cellFx extends fx {
  constructor(el) {
    super(el);
    this.filterId = '#filter';
    this.DOM.feTurbulence = document.querySelector(`${this.filterId} > feTurbulence`);
    this.defaultValue = {
    turbulence: 0
    };

    this.createTimeline();

    this.tl.eventCallback('onUpdate', () => {
      this.DOM.feTurbulence.setAttribute('baseFrequency', this.defaultValue.turbulence);
    });
    this.tl.to(this.defaultValue, {
      duration: 1,
      startAt: {turbulence: 0.04},
      turbulence: 0
    });
  }
}

export default [cellFx];
