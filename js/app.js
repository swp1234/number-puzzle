class Game2048 {
    constructor() {
        this.gridSize = 4;
        this.tiles = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameOver = false;
        this.won = false;
        this.history = [];
        this.interstitialCount = 0;
        this.dopabrainApps = [
            { name: 'Quiz', emoji: '🎯', url: '/projects/quiz-app' },
            { name: 'Shopping Calc', emoji: '💰', url: '/projects/global-shopping-calc' },
            { name: 'Digital Detox', emoji: '📵', url: '/projects/digital-detox' },
            { name: 'Dream Fortune', emoji: '✨', url: '/projects/dream-fortune' },
            { name: 'Affirmation', emoji: '💝', url: '/projects/daily-affirmation' },
            { name: 'Lottery', emoji: '🎰', url: '/projects/lottery-generator' },
            { name: 'D-Day Counter', emoji: '📅', url: '/projects/d-day-counter' },
            { name: 'MBTI Tips', emoji: '🔮', url: '/projects/mbti-tips' }
        ];

        this.init();
        this.setupEventListeners();
        this.populateDopaBrainApps();
        this.initializeAnalytics();
    }

    init() {
        this.tiles = Array(this.gridSize * this.gridSize).fill(0);
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.history = [];
        this.addNewTile();
        this.addNewTile();
        this.render();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, false);

        document.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
            }
        }, false);

        // Buttons (safe DOM access)
        const newGameBtn = document.getElementById('new-game-btn');
        const undoBtn = document.getElementById('undo-btn');
        const langToggle = document.getElementById('lang-toggle');
        const langMenu = document.getElementById('lang-menu');
        const overlayBtn = document.getElementById('overlay-btn');
        const overlayBtnSecondary = document.getElementById('overlay-btn-secondary');
        const interstitialClose = document.getElementById('interstitial-close');
        const interstitialAd = document.getElementById('interstitial-ad');

        if (newGameBtn) newGameBtn.addEventListener('click', () => this.newGame());
        if (undoBtn) undoBtn.addEventListener('click', () => this.undo());

        // Language selector
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                if (langMenu) langMenu.classList.toggle('hidden');
            });
        }

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const lang = e.target.getAttribute('data-lang');
                await i18n.setLanguage(lang);
                this.updateLanguageUI();
                if (langMenu) langMenu.classList.add('hidden');
                this.render(); // Re-render with new language
            });
        });

        // Overlay buttons
        if (overlayBtn) {
            overlayBtn.addEventListener('click', () => {
                this.hideOverlay();
                this.newGame();
            });
        }

        if (overlayBtnSecondary) {
            overlayBtnSecondary.addEventListener('click', () => {
                this.hideOverlay();
            });
        }

        // Interstitial close
        if (interstitialClose) {
            interstitialClose.addEventListener('click', () => {
                if (interstitialAd) interstitialAd.classList.add('hidden');
            });
        }
    }

    updateLanguageUI() {
        // Update language button active state
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === i18n.currentLang) {
                btn.classList.add('active');
            }
        });
    }

    handleKeyboard(e) {
        if (this.gameOver) return;

        const key = e.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;

        e.preventDefault();

        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        this.move(directions[key]);
    }

    handleSwipe(startX, startY, endX, endY) {
        if (this.gameOver) return;

        const diffX = endX - startX;
        const diffY = endY - startY;
        const threshold = 30;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > threshold) {
                this.move(diffX > 0 ? 'right' : 'left');
            }
        } else {
            if (Math.abs(diffY) > threshold) {
                this.move(diffY > 0 ? 'down' : 'up');
            }
        }
    }

    saveHistory() {
        this.history.push({
            tiles: [...this.tiles],
            score: this.score
        });

        // Keep only last 10 moves
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    undo() {
        if (this.history.length === 0) return;

        const state = this.history.pop();
        this.tiles = state.tiles;
        this.score = state.score;
        this.gameOver = false;
        this.render();
    }

    move(direction) {
        this.saveHistory();

        const oldTiles = [...this.tiles];

        switch (direction) {
            case 'left':
                this.moveLeft();
                break;
            case 'right':
                this.moveRight();
                break;
            case 'up':
                this.moveUp();
                break;
            case 'down':
                this.moveDown();
                break;
        }

        // Check if move changed the board
        if (JSON.stringify(oldTiles) === JSON.stringify(this.tiles)) {
            this.history.pop(); // Remove the saved state if no change
            return;
        }

        this.addNewTile();
        this.checkGameStatus();
        this.render();

        // Check for interstitial ad
        this.interstitialCount++;
        if (this.interstitialCount >= 3) {
            this.showInterstitialAd();
            this.interstitialCount = 0;
        }
    }

    moveLeft() {
        for (let row = 0; row < this.gridSize; row++) {
            const line = this.getLine(row, 'horizontal');
            const merged = this.mergeLine(line);
            this.setLine(row, merged, 'horizontal');
        }
    }

    moveRight() {
        for (let row = 0; row < this.gridSize; row++) {
            const line = this.getLine(row, 'horizontal').reverse();
            const merged = this.mergeLine(line).reverse();
            this.setLine(row, merged, 'horizontal');
        }
    }

    moveUp() {
        for (let col = 0; col < this.gridSize; col++) {
            const line = this.getLine(col, 'vertical');
            const merged = this.mergeLine(line);
            this.setLine(col, merged, 'vertical');
        }
    }

    moveDown() {
        for (let col = 0; col < this.gridSize; col++) {
            const line = this.getLine(col, 'vertical').reverse();
            const merged = this.mergeLine(line).reverse();
            this.setLine(col, merged, 'vertical');
        }
    }

    getLine(index, direction) {
        const line = [];
        if (direction === 'horizontal') {
            for (let col = 0; col < this.gridSize; col++) {
                line.push(this.tiles[index * this.gridSize + col]);
            }
        } else {
            for (let row = 0; row < this.gridSize; row++) {
                line.push(this.tiles[row * this.gridSize + index]);
            }
        }
        return line;
    }

    setLine(index, line, direction) {
        if (direction === 'horizontal') {
            for (let col = 0; col < this.gridSize; col++) {
                this.tiles[index * this.gridSize + col] = line[col];
            }
        } else {
            for (let row = 0; row < this.gridSize; row++) {
                this.tiles[row * this.gridSize + index] = line[row];
            }
        }
    }

    mergeLine(line) {
        // Compress (remove zeros)
        let merged = line.filter(val => val !== 0);

        // Merge
        for (let i = 0; i < merged.length - 1; i++) {
            if (merged[i] === merged[i + 1]) {
                merged[i] *= 2;
                this.score += merged[i];
                merged.splice(i + 1, 1);
            }
        }

        // Pad with zeros
        while (merged.length < this.gridSize) {
            merged.push(0);
        }

        return merged;
    }

    addNewTile() {
        const emptyIndices = this.tiles
            .map((val, idx) => val === 0 ? idx : null)
            .filter(val => val !== null);

        if (emptyIndices.length === 0) return;

        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        // Improved difficulty: spawn 2 more often early game
        // First 3 moves: 95% chance of 2 (only 5% chance of 4)
        // Moves 4-10: 90% chance of 2
        // Moves 11+: 85% chance of 2 (normal difficulty)
        const moveCount = this.history.length;
        let prob2;
        if (moveCount <= 3) prob2 = 0.95;
        else if (moveCount <= 10) prob2 = 0.90;
        else prob2 = 0.85;

        this.tiles[randomIndex] = Math.random() < prob2 ? 2 : 4;
    }

    checkGameStatus() {
        // Check for 2048
        if (this.tiles.includes(2048) && !this.won) {
            this.won = true;
            this.showWinOverlay();
        }

        // Check for game over
        if (!this.canMove()) {
            this.gameOver = true;
            this.updateBestScore();
            this.showGameOverOverlay();
        }
    }

    canMove() {
        // Check for empty tiles
        if (this.tiles.includes(0)) return true;

        // Check for possible merges
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const current = this.tiles[row * this.gridSize + col];
                const right = col < this.gridSize - 1 ? this.tiles[row * this.gridSize + col + 1] : null;
                const down = row < this.gridSize - 1 ? this.tiles[(row + 1) * this.gridSize + col] : null;

                if (right === current || down === current) {
                    return true;
                }
            }
        }

        return false;
    }

    render() {
        this.renderGrid();
        this.renderStats();
    }

    renderGrid() {
        const gameGrid = document.getElementById('game-grid');
        gameGrid.innerHTML = '';

        const cellSize = 100 / this.gridSize;

        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const tile = this.tiles[i];

            if (tile === 0) continue;

            const tileElement = document.createElement('div');
            tileElement.className = `tile tile-${tile}`;
            tileElement.textContent = tile;

            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            const left = (col * cellSize) + '%';
            const top = (row * cellSize) + '%';
            const size = (cellSize - 2) + '%';

            tileElement.style.left = left;
            tileElement.style.top = top;
            tileElement.style.width = size;
            tileElement.style.height = size;

            tileElement.classList.add('new');

            gameGrid.appendChild(tileElement);
        }
    }

    renderStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('best-score').textContent = this.bestScore;
    }

    showWinOverlay() {
        const overlay = document.getElementById('game-overlay');
        const title = document.getElementById('overlay-title');
        const message = document.getElementById('overlay-message');
        const btn = document.getElementById('overlay-btn');
        const btnSecondary = document.getElementById('overlay-btn-secondary');

        title.textContent = i18n.t('game.won');
        message.textContent = i18n.t('game.wonMessage');
        btn.textContent = i18n.t('game.continue');
        btnSecondary.textContent = i18n.t('game.newGame');

        btn.onclick = () => {
            this.hideOverlay();
        };

        btnSecondary.onclick = () => {
            this.hideOverlay();
            this.newGame();
        };

        btnSecondary.classList.remove('hidden');
        overlay.classList.add('show');

        this.playConfetti();
    }

    showGameOverOverlay() {
        const overlay = document.getElementById('game-overlay');
        const title = document.getElementById('overlay-title');
        const message = document.getElementById('overlay-message');
        const btn = document.getElementById('overlay-btn');
        const btnSecondary = document.getElementById('overlay-btn-secondary');

        title.textContent = i18n.t('game.gameOver');
        message.innerHTML = `${i18n.t('game.finalScore')}: <strong>${this.score}</strong><br>${i18n.t('game.bestScore')}: <strong>${this.bestScore}</strong>`;
        btn.textContent = i18n.t('game.newGame');
        btnSecondary.classList.add('hidden');

        btn.onclick = () => {
            this.hideOverlay();
            this.newGame();
        };

        overlay.classList.add('show');
    }

    hideOverlay() {
        document.getElementById('game-overlay').classList.remove('show');
    }

    showInterstitialAd() {
        const ad = document.getElementById('interstitial-ad');
        ad.classList.remove('hidden');
        setTimeout(() => {
            ad.classList.add('hidden');
        }, 5000);
    }

    playConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confetti = [];
        for (let i = 0; i < 50; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 5 + 5,
                color: ['#EDB879', '#f2b179', '#f59563', '#edc22e'][Math.floor(Math.random() * 4)]
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let hasConfetti = false;
            confetti.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;

                if (p.y < canvas.height) {
                    hasConfetti = true;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, 5, 5);
                }
            });

            if (hasConfetti) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    newGame() {
        this.init();
    }

    loadBestScore() {
        try {
            if (typeof localStorage === 'undefined') return 0;
            const saved = localStorage.getItem('bestScore-2048');
            const parsed = saved ? parseInt(saved, 10) : 0;
            return isNaN(parsed) ? 0 : parsed;
        } catch (e) {
            console.warn('Could not load best score:', e.message);
            return 0;
        }
    }

    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('bestScore-2048', this.bestScore.toString());
                }
            } catch (e) {
                console.warn('Could not save best score:', e.message);
            }
        }
    }

    populateDopaBrainApps() {
        const grid = document.getElementById('dopabrain-grid');
        grid.innerHTML = '';

        this.dopabrainApps.forEach(app => {
            const card = document.createElement('a');
            card.href = app.url;
            card.className = 'dopabrain-card';
            card.innerHTML = `
                <div class="dopabrain-icon">${app.emoji}</div>
                <div class="dopabrain-name">${app.name}</div>
            `;
            grid.appendChild(card);
        });
    }

    initializeAnalytics() {
        // GA4 Event Tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'game_start', {
                'game_name': '2048 Number Puzzle',
                'timestamp': new Date().toISOString()
            });
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const game = new Game2048();
        window.game = game; // For debugging
    }, 100);
});
