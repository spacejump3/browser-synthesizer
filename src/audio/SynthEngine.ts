import * as Tone from 'tone';

export class SynthEngine {
	private synth: Tone.Synth;
	private volume: Tone.Volume;

	constructor() {
		this.volume = new Tone.Volume(-30);

		this.synth = new Tone.Synth({
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

	release() {
		this.synth.triggerRelease();
	}

	setVolume(value: number) {
		this.volume.volume.value = value;
	}

	setOscillator(type: Tone.ToneOscillatorType) {
		this.synth.oscillator.type = type;
	}
}
