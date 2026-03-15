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

// pianoroll
const keys = document.querySelectorAll<HTMLButtonElement>('.note');

keys.forEach((key) => {
	const note = key.dataset.note!;

	// start note
	key.addEventListener('mousedown', () => {
		synth.play(note);
		key.classList.add('active');
	});

	// release note
	key.addEventListener('mouseup', () => {
		synth.release();
		key.classList.remove('active');
	});
});

// oscillators section
const volumeSlider = document.getElementById('volume') as HTMLInputElement;

volumeSlider.addEventListener('input', () => {
	const value = Number(volumeSlider.value);

	synth.setVolume(value);
});

const oscillators = document.querySelectorAll("input[name='oscillator']");

oscillators.forEach((button) => {
	button.addEventListener('change', () => {
		const type = (button as HTMLInputElement).value;

		synth.setOscillator(type as any);
	});
});

document.addEventListener('keydown', (e) => {
	if (e.key === 'a') {
		synth.play('C4');
	}
});

document.addEventListener('keyup', () => {
	synth.release();
});
