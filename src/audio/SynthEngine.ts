import * as Tone from 'tone';

type OscType = 'sine' | 'square' | 'sawtooth';

export class SynthEngine {
	private synth: Tone.PolySynth;
	private volume: Tone.Volume;
	private filter: Tone.Filter;
	private filterEnv: Tone.FrequencyEnvelope;

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

		this.filterEnv = new Tone.FrequencyEnvelope({
			attack: 0.1,
			decay: 0.2,
			sustain: 0.7,
			release: 0.5,
			baseFrequency: 200,
			octaves: 4,
		});

		this.filterEnv.connect(this.filter.frequency);
		this.synth.connect(this.filter);
		this.filter.connect(this.volume);
		this.volume.toDestination();
	}

	async start() {
		await Tone.start();
	}

	play(note: string) {
		this.synth.triggerAttack(note);
		this.filterEnv.triggerAttack();
	}

	release(note: string) {
		this.synth.triggerRelease(note);
		this.filterEnv.triggerRelease();
	}

	setVolume(value: number) {
		this.volume.volume.value = value;
	}

	setOscillator(type: OscType) {
		this.synth.set({
			oscillator: { type },
		});
	}

	// ADSR
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

	// filter envelope ADSR
	setFilterEnvAttack(value: number) {
		this.filterEnv.attack = value;
	}

	setFilterEnvDecay(value: number) {
		this.filterEnv.decay = value;
	}

	setFilterEnvSustain(value: number) {
		this.filterEnv.sustain = value;
	}

	setFilterEnvRelease(value: number) {
		this.filterEnv.release = value;
	}

	setFilterEnvAmount(octaves: number) {
		this.filterEnv.octaves = octaves;
	}

	setFilterFrequency(value: number) {
		this.filter.frequency.value = value;
	}

	setFilterQ(value: number) {
		this.filter.Q.value = value;
	}
}
