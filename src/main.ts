import { Oscillator } from 'tone';
import { SynthEngine } from './audio/SynthEngine';

const synth = new SynthEngine();

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
const keys = document.querySelectorAll<HTMLButtonElement>('.note');

// mouse controls
keys.forEach((key) => {
	const note = key.dataset.note!;

	// start note
	key.addEventListener('mousedown', () => {
		synth.play(note);
		key.classList.add('active');
	});

	// release note
	key.addEventListener('mouseup', () => {
		synth.release(note);
		key.classList.remove('active');
	});
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
