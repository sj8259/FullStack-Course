(() => {
	"use strict";

	// Config
	const ARRAY_SIZE = 10;
	const EMPTY = null;
	const SCAN_DELAY_MS = 220;

	// State
	let arr = Array.from({ length: ARRAY_SIZE }, () => EMPTY);
	let secret = randomPattern(3);
	let timerId = null;
	let remaining = 0;

	// Elements
	const arrayEl = document.getElementById("array");
	const msgEl = document.getElementById("message");
	const indexInput = document.getElementById("indexInput");
	const valueInput = document.getElementById("valueInput");
	const insertBtn = document.getElementById("insertBtn");
	const deleteIndexInput = document.getElementById("deleteIndexInput");
	const deleteBtn = document.getElementById("deleteBtn");
	const patternInput = document.getElementById("patternInput");
	const searchBtn = document.getElementById("searchBtn");
	const resetBtn = document.getElementById("resetBtn");
	const shuffleBtn = document.getElementById("shuffleBtn");
	const hintBtn = document.getElementById("hintBtn");
	const secretPatternEl = document.getElementById("secretPattern");
	const timerSelect = document.getElementById("timerSelect");
	const timerEl = document.getElementById("timer");
	const startBtn = document.getElementById("startBtn");
	const stopBtn = document.getElementById("stopBtn");

	// Audio (simple beeps)
	const beepCtx = window.AudioContext ? new AudioContext() : null;
	function beep(freq = 660, ms = 100, type = "sine", vol = 0.06) {
		if (!beepCtx) return;
		const o = beepCtx.createOscillator();
		const g = beepCtx.createGain();
		o.type = type;
		o.frequency.value = freq;
		g.gain.value = vol;
		o.connect(g);
		g.connect(beepCtx.destination);
		o.start();
		setTimeout(() => o.stop(), ms);
	}

	// Init
	render();
	updateSecret();
	setMessage("Welcome, agent. Insert digits and find the secret pattern.");

	// Event bindings
	insertBtn.addEventListener("click", onInsert);
	deleteBtn.addEventListener("click", onDelete);
	searchBtn.addEventListener("click", onSearch);
	resetBtn.addEventListener("click", onReset);
	shuffleBtn.addEventListener("click", onRandomFill);
	hintBtn.addEventListener("click", () => setMessage(`Hint → Secret pattern looks like ${secret.join(",")}`));
	startBtn.addEventListener("click", startChallenge);
	stopBtn.addEventListener("click", stopChallenge);

	// Functions
	function render() {
		arrayEl.innerHTML = "";
		arr.forEach((value, i) => {
			const cell = document.createElement("div");
			cell.className = "cell" + (value === EMPTY ? " empty" : "");
			cell.dataset.index = i.toString();
			cell.textContent = value === EMPTY ? " " : value.toString();
			arrayEl.appendChild(cell);
		});
	}

	function setMessage(text, kind = "info") {
		msgEl.textContent = text;
		msgEl.className = "message";
		if (kind === "success") msgEl.classList.add("success");
	}

	function clampIndex(n) {
		return Number.isInteger(n) && n >= 0 && n < ARRAY_SIZE;
	}

	function parsePattern(text) {
		if (!text) return null;
		const parts = text.split(",").map(s => s.trim());
		if (!parts.length) return null;
		const nums = [];
		for (const p of parts) {
			if (!/^-?\d+$/.test(p)) return null;
			const v = parseInt(p, 10);
			if (v < 0 || v > 9) return null;
			nums.push(v);
		}
		return nums.length ? nums : null;
	}

	function onInsert() {
		const idx = Number(indexInput.value);
		const val = Number(valueInput.value);
		if (!clampIndex(idx)) {
			setMessage("Index out of bounds!", "error");
			beep(220, 150, "sawtooth", 0.06);
			return;
		}
		if (!Number.isInteger(val) || val < 0 || val > 9) {
			setMessage("Enter a valid value (0-9).", "error");
			beep(220, 150, "sawtooth", 0.06);
			return;
		}
		// Shift right from end to idx
		for (let i = ARRAY_SIZE - 1; i > idx; i--) {
			arr[i] = arr[i - 1];
			markShift(i, "right");
		}
		arr[idx] = val;
		render();
		markAnim(idx, "anim-insert");
		setMessage(`Inserted ${val} at index ${idx}!`);
		beep(880, 100, "triangle", 0.07);
		checkWin();
	}

	function onDelete() {
		const idx = Number(deleteIndexInput.value);
		if (!clampIndex(idx)) {
			setMessage("Index out of bounds!", "error");
			beep(220, 150, "sawtooth", 0.06);
			return;
		}
		// Shift left from idx to end
		for (let i = idx; i < ARRAY_SIZE - 1; i++) {
			arr[i] = arr[i + 1];
			markShift(i, "left");
		}
		arr[ARRAY_SIZE - 1] = EMPTY;
		render();
		markAnim(idx, "anim-delete");
		setMessage(`Deleted element at index ${idx}.`);
		beep(520, 80, "square", 0.05);
	}

	async function onSearch() {
		const text = patternInput.value;
		const pat = parsePattern(text);
		if (!pat) {
			setMessage("Enter a valid pattern (e.g., 1,2,3).", "error");
			beep(220, 200, "sawtooth", 0.06);
			return;
		}
		setMessage(`Searching for [${pat.join(", ")}]...`);
		const foundIdx = await scanForPattern(pat);
		if (foundIdx !== -1) {
			highlightRange(foundIdx, pat.length, true);
			setMessage(`Pattern found at index ${foundIdx}!`, "success");
			beep(1040, 120, "sine", 0.08);
			beep(1240, 160, "sine", 0.08);
			checkWin();
		} else {
			setMessage("No match found.");
			beep(280, 150, "sawtooth", 0.06);
		}
	}

	function markAnim(i, cls) {
		const cell = arrayEl.children[i];
		if (!cell) return;
		cell.classList.add(cls);
		setTimeout(() => cell.classList.remove(cls), 350);
	}
	function markShift(i, dir) {
		render();
		const cls = dir === "right" ? "anim-shift-right" : "anim-shift-left";
		const cell = arrayEl.children[i];
		if (cell) {
			cell.classList.add(cls);
			setTimeout(() => cell.classList.remove(cls), 280);
		}
	}
	function clearHighlights() {
		Array.from(arrayEl.children).forEach(c => c.classList.remove("scan", "match"));
	}
	function highlightRange(start, len, match = false) {
		for (let i = 0; i < len; i++) {
			const cell = arrayEl.children[start + i];
			if (cell) cell.classList.add(match ? "match" : "scan");
		}
	}

	async function scanForPattern(pat) {
		clearHighlights();
		for (let i = 0; i <= ARRAY_SIZE - pat.length; i++) {
			highlightRange(i, pat.length, false);
			await delay(SCAN_DELAY_MS);
			let ok = true;
			for (let j = 0; j < pat.length; j++) {
				if (arr[i + j] !== pat[j]) {
					ok = false;
					break;
				}
			}
			if (ok) return i;
			clearHighlights();
		}
		return -1;
	}

	function onReset() {
		arr = Array.from({ length: ARRAY_SIZE }, () => EMPTY);
		render();
		clearHighlights();
		setMessage("Array reset.");
	}
	function onRandomFill() {
		arr = Array.from({ length: ARRAY_SIZE }, () =>
			Math.random() < 0.55 ? Math.floor(Math.random() * 10) : EMPTY
		);
		render();
		setMessage("Array randomized.");
	}

	function randomPattern(len) {
		return Array.from({ length: len }, () => Math.floor(Math.random() * 10));
	}
	function updateSecret() {
		secretPatternEl.textContent = `[ ${secret.join(", ")} ]`;
	}
	function checkWin() {
		// Simple win: secret exists inside array contiguous
		const loc = findPatternIndex(arr, secret);
		if (loc !== -1) {
			highlightRange(loc, secret.length, true);
			setMessage(`Level Complete! Secret found at index ${loc}.`, "success");
			victory();
			if (timerId) stopChallenge(true);
		}
	}
	function findPatternIndex(a, pat) {
		for (let i = 0; i <= a.length - pat.length; i++) {
			let ok = true;
			for (let j = 0; j < pat.length; j++) {
				if (a[i + j] !== pat[j]) { ok = false; break; }
			}
			if (ok) return i;
		}
		return -1;
	}

	function startChallenge() {
		secret = randomPattern(3);
		updateSecret();
		setMessage("Challenge started. Insert digits to match the secret.");
		const sel = timerSelect.value;
		if (sel !== "off") {
			remaining = Number(sel);
			timerEl.classList.remove("hidden");
			tickTimer();
			timerId = setInterval(tickTimer, 1000);
		}
	}
	function stopChallenge(won = false) {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
		}
		timerEl.classList.add("hidden");
		if (!won) setMessage("Challenge stopped.");
	}
	function tickTimer() {
		if (remaining <= 0) {
			stopChallenge(false);
			setMessage("Time's up! Try again.");
			beep(200, 180, "square", 0.08);
			beep(160, 220, "square", 0.08);
			return;
		}
		remaining--;
		const m = String(Math.floor(remaining / 60)).padStart(2, "0");
		const s = String(remaining % 60).padStart(2, "0");
		timerEl.textContent = `${m}:${s}`;
	}

	function victory() {
		// small fanfare
		beep(740, 110, "sine", 0.08);
		setTimeout(() => beep(880, 120, "sine", 0.08), 120);
		setTimeout(() => beep(1040, 140, "sine", 0.08), 260);
		// flash success on cells
		Array.from(arrayEl.children).forEach(c => {
			c.classList.add("success");
			setTimeout(() => c.classList.remove("success"), 800);
		});
	}

	function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
})();


