import * as Tone from 'tone';

type OscType = 'sine' | 'square' | 'sawtooth';

export class SynthEngine {
	private synth: Tone.PolySynth;
	private volume: Tone.Volume;

	constructor() {
		this.volume = new Tone.Volume(-30);

		this.synth = new Tone.PolySynth(Tone.Synth, {
			oscillator: {
				type: 'sine',
			},
		});

		this.synth.connect(this.volume);
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
}
