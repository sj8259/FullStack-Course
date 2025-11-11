class CodeBreakerGame {
    constructor() {
        this.array = new Array(10).fill(null);
        this.secretPattern = [];
        this.currentLevel = 1;
        this.timer = 60;
        this.timerInterval = null;
        this.operationCount = 0;
        this.bestTime = localStorage.getItem('codeBreakerBestTime') || '--';
        this.gameActive = true;
        this.startTime = Date.now();
        
        this.initializeGame();
        this.bindEvents();
        this.startTimer();
    }

    initializeGame() {
        this.generateSecretPattern();
        this.renderArray();
        this.updateDisplay();
        this.updateSecretPatternDisplay();
    }

    generateSecretPattern() {
        const patterns = [
            // Level 1: 2-digit patterns
            [2, 1], [4, 7], [9, 3], [6, 8], [1, 5],
            // Level 2: 3-digit patterns  
            [2, 1, 4], [7, 3, 9], [5, 8, 2], [1, 6, 4], [9, 2, 7],
            // Level 3: 4-digit patterns
            [3, 7, 1, 9], [8, 2, 5, 4], [1, 6, 9, 3], [7, 4, 2, 8], [5, 1, 6, 9]
        ];
        
        if (this.currentLevel <= 3) {
            this.secretPattern = patterns[this.currentLevel - 1];
        } else {
            // Generate random patterns for higher levels
            const length = Math.min(this.currentLevel, 6);
            this.secretPattern = Array.from({length}, () => Math.floor(Math.random() * 10));
        }
    }

    renderArray() {
        const arrayContainer = document.getElementById('array');
        arrayContainer.innerHTML = '';
        
        this.array.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.dataset.index = index;
            
            if (value === null) {
                cell.classList.add('empty');
                cell.textContent = '';
            } else {
                cell.textContent = value;
            }
            
            arrayContainer.appendChild(cell);
        });
    }

    updateDisplay() {
        document.getElementById('level').textContent = this.currentLevel;
        document.getElementById('timer').textContent = this.timer;
        document.getElementById('operationCount').textContent = this.operationCount;
        document.getElementById('bestTime').textContent = this.bestTime;
    }

    updateSecretPatternDisplay() {
        const patternText = this.secretPattern.map(() => '?').join(', ');
        document.getElementById('secretPattern').textContent = `[${patternText}]`;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.timer > 0 && this.gameActive) {
                this.timer--;
                this.updateDisplay();
            } else if (this.timer <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    insertAt(index, value) {
        if (index < 0 || index >= this.array.length) {
            this.showMessage('Index out of bounds!', 'error');
            return false;
        }

        if (value < 0 || value > 9) {
            this.showMessage('Value must be between 0 and 9!', 'error');
            return false;
        }

        // Shift elements to the right
        for (let i = this.array.length - 1; i > index; i--) {
            this.array[i] = this.array[i - 1];
        }
        
        this.array[index] = value;
        this.operationCount++;
        
        this.renderArray();
        this.updateDisplay();
        this.showMessage(`Inserted ${value} at index ${index}!`, 'success');
        
        // Add insert animation
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('insert-animation');
        setTimeout(() => cell.classList.remove('insert-animation'), 500);
        
        // Play insert sound effect
        this.playSound('insert');
        
        // Check for pattern match
        this.checkPatternMatch();
        
        return true;
    }

    deleteAt(index) {
        if (index < 0 || index >= this.array.length) {
            this.showMessage('Index out of bounds!', 'error');
            return false;
        }

        if (this.array[index] === null) {
            this.showMessage('No element to delete at this index!', 'error');
            return false;
        }

        const deletedValue = this.array[index];
        
        // Shift elements to the left
        for (let i = index; i < this.array.length - 1; i++) {
            this.array[i] = this.array[i + 1];
        }
        this.array[this.array.length - 1] = null;
        
        this.operationCount++;
        
        this.renderArray();
        this.updateDisplay();
        this.showMessage(`Deleted element ${deletedValue} at index ${index}.`, 'success');
        
        // Add delete animation
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('delete-animation');
        setTimeout(() => cell.classList.remove('delete-animation'), 500);
        
        // Play delete sound effect
        this.playSound('delete');
        
        return true;
    }

    searchPattern(patternText) {
        if (!patternText.trim()) {
            this.showMessage('Please enter a pattern to search for!', 'error');
            return;
        }

        const pattern = patternText.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        
        if (pattern.length === 0) {
            this.showMessage('Enter a valid pattern (e.g., 1,2,3)', 'error');
            return;
        }

        this.operationCount++;
        this.updateDisplay();
        
        // Clear previous highlights
        document.querySelectorAll('.array-cell').forEach(cell => {
            cell.classList.remove('highlight', 'pattern-match');
        });

        // Search for pattern with visual feedback
        this.searchPatternWithAnimation(pattern);
    }

    async searchPatternWithAnimation(pattern) {
        const arrayLength = this.array.length;
        const patternLength = pattern.length;
        
        for (let i = 0; i <= arrayLength - patternLength; i++) {
            // Highlight current search position
            for (let j = 0; j < patternLength; j++) {
                const cell = document.querySelector(`[data-index="${i + j}"]`);
                if (cell) {
                    cell.classList.add('highlight');
                }
            }
            
            await this.delay(300);
            
            // Check if pattern matches at this position
            let match = true;
            for (let j = 0; j < patternLength; j++) {
                if (this.array[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                // Highlight matching pattern
                for (let j = 0; j < patternLength; j++) {
                    const cell = document.querySelector(`[data-index="${i + j}"]`);
                    if (cell) {
                        cell.classList.remove('highlight');
                        cell.classList.add('pattern-match');
                    }
                }
                
                this.showMessage(`Pattern found at index ${i}!`, 'success');
                this.playSound('success');
                return;
            }
            
            // Remove highlight if no match
            for (let j = 0; j < patternLength; j++) {
                const cell = document.querySelector(`[data-index="${i + j}"]`);
                if (cell) {
                    cell.classList.remove('highlight');
                }
            }
        }
        
        this.showMessage('Pattern not found in the array.', 'info');
        this.playSound('error');
    }

    checkPatternMatch() {
        const arrayLength = this.array.length;
        const patternLength = this.secretPattern.length;
        
        for (let i = 0; i <= arrayLength - patternLength; i++) {
            let match = true;
            for (let j = 0; j < patternLength; j++) {
                if (this.array[i + j] !== this.secretPattern[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                this.levelComplete();
                return;
            }
        }
    }

    levelComplete() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const timeRemaining = 60 - this.timer;
        
        // Update best time if better
        if (this.bestTime === '--' || timeRemaining < parseInt(this.bestTime)) {
            this.bestTime = timeRemaining.toString();
            localStorage.setItem('codeBreakerBestTime', this.bestTime);
        }
        
        // Show victory modal
        document.getElementById('victoryTime').textContent = `${timeRemaining}s`;
        document.getElementById('victoryOperations').textContent = this.operationCount;
        document.getElementById('victoryMessage').textContent = `You cracked the code in ${timeRemaining} seconds!`;
        
        document.getElementById('victoryModal').style.display = 'block';
        this.playSound('victory');
    }

    nextLevel() {
        this.currentLevel++;
        this.timer = 60;
        this.operationCount = 0;
        this.gameActive = true;
        this.startTime = Date.now();
        
        // Clear array
        this.array = new Array(10).fill(null);
        
        // Generate new pattern
        this.generateSecretPattern();
        
        // Update display
        this.renderArray();
        this.updateDisplay();
        this.updateSecretPatternDisplay();
        
        // Hide next level button
        document.getElementById('nextLevelBtn').style.display = 'none';
        
        // Start timer
        this.startTimer();
        
        this.showMessage(`Level ${this.currentLevel} - Good luck!`, 'success');
    }

    gameOver() {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        document.getElementById('gameOverModal').style.display = 'block';
        this.playSound('error');
    }

    resetArray() {
        this.array = new Array(10).fill(null);
        this.operationCount = 0;
        this.renderArray();
        this.updateDisplay();
        this.showMessage('Array reset!', 'info');
    }

    showMessage(message, type = 'info') {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        
        // Add appropriate styling based on message type
        statusElement.className = `status-message ${type}`;
        
        // Auto-clear after 3 seconds
        setTimeout(() => {
            statusElement.textContent = 'Welcome, hacker! Crack the code before time runs out!';
            statusElement.className = 'status-message';
        }, 3000);
    }

    playSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        let frequency, duration;
        
        switch (type) {
            case 'insert':
                frequency = 800;
                duration = 0.1;
                break;
            case 'delete':
                frequency = 400;
                duration = 0.1;
                break;
            case 'success':
                frequency = 1000;
                duration = 0.3;
                break;
            case 'error':
                frequency = 200;
                duration = 0.2;
                break;
            case 'victory':
                // Play victory melody
                this.playVictoryMelody(audioContext);
                return;
            default:
                frequency = 600;
                duration = 0.1;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    playVictoryMelody(audioContext) {
        const notes = [523, 659, 784, 1047]; // C, E, G, C
        const noteDuration = 0.2;
        
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + noteDuration);
            
            oscillator.start(audioContext.currentTime + index * noteDuration);
            oscillator.stop(audioContext.currentTime + (index + 1) * noteDuration);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    bindEvents() {
        // Insert button
        document.getElementById('insertBtn').addEventListener('click', () => {
            const index = parseInt(document.getElementById('insertIndex').value);
            const value = parseInt(document.getElementById('insertValue').value);
            
            if (isNaN(index) || isNaN(value)) {
                this.showMessage('Please enter valid index and value!', 'error');
                return;
            }
            
            this.insertAt(index, value);
            
            // Clear inputs
            document.getElementById('insertIndex').value = '';
            document.getElementById('insertValue').value = '';
        });

        // Delete button
        document.getElementById('deleteBtn').addEventListener('click', () => {
            const index = parseInt(document.getElementById('deleteIndex').value);
            
            if (isNaN(index)) {
                this.showMessage('Please enter a valid index!', 'error');
                return;
            }
            
            this.deleteAt(index);
            
            // Clear input
            document.getElementById('deleteIndex').value = '';
        });

        // Search button
        document.getElementById('searchBtn').addEventListener('click', () => {
            const pattern = document.getElementById('searchPattern').value;
            this.searchPattern(pattern);
            
            // Clear input
            document.getElementById('searchPattern').value = '';
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetArray();
        });

        // Next level button
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            document.getElementById('victoryModal').style.display = 'none';
            this.nextLevel();
        });

        // Continue button
        document.getElementById('continueBtn').addEventListener('click', () => {
            document.getElementById('victoryModal').style.display = 'none';
            this.nextLevel();
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            document.getElementById('gameOverModal').style.display = 'none';
            location.reload();
        });

        // Enter key support for inputs
        document.getElementById('insertValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('insertBtn').click();
            }
        });

        document.getElementById('deleteIndex').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('deleteBtn').click();
            }
        });

        document.getElementById('searchPattern').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('searchBtn').click();
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CodeBreakerGame();
});
