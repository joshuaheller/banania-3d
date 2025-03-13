class Game {
    constructor() {
        // Game state
        this.state = STATE_LOADING;
        this.level = null;
        this.player = null;
        this.monsters = [];
        this.resources = null;
        this.input = null;
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Camera settings
        this.cameraView = CAMERA_VIEW_BEHIND; // Default camera view
        
        // Animation and timing
        this.clock = null;
        this.animations = [];
        this.lastTime = 0;
        
        // Initialize the game
        this.init();
    }
    
    init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        
        // Add lights
        this.setupLights();
        
        // Create clock for timing
        this.clock = new THREE.Clock();
        
        // Create resources manager
        this.resources = new Resources();
        
        // Create level manager
        this.level = new Level(this);
        
        // Create input manager
        this.input = new Input(this);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Load resources
        this.resources.init(
            (progress) => {
                // Update loading progress
                document.getElementById('loading-bar').style.width = `${progress * 100}%`;
            },
            () => {
                // Resources loaded, show title screen
                this.showTitleScreen();
            }
        );
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.scene.add(directionalLight);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    showTitleScreen() {
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        // Set game state
        this.state = STATE_TITLE;
        
        // Create title screen
        this.createTitleScreen();
        
        // Start animation loop
        this.animate();
    }
    
    createTitleScreen() {
        // Create a simple title screen with text using canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 128);
        
        ctx.font = 'bold 72px Arial';
        ctx.fillStyle = '#FFFF00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BANANIA 3D', 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const titlePlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.25), material);
        
        titlePlane.position.set(0, 2, 0);
        this.scene.add(titlePlane);
        
        // Add instruction text
        const instructCanvas = document.createElement('canvas');
        instructCanvas.width = 512;
        instructCanvas.height = 64;
        const instructCtx = instructCanvas.getContext('2d');
        
        instructCtx.fillStyle = '#000000';
        instructCtx.fillRect(0, 0, 512, 64);
        
        instructCtx.font = '24px Arial';
        instructCtx.fillStyle = '#FFFFFF';
        instructCtx.textAlign = 'center';
        instructCtx.textBaseline = 'middle';
        instructCtx.fillText('Press SPACE or ENTER to start', 256, 32);
        
        const instructTexture = new THREE.CanvasTexture(instructCanvas);
        const instructMaterial = new THREE.MeshBasicMaterial({ map: instructTexture, transparent: true });
        const instructPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.625), instructMaterial);
        
        instructPlane.position.set(0, 0, 0);
        this.scene.add(instructPlane);
        
        // Add animations
        this.animations.push({
            object: titlePlane,
            type: 'float',
            speed: 0.005,
            amplitude: 0.2
        });
        
        // Store references to title objects
        this.titleObjects = [titlePlane, instructPlane];
    }
    
    startGame() {
        // Remove title screen objects
        if (this.titleObjects) {
            this.titleObjects.forEach(obj => this.scene.remove(obj));
            this.titleObjects = null;
        }
        
        // Set game state
        this.state = STATE_PLAYING;
        
        // Create floor
        this.createFloor();
        
        // Initialize level
        this.level.init(this.scene);
        
        // Position camera
        this.updateCameraPosition();
        
        // Play start sound
        this.playSound('newplane');
    }
    
    createFloor() {
        const floorSize = Math.max(LEV_DIMENSION_X, LEV_DIMENSION_Y) * TILE_SIZE * 1.5;
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown color
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        
        floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        floor.position.y = -0.01; // Slightly below other objects to avoid z-fighting
        floor.receiveShadow = true;
        
        this.scene.add(floor);
    }
    
    createPlayer(position) {
        this.player = new Player(position);
        this.player.createMesh(this.scene);
        
        // Set initial grid position
        const gridPos = this.level.worldToGrid(position.x, position.z);
        this.player.gridPosition = gridPos;
        
        // Update camera to follow player
        this.updateCameraPosition();
    }
    
    createMonster(position, type) {
        const monster = new Monster(position, type);
        monster.createMesh(this.scene);
        
        // Set initial grid position
        const gridPos = this.level.worldToGrid(position.x, position.z);
        monster.gridPosition = gridPos;
        
        // Store reference to game in monster for callbacks
        monster.mesh.userData.game = this;
        
        // Add to monsters array
        this.monsters.push(monster);
    }
    
    updateCameraPosition() {
        if (!this.player || !this.player.mesh) return;
        
        let targetPosition = new THREE.Vector3();
        let lookAtPosition = new THREE.Vector3();
        
        switch (this.cameraView) {
            case CAMERA_VIEW_BEHIND:
                // Position camera to follow player from behind and above at an angle
                targetPosition.set(
                    this.player.mesh.position.x,
                    this.player.mesh.position.y + CAMERA_HEIGHT,
                    this.player.mesh.position.z + CAMERA_DISTANCE
                );
                
                // Look at a point slightly ahead of the player for better perspective
                lookAtPosition.set(
                    this.player.mesh.position.x,
                    this.player.mesh.position.y,
                    this.player.mesh.position.z - 2 // Look slightly ahead of the player
                );
                break;
                
            case CAMERA_VIEW_TOP:
                // Position camera directly above the player
                targetPosition.set(
                    this.player.mesh.position.x,
                    this.player.mesh.position.y + CAMERA_HEIGHT * 1.5,
                    this.player.mesh.position.z
                );
                
                // Look directly at the player from above
                lookAtPosition.set(
                    this.player.mesh.position.x,
                    this.player.mesh.position.y,
                    this.player.mesh.position.z
                );
                
                // Set camera up vector to maintain consistent controls orientation
                this.camera.up.set(0, 0, -1);
                break;
                
            case CAMERA_VIEW_ISOMETRIC:
                // Position camera at an isometric angle
                targetPosition.set(
                    this.player.mesh.position.x + CAMERA_DISTANCE * 0.7,
                    this.player.mesh.position.y + CAMERA_HEIGHT,
                    this.player.mesh.position.z + CAMERA_DISTANCE * 0.7
                );
                
                // Look at the player from an isometric angle
                lookAtPosition.set(
                    this.player.mesh.position.x,
                    this.player.mesh.position.y,
                    this.player.mesh.position.z
                );
                break;
        }
        
        // Smoothly move camera to target position
        this.camera.position.lerp(targetPosition, 0.1);
        this.camera.lookAt(lookAtPosition);
        
        // Reset camera up vector for non-top views to maintain standard orientation
        if (this.cameraView !== CAMERA_VIEW_TOP) {
            this.camera.up.set(0, 1, 0);
        }
    }
    
    animate(time) {
        requestAnimationFrame((t) => this.animate(t));
        
        // Calculate delta time
        const deltaTime = this.clock.getDelta();
        
        // Update animations
        this.updateAnimations(deltaTime);
        
        // Update game logic based on state
        switch (this.state) {
            case STATE_PLAYING:
                this.updateGame(deltaTime);
                break;
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    updateGame(deltaTime) {
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
        }
        
        // Update monsters
        this.monsters.forEach(monster => {
            monster.update(deltaTime, this.level, this);
        });
        
        // Update camera position to follow player
        this.updateCameraPosition();
    }
    
    updateAnimations(deltaTime) {
        // Process all animations
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const anim = this.animations[i];
            
            switch (anim.type) {
                case 'rotate':
                    anim.object.rotation.y += anim.speed;
                    break;
                    
                case 'float':
                    anim.object.position.y = anim.object.position.y + Math.sin(Date.now() * anim.speed) * anim.amplitude * deltaTime;
                    break;
                    
                case 'move':
                    // Calculate direction vector
                    const dirVector = {
                        x: anim.targetPosition.x - anim.object.position.x,
                        y: anim.targetPosition.y - anim.object.position.y,
                        z: anim.targetPosition.z - anim.object.position.z
                    };
                    
                    // Calculate distance to target
                    const distance = Math.sqrt(
                        dirVector.x * dirVector.x + 
                        dirVector.y * dirVector.y + 
                        dirVector.z * dirVector.z
                    );
                    
                    if (distance <= anim.speed * deltaTime) {
                        // We've reached the target position
                        anim.object.position.set(
                            anim.targetPosition.x,
                            anim.targetPosition.y,
                            anim.targetPosition.z
                        );
                        
                        // Call completion callback if provided
                        if (anim.onComplete) {
                            anim.onComplete();
                        }
                        
                        // Remove animation
                        this.animations.splice(i, 1);
                    } else {
                        // Normalize direction vector
                        dirVector.x /= distance;
                        dirVector.y /= distance;
                        dirVector.z /= distance;
                        
                        // Move towards target
                        anim.object.position.x += dirVector.x * anim.speed * deltaTime;
                        anim.object.position.y += dirVector.y * anim.speed * deltaTime;
                        anim.object.position.z += dirVector.z * anim.speed * deltaTime;
                    }
                    break;
                    
                case 'scale':
                    // Track animation progress
                    anim.progress = anim.progress || 0;
                    anim.progress += deltaTime * 60 / anim.duration;
                    
                    if (anim.progress >= 1) {
                        // Animation complete
                        anim.object.scale.set(
                            anim.targetScale.x,
                            anim.targetScale.y,
                            anim.targetScale.z
                        );
                        
                        // Call completion callback if provided
                        if (anim.onComplete) {
                            anim.onComplete();
                        }
                        
                        // Remove animation
                        this.animations.splice(i, 1);
                    } else {
                        // Interpolate scale
                        const startScale = { x: 1, y: 1, z: 1 };
                        anim.object.scale.set(
                            startScale.x + (anim.targetScale.x - startScale.x) * anim.progress,
                            startScale.y + (anim.targetScale.y - startScale.y) * anim.progress,
                            startScale.z + (anim.targetScale.z - startScale.z) * anim.progress
                        );
                    }
                    break;
                    
                case 'fade':
                    // Track animation progress
                    anim.progress = anim.progress || 0;
                    anim.progress += deltaTime * 60 / anim.duration;
                    
                    if (anim.progress >= 1) {
                        // Animation complete
                        if (anim.object.material) {
                            anim.object.material.opacity = 0;
                        }
                        
                        // Call completion callback if provided
                        if (anim.onComplete) {
                            anim.onComplete();
                        }
                        
                        // Remove animation
                        this.animations.splice(i, 1);
                    } else {
                        // Interpolate opacity
                        if (anim.object.material) {
                            anim.object.material.transparent = true;
                            anim.object.material.opacity = 1 - anim.progress;
                        }
                    }
                    break;
            }
        }
    }
    
    playSound(name) {
        if (this.resources) {
            return this.resources.playSound(name);
        }
        return null;
    }
    
    activateExit() {
        // Find exit in the scene
        let exit = null;
        this.scene.traverse((object) => {
            if (object.userData.type === OBJECT_EXIT) {
                exit = object;
            }
        });
        
        if (exit) {
            // Change exit color to indicate it's active
            if (exit.material) {
                exit.material.color.set(0x00ff00); // Bright green
            }
            
            // Add pulsing animation
            this.animations.push({
                object: exit,
                type: 'scale',
                targetScale: { x: 1.2, y: 1.2, z: 1.2 },
                duration: 30,
                onComplete: () => {
                    this.animations.push({
                        object: exit,
                        type: 'scale',
                        targetScale: { x: 1, y: 1, z: 1 },
                        duration: 30,
                        onComplete: () => {
                            // Repeat animation
                            this.activateExit();
                        }
                    });
                }
            });
        }
    }
    
    gameOver() {
        this.state = STATE_GAME_OVER;
        
        // Show game over message
        const gameOverCanvas = document.createElement('canvas');
        gameOverCanvas.width = 512;
        gameOverCanvas.height = 128;
        const ctx = gameOverCanvas.getContext('2d');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 128);
        
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#FF0000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', 256, 64);
        
        const texture = new THREE.CanvasTexture(gameOverCanvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const gameOverPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.25), material);
        
        gameOverPlane.position.set(0, 2, 0);
        this.scene.add(gameOverPlane);
        
        // Add restart instruction
        const restartCanvas = document.createElement('canvas');
        restartCanvas.width = 512;
        restartCanvas.height = 64;
        const restartCtx = restartCanvas.getContext('2d');
        
        restartCtx.fillStyle = '#000000';
        restartCtx.fillRect(0, 0, 512, 64);
        
        restartCtx.font = '24px Arial';
        restartCtx.fillStyle = '#FFFFFF';
        restartCtx.textAlign = 'center';
        restartCtx.textBaseline = 'middle';
        restartCtx.fillText('Press R to restart level', 256, 32);
        
        const restartTexture = new THREE.CanvasTexture(restartCanvas);
        const restartMaterial = new THREE.MeshBasicMaterial({ map: restartTexture, transparent: true });
        const restartPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.625), restartMaterial);
        
        restartPlane.position.set(0, 1, 0);
        this.scene.add(restartPlane);
        
        // Store references to game over objects
        this.gameOverObjects = [gameOverPlane, restartPlane];
        
        // Play game over sound
        this.playSound('argl');
    }
    
    gameComplete() {
        this.state = STATE_GAME_COMPLETE;
        
        // Show game complete message
        const gameCompleteCanvas = document.createElement('canvas');
        gameCompleteCanvas.width = 512;
        gameCompleteCanvas.height = 128;
        const ctx = gameCompleteCanvas.getContext('2d');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 128);
        
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#FFFF00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CONGRATULATIONS!', 256, 64);
        
        const texture = new THREE.CanvasTexture(gameCompleteCanvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const gameCompletePlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.25), material);
        
        gameCompletePlane.position.set(0, 2, 0);
        this.scene.add(gameCompletePlane);
        
        // Add restart instruction
        const restartCanvas = document.createElement('canvas');
        restartCanvas.width = 512;
        restartCanvas.height = 64;
        const restartCtx = restartCanvas.getContext('2d');
        
        restartCtx.fillStyle = '#000000';
        restartCtx.fillRect(0, 0, 512, 64);
        
        restartCtx.font = '24px Arial';
        restartCtx.fillStyle = '#FFFFFF';
        restartCtx.textAlign = 'center';
        restartCtx.textBaseline = 'middle';
        restartCtx.fillText('You completed all levels!', 256, 32);
        
        const restartTexture = new THREE.CanvasTexture(restartCanvas);
        const restartMaterial = new THREE.MeshBasicMaterial({ map: restartTexture, transparent: true });
        const restartPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.625), restartMaterial);
        
        restartPlane.position.set(0, 1, 0);
        this.scene.add(restartPlane);
        
        // Store references to game complete objects
        this.gameCompleteObjects = [gameCompletePlane, restartPlane];
        
        // Play game complete sound
        this.playSound('yeah');
    }
    
    restartLevel() {
        // Remove game over objects
        if (this.gameOverObjects) {
            this.gameOverObjects.forEach(obj => this.scene.remove(obj));
            this.gameOverObjects = null;
        }
        
        // Reset player
        if (this.player) {
            this.player.reset();
        }
        
        // Clear monsters
        this.monsters.forEach(monster => {
            if (monster.mesh) {
                this.scene.remove(monster.mesh);
            }
        });
        this.monsters = [];
        
        // Reset level
        this.level.loadLevel(this.level.currentLevel);
        
        // Set game state
        this.state = STATE_PLAYING;
    }
    
    // Method to change camera view
    changeCameraView(view) {
        if (view >= CAMERA_VIEW_BEHIND && view <= CAMERA_VIEW_ISOMETRIC) {
            this.cameraView = view;
            
            // Update UI to show current camera view
            const viewNames = ['Behind', 'Top-Down', 'Isometric'];
            const cameraInfoElement = document.getElementById('camera-info');
            if (cameraInfoElement) {
                cameraInfoElement.textContent = `Camera: ${viewNames[this.cameraView]}`;
            } else {
                // Create camera info element if it doesn't exist
                const infoElement = document.createElement('div');
                infoElement.id = 'camera-info';
                infoElement.style.position = 'absolute';
                infoElement.style.top = '40px';
                infoElement.style.right = '10px';
                infoElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                infoElement.style.color = 'white';
                infoElement.style.padding = '5px 10px';
                infoElement.style.borderRadius = '5px';
                infoElement.textContent = `Camera: ${viewNames[this.cameraView]}`;
                document.body.appendChild(infoElement);
            }
        }
    }
} 