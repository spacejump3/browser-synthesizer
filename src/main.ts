import { SynthEngine } from './audio/SynthEngine';

const synth = new SynthEngine();
let isMouseDown = false;
let currentNote: string | null = null;

// browsers require interaction before sound starts
document.body.addEventListener(
	'click',
	async () => {
		await synth.start();
	},
	{ once: true },
);

/* ********* */
/* pianoroll */
/* ********* */

// global mouse press / release
document.addEventListener('mousedown', () => {
	isMouseDown = true;
});

document.addEventListener('mouseup', () => {
	isMouseDown = false;

	if (currentNote) {
		synth.release(currentNote);
		const el = document.querySelector(`[data-note="${currentNote}"]`);
		el?.classList.remove('active');
		currentNote = null;
	}
});

const keys = document.querySelectorAll<HTMLButtonElement>('.note');

// mouse & mobile controls
keys.forEach((key) => {
	const note = key.dataset.note!;

	// start note
	key.addEventListener('mousedown', () => {
		synth.play(note);
		key.classList.add('active');
		currentNote = note;
	});

	// release note
	key.addEventListener('mouseup', () => {
		synth.release(note);
		key.classList.remove('active');
	});
});

document.addEventListener('mousemove', (e) => {
	if (!isMouseDown) return;

	const element = document.elementFromPoint(e.clientX, e.clientY);

	if (!element || !element.classList.contains('note')) return;

	const note = element.getAttribute('data-note');
	if (!note || note === currentNote) return;

	// release previous note
	if (currentNote) {
		synth.release(currentNote);
		const prev = document.querySelector(`[data-note="${currentNote}"]`);
		prev?.classList.remove('active');
	}

	// play new note
	synth.play(note);
	element.classList.add('active');
	currentNote = note;
});

// keyboard controls
const keyMap: Record<string, string> = {
	a: 'C4',
	w: 'C#4',
	s: 'D4',
	e: 'D#4',
	d: 'E4',
	f: 'F4',
	t: 'F#4',
	g: 'G4',
	y: 'G#4',
	h: 'A4',
	u: 'A#4',
	j: 'B4',
};

function getKeyElement(note: string): HTMLButtonElement | null {
	return document.querySelector<HTMLButtonElement>(`[data-note="${note}"]`);
}

// play note on key down
document.addEventListener('keydown', (event) => {
	if (event.repeat) return;

	const key = event.key.toLowerCase();
	const note = keyMap[key];

	const keyElement = getKeyElement(note);
	keyElement?.classList.add('active');

	if (note) synth.play(note);
});

// key release
document.addEventListener('keyup', (event) => {
	const key = event.key.toLowerCase();
	const note = keyMap[key];

	const keyElement = getKeyElement(note);
	keyElement?.classList.remove('active');

	if (keyMap[key]) {
		synth.release(note);
	}
});

/* ******************* */
/* oscillators section */
/* ******************* */
const volumeSlider = document.getElementById('volume') as HTMLInputElement;

volumeSlider.addEventListener('input', () => {
	const value = Number(volumeSlider.value);

	synth.setVolume(value);
});

const oscillators = document.querySelectorAll<HTMLInputElement>("input[name='oscillator']");

oscillators.forEach((button) => {
	button.addEventListener('change', () => {
		const type = button.value as 'sine' | 'square' | 'sawtooth';
		synth.setOscillator(type);
	});
});

/* ************ */
/* adsr section */
/* ************ */
const attackSlider = document.getElementById('attack') as HTMLInputElement;
const decaySlider = document.getElementById('decay') as HTMLInputElement;
const sustainSlider = document.getElementById('sustain') as HTMLInputElement;
const releaseSlider = document.getElementById('release') as HTMLInputElement;

attackSlider.addEventListener('input', () => {
	synth.setAttack(Number(attackSlider.value));
});

decaySlider.addEventListener('input', () => {
	synth.setDecay(Number(decaySlider.value));
});

sustainSlider.addEventListener('input', () => {
	synth.setSustain(Number(sustainSlider.value));
});

releaseSlider.addEventListener('input', () => {
	synth.setRelease(Number(releaseSlider.value));
});

/* ************** */
/* filter section */
/* ************** */

const cutoffSlider = document.getElementById('cutoff') as HTMLInputElement;
const resonanceSlider = document.getElementById('resonance') as HTMLInputElement;

cutoffSlider.addEventListener('input', () => {
	const min = 20;
	const max = 20000;
	const value = Number(cutoffSlider.value);
	// convert linear 0–20000 to exponential scale
	const expValue = min * Math.pow(max / min, value / 20000);
	synth.setFilterFrequency(expValue);
});

resonanceSlider.addEventListener('input', () => {
	synth.setFilterQ(Number(resonanceSlider.value));
});

const filterTypeButtons = document.querySelectorAll<HTMLInputElement>("input[name='filter-type']");
const filterTypeMap: Record<string, 'lowpass' | 'highpass' | 'bandpass'> = {
	lpf: 'lowpass',
	hpf: 'highpass',
	bpf: 'bandpass',
};
filterTypeButtons.forEach((button) => {
	button.addEventListener('change', () => {
		if (button.checked) {
			const type = filterTypeMap[button.id] ?? (button.value as 'lowpass' | 'highpass' | 'bandpass');
			synth.setFilterType(type);
		}
	});
});

// filter envelope
const filterEnvAttackSlider = document.getElementById('filter-attack') as HTMLInputElement;
const filterEnvDecaySlider = document.getElementById('filter-decay') as HTMLInputElement;
const filterEnvSustainSlider = document.getElementById('filter-sustain') as HTMLInputElement;
const filterEnvReleaseSlider = document.getElementById('filter-release') as HTMLInputElement;
const filterEnvAmountSlider = document.getElementById('mod-amount') as HTMLInputElement;

filterEnvAttackSlider.addEventListener('input', () => {
	synth.setFilterEnvAttack(Number(filterEnvAttackSlider.value));
});

filterEnvDecaySlider.addEventListener('input', () => {
	synth.setFilterEnvDecay(Number(filterEnvDecaySlider.value));
});

filterEnvSustainSlider.addEventListener('input', () => {
	synth.setFilterEnvSustain(Number(filterEnvSustainSlider.value));
});

filterEnvReleaseSlider.addEventListener('input', () => {
	synth.setFilterEnvRelease(Number(filterEnvReleaseSlider.value));
});

filterEnvAmountSlider.addEventListener('input', () => {
	synth.setFilterEnvAmount(Number(filterEnvAmountSlider.value));
});
