import { mkdirSync, writeFileSync } from 'node:fs';
import { DURATION } from '../src/timeline.ts';

const sampleRate = 24_000;
const samples = new Float32Array(sampleRate * DURATION);
const tau = Math.PI * 2;

function addSound(start, duration, amplitude, wave) {
  const first = Math.round(start * sampleRate);
  const length = Math.min(Math.round(duration * sampleRate), samples.length - first);
  for (let i = 0; i < length; i++) {
    const time = i / sampleRate;
    const edge = Math.min(1, time / 0.006, (length - i) / (sampleRate * 0.015));
    samples[first + i] += amplitude * edge * wave(time, i);
  }
}

function pluck(start, midiNote, duration, amplitude) {
  const hz = 440 * 2 ** ((midiNote - 69) / 12);
  addSound(start, duration, amplitude, (time) => {
    const angle = tau * hz * time;
    const tone = Math.sin(angle) + 0.26 * Math.sin(2 * angle) + 0.08 * Math.sin(3 * angle);
    return tone * Math.exp(-4.8 * time / duration);
  });
}

function noise(sample) {
  const hashed = Math.imul(sample ^ (sample >>> 13), 0x45d9f3b);
  return ((hashed ^ (hashed >>> 16)) >>> 0) / 0x80000000 - 1;
}

function tap(start, pitch = 760, amplitude = 0.13) {
  addSound(start, 0.1, amplitude, (time, i) =>
    (0.54 * noise(i + Math.round(start * sampleRate)) + Math.sin(tau * pitch * time)) * Math.exp(-52 * time),
  );
}

function sweep(start, duration, rising) {
  const upper = rising ? 620 : 320;
  const lower = rising ? 320 : 620;
  addSound(start, duration, 0.13, (time, i) => {
    const phase = lower * time + (upper - lower) * time ** 2 / (2 * duration);
    return (0.65 * noise(i + 4000) + 0.3 * Math.sin(tau * phase)) * Math.sin(Math.PI * time / duration) ** 2;
  });
}

const beat = 60 / 120;
const chords = [[48, 55, 64, 67], [45, 52, 60, 64], [41, 48, 57, 60], [43, 50, 62, 67]];
const melody = [76, 79, 81, 79, 76, 72, 74, 67, 77, 81, 84, 81, 79, 74, 71, 74];
for (let step = 0; step < 59; step++) {
  const start = 0.35 + step * beat;
  const chord = chords[Math.floor(step / 4) % chords.length];
  const dance = start >= 20.4 && start < 23.6;
  if (step % 2 === 0) pluck(start, chord[0], 0.5, dance ? 0.18 : 0.12);
  pluck(start + 0.035, chord[1 + step % 3], 0.45, 0.055);
  if (step % 4 !== 3) pluck(start + 0.22, melody[step % melody.length], 0.33, 0.068);
  if (start > 2 && start < 24) tap(start + 0.25, 2650, 0.032);
  if (dance) {
    addSound(start, 0.19, 0.23, (time) =>
      Math.sin(tau * (53 * time + 2 * (1 - Math.exp(-38 * time)))) * Math.exp(-20 * time),
    );
    tap(start + 0.25, 1250, 0.13);
  }
}

addSound(0.36, 1.05, 0.045, (time, i) => noise(i + 910) * (0.55 + 0.45 * Math.sin(tau * 16 * time)));
for (const time of [2.69, 3.25, 3.81, 4.38]) {
  sweep(time - 0.19, 0.23, true);
  tap(time, 530);
}
tap(7.16, 1930, 0.2);
tap(7.34, 1470, 0.18);
sweep(7.32, 0.4, false);
sweep(9.0, 0.45, true);
sweep(10.05, 0.65, false);
for (const time of [11.16, 11.25, 11.33]) tap(time, 1850, 0.09);
for (const time of [12.26, 12.49, 12.71, 12.94, 13.16, 13.38]) tap(time, 950, 0.075);
tap(14.06, 450);
tap(14.72, 620);
for (const time of [15.7, 16.8, 18.25]) sweep(time, 0.48, true);
tap(23.9, 560, 0.18);
for (const [index, note] of [72, 76, 79, 84].entries()) pluck(25.37 + 0.095 * index, note, 0.68, 0.13);
for (const [index, note] of [79, 84, 88].entries()) pluck(28.84 + 0.13 * index, note, 0.72, 0.12);

const headerSize = 44;
const output = Buffer.alloc(headerSize + samples.length * 2);
output.write('RIFF', 0);
output.writeUInt32LE(output.length - 8, 4);
output.write('WAVEfmt ', 8);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(1, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * 2, 28);
output.writeUInt16LE(2, 32);
output.writeUInt16LE(16, 34);
output.write('data', 36);
output.writeUInt32LE(samples.length * 2, 40);
for (let i = 0; i < samples.length; i++) {
  const fade = Math.min(1, (samples.length - i) / (sampleRate * 0.45));
  const value = Math.tanh(1.28 * samples[i]) * fade;
  output.writeInt16LE(Math.round(value * 32767), headerSize + i * 2);
}

const destination = process.argv[2] ?? 'public/soundtrack.wav';
if (process.argv.length < 3) mkdirSync('public', { recursive: true });
writeFileSync(destination, output);
