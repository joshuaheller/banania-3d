class Input {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchThreshold = 30; // Minimum distance to detect swipe
        
        // Bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        
        // Initialize input handlers
        this.init();
    }
    
    init() {
        // Keyboard events
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        // Touch events for mobile
        window.addEventListener('touchstart', this.onTouchStart, { passive: false });
        window.addEventListener('touchmove', this.onTouchMove, { passive: false });
        window.addEventListener('touchend', this.onTouchEnd);
    }
    
    destroy() {
        // Remove event listeners
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onTouchEnd);
    }
    
    onKeyDown(event) {
        this.keys[event.keyCode] = true;
        
        // Handle arrow keys for player movement
        if (this.game.state === STATE_PLAYING && this.game.player && !this.game.player.isMoving) {
            switch (event.keyCode) {
                case 37: // Left arrow
                    this.game.player.move(DIR_LEFT, this.game.level, this.game);
                    break;
                case 38: // Up arrow
                    this.game.player.move(DIR_UP, this.game.level, this.game);
                    break;
                case 39: // Right arrow
                    this.game.player.move(DIR_RIGHT, this.game.level, this.game);
                    break;
                case 40: // Down arrow
                    this.game.player.move(DIR_DOWN, this.game.level, this.game);
                    break;
                case 82: // R key (restart level)
                    if (this.game.player.isDead) {
                        this.game.restartLevel();
                    }
                    break;
                // Camera view controls
                case 49: // 1 key - Behind view
                    this.game.changeCameraView(CAMERA_VIEW_BEHIND);
                    break;
                case 50: // 2 key - Top-down view
                    this.game.changeCameraView(CAMERA_VIEW_TOP);
                    break;
                case 51: // 3 key - Isometric view
                    this.game.changeCameraView(CAMERA_VIEW_ISOMETRIC);
                    break;
            }
        } else if (this.game.state === STATE_TITLE || this.game.state === STATE_GAME_OVER || this.game.state === STATE_GAME_COMPLETE) {
            // Start game on any key press
            if (event.keyCode === 32 || event.keyCode === 13) { // Space or Enter
                this.game.startGame();
            }
        }
        
        // Prevent default behavior for arrow keys to avoid page scrolling
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();
        }
    }
    
    onKeyUp(event) {
        this.keys[event.keyCode] = false;
    }
    
    onTouchStart(event) {
        if (event.touches.length > 0) {
            this.touchStartX = event.touches[0].clientX;
            this.touchStartY = event.touches[0].clientY;
        }
        
        // Prevent default to avoid scrolling on mobile
        event.preventDefault();
    }
    
    onTouchMove(event) {
        // Prevent default to avoid scrolling on mobile
        event.preventDefault();
    }
    
    onTouchEnd(event) {
        if (this.game.state === STATE_PLAYING && this.game.player && !this.game.player.isMoving) {
            // Calculate swipe direction
            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            
            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;
            
            // Determine if it's a horizontal or vertical swipe
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > this.touchThreshold) {
                    if (deltaX > 0) {
                        // Swipe right
                        this.game.player.move(DIR_RIGHT, this.game.level, this.game);
                    } else {
                        // Swipe left
                        this.game.player.move(DIR_LEFT, this.game.level, this.game);
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > this.touchThreshold) {
                    if (deltaY > 0) {
                        // Swipe down
                        this.game.player.move(DIR_DOWN, this.game.level, this.game);
                    } else {
                        // Swipe up
                        this.game.player.move(DIR_UP, this.game.level, this.game);
                    }
                }
            }
        } else if (this.game.state === STATE_TITLE || this.game.state === STATE_GAME_OVER || this.game.state === STATE_GAME_COMPLETE) {
            // Start game on tap
            this.game.startGame();
        }
    }
    
    isKeyPressed(keyCode) {
        return this.keys[keyCode] === true;
    }
} 