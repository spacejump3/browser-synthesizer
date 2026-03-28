import * as Tone from 'tone';

type OscType = 'sine' | 'square' | 'sawtooth';

export class SynthEngine {
	private synth: Tone.PolySynth;
	private volume: Tone.Volume;
	private filter: Tone.Filter;
	private filterEnv: Tone.FrequencyEnvelope;
	private delay: Tone.FeedbackDelay;
	private reverb: Tone.Reverb;
	private delayHz = 1;
	private delayWet = 0.4;
	private reverbWet = 0.4;
	private delayEnabled = false;
	private reverbEnabled = false;

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
			baseFrequency: 20000,
			octaves: 0,
		});

		this.delay = new Tone.FeedbackDelay({
			delayTime: 1 / this.delayHz,
			feedback: 0.75,
			wet: 0,
		});

		this.reverb = new Tone.Reverb({
			decay: 1.5,
			wet: 0,
		});

		this.filterEnv.connect(this.filter.frequency);
		this.synth.connect(this.filter);
		this.filter.connect(this.delay);
		this.delay.connect(this.reverb);
		this.reverb.connect(this.volume);
		this.volume.toDestination();
	}

	async start() {
		await Tone.start();
		await this.reverb.generate();
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

	setDelayActive(enabled: boolean) {
		this.delayEnabled = enabled;
		this.delay.wet.value = enabled ? this.delayWet : 0;
	}

	setDelayHz(value: number) {
		const hz = Math.max(0.1, Math.min(20, value));
		this.delayHz = hz;
		this.delay.delayTime.value = 1 / hz;
	}

	setReverbActive(enabled: boolean) {
		this.reverbEnabled = enabled;
		this.reverb.wet.value = enabled ? this.reverbWet : 0;
	}

	setReverbDecay(value: number) {
		const decay = Math.max(0.1, Math.min(10, value));
		this.reverb.decay = decay;
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
		const clamped = Math.max(20, Math.min(20000, value));
		this.filter.frequency.value = clamped;
		this.filterEnv.baseFrequency = clamped;
	}

	setFilterType(type: 'lowpass' | 'highpass' | 'bandpass') {
		this.filter.type = type;
	}

	setFilterQ(value: number) {
		this.filter.Q.value = value;
	}
}
