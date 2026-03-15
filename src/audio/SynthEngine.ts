import * as Tone from 'tone';

type OscType = 'sine' | 'square' | 'sawtooth';

export class SynthEngine {
	private synth: Tone.PolySynth;
	private volume: Tone.Volume;
	private filter: Tone.Filter;

	constructor() {
		this.volume = new Tone.Volume(-30);

		this.synth = new Tone.PolySynth(Tone.Synth, {
			oscillator: {
				type: 'sine',
			},
			envelope: {
				attack: 0.1,
				decay: 0.2,
				sustain: 0.7,
				release: 0.5,
			},
		});

		this.filter = new Tone.Filter({
			type: 'lowpass',
			frequency: 20000,
			Q: 1,
		});

		this.synth.connect(this.filter);
		this.filter.connect(this.volume);
		this.volume.toDestination();
	}

	async start() {
		await Tone.start();
	}

	play(note: string) {
		this.synth.triggerAttack(note);
	}

	release(note: string) {
		this.synth.triggerRelease(note);
	}

	setVolume(value: number) {
		this.volume.volume.value = value;
	}

	setOscillator(type: OscType) {
		this.synth.set({
			oscillator: { type },
		});
	}

	setAttack(value: number) {
		this.synth.set({
			envelope: { attack: value },
		});
	}

	setDecay(value: number) {
		this.synth.set({
			envelope: { decay: value },
		});
	}

	setSustain(value: number) {
		this.synth.set({
			envelope: { sustain: value },
		});
	}

	setRelease(value: number) {
		this.synth.set({
			envelope: { release: value },
		});
	}

	setFilterFrequency(value: number) {
		this.filter.frequency.value = value;
	}

	setFilterQ(value: number) {
		this.filter.Q.value = value;
	}
}
