class Resources {
    constructor() {
        this.sounds = {};
        this.textures = {};
        this.models = {};
        this.totalResources = 0;
        this.loadedResources = 0;
        this.onProgress = null;
        this.onComplete = null;
    }

    init(onProgress, onComplete) {
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        
        // Load sounds from the original game
        this.loadSounds();
        
        // Load textures
        this.loadTextures();
    }

    loadSounds() {
        const soundFiles = [
            'about', 'argl', 'attack1', 'attack2', 'chart', 
            'click', 'gameend', 'getpoint', 'newplane', 'opendoor', 
            'wow', 'yeah'
        ];
        
        this.totalResources += soundFiles.length;
        
        soundFiles.forEach(soundName => {
            const audio = new Audio();
            audio.src = `game/sound/${soundName}.mp3`;
            
            audio.addEventListener('canplaythrough', () => {
                this.resourceLoaded();
            }, { once: true });
            
            audio.addEventListener('error', () => {
                console.error(`Error loading sound: ${soundName}`);
                this.resourceLoaded();
            });
            
            this.sounds[soundName] = audio;
        });
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        
        // Basic textures for the game
        const textureFiles = [
            { name: 'floor', file: 'floor.jpg' },
            { name: 'wall', file: 'wall.jpg' },
            { name: 'banana', file: 'banana.jpg' },
            { name: 'player', file: 'player.jpg' },
            { name: 'monster_green', file: 'monster_green.jpg' },
            { name: 'monster_purple', file: 'monster_purple.jpg' }
        ];
        
        this.totalResources += textureFiles.length;
        
        textureFiles.forEach(texture => {
            // For now, we'll create solid color textures since we don't have the actual texture files
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            
            // Different colors for different textures
            let color;
            switch(texture.name) {
                case 'floor': color = '#8B4513'; break; // Brown
                case 'wall': color = '#808080'; break; // Gray
                case 'banana': color = '#FFFF00'; break; // Yellow
                case 'player': color = '#FF0000'; break; // Red
                case 'monster_green': color = '#00FF00'; break; // Green
                case 'monster_purple': color = '#800080'; break; // Purple
                default: color = '#FFFFFF'; break; // White
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 128, 128);
            
            // Add some texture pattern
            if (texture.name === 'wall') {
                ctx.strokeStyle = '#606060';
                ctx.lineWidth = 2;
                for (let i = 0; i < 128; i += 16) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(128, i);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, 128);
                    ctx.stroke();
                }
            } else if (texture.name === 'floor') {
                ctx.strokeStyle = '#6B3E0B';
                ctx.lineWidth = 1;
                for (let i = 0; i < 128; i += 32) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(128, i);
                    ctx.stroke();
                }
            }
            
            const dataURL = canvas.toDataURL();
            
            textureLoader.load(
                dataURL,
                (texture) => {
                    this.textures[texture.name] = texture;
                    this.resourceLoaded();
                },
                undefined,
                (error) => {
                    console.error(`Error loading texture: ${texture.name}`);
                    this.resourceLoaded();
                }
            );
        });
    }

    resourceLoaded() {
        this.loadedResources++;
        
        if (this.onProgress) {
            const progress = this.loadedResources / this.totalResources;
            this.onProgress(progress);
        }
        
        if (this.loadedResources === this.totalResources && this.onComplete) {
            this.onComplete();
        }
    }

    getSound(name) {
        return this.sounds[name];
    }

    getTexture(name) {
        return this.textures[name];
    }

    playSound(name) {
        const sound = this.getSound(name);
        if (sound) {
            // Clone the audio to allow multiple instances to play simultaneously
            const soundClone = sound.cloneNode();
            soundClone.volume = SOUND_VOLUME;
            soundClone.play();
            return soundClone;
        }
        return null;
    }
} 