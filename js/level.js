// Level data from the original game
const LEVELS = [
    // Level 1 - Original game level 1
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0], // Player start
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0], // Walls
        [0,0,0,0,0,5,0,6,0,0,0,0,0], // Monsters
        [3,3,3,3,3,3,0,3,3,3,3,3,3], // Walls
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,0], // Banana
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0], // Walls
        [0,0,5,0,6,0,0,0,5,0,5,0,0], // Monsters
        [3,3,3,3,3,3,0,3,3,3,3,3,3], // Walls
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,0], // Banana
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0], // Walls
        [0,0,0,0,0,5,0,6,0,0,0,0,0], // Monsters
        [3,3,3,3,3,3,0,3,3,3,3,3,3], // Walls
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,4,0,0,0,0,0,0], // Exit
        [0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    // Level 2 - Original game level 2
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,0,0,3,0,0,0,0,0,3,0],
        [0,3,3,3,3,3,0,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,3,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,2,3,0], // Banana
        [0,3,3,3,3,3,3,3,3,3,0,3,0],
        [0,3,5,0,0,0,0,0,0,0,0,3,0], // Monster
        [0,3,0,3,3,3,3,3,3,3,4,3,0], // Exit
        [0,3,3,3,3,3,3,3,3,3,3,3,0]
    ],
    // Level 3 - Original game level 3
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,0,3,3,3,0,3,0], // B
        [0,3,0,3,0,5,0,3,0,3,0,3,0],
        [0,3,0,3,3,3,0,3,3,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,0,0,3,0],
        [0,3,0,3,3,3,0,3,0,0,0,3,0],
        [0,3,0,0,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,0,3,3,3,0,3,0], // A
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,3,3,3,0,3,3,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,0,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,0,3,3,3,0,3,0], // M
        [0,3,0,3,5,3,0,3,5,3,0,3,0],
        [0,3,0,3,2,3,0,3,2,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,1,0,0,0,0,0,0,0,4,3,0], // Player start and exit
        [0,3,3,3,3,3,3,3,3,3,3,3,0]
    ],
    // Level 4 - Original game level 4
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,0,0,3,0,0,0,0,0,3,0],
        [0,3,3,3,3,3,0,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,3,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,2,3,0], // Banana
        [0,3,3,3,3,3,3,3,3,3,0,3,0],
        [0,3,5,0,0,0,0,0,0,0,0,3,0], // Monster
        [0,3,0,3,3,3,3,3,3,3,4,3,0], // Exit
        [0,3,3,3,3,3,3,3,3,3,3,3,0]
    ],
    // Level 5 - Original game level 5
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0],
        [0,3,1,0,0,0,0,0,0,0,0,3,0], // Player start
        [0,3,0,3,3,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,15,3,0,3,0,3,0], // Door 1
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,0,0,3,0,0,0,0,0,3,0],
        [0,3,3,3,3,3,0,3,3,3,3,3,0],
        [0,3,9,0,0,0,0,3,0,0,0,3,0], // Key 1
        [0,3,0,3,3,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,2,3,0], // Banana
        [0,3,3,3,3,3,3,3,3,3,0,3,0],
        [0,3,5,0,0,0,0,0,0,0,0,3,0], // Monster
        [0,3,0,3,3,3,3,3,3,3,4,3,0], // Exit
        [0,3,3,3,3,3,3,3,3,3,3,3,0]
    ],
    // Level 6 - Original game level 6
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,3,3,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,3,0,3,0,3,0,3,0,3,0],
        [0,3,0,0,0,3,0,0,0,0,0,3,0],
        [0,3,3,3,3,3,0,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,3,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,0,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,3,0,3,0],
        [0,3,0,3,0,3,3,3,3,3,0,3,0],
        [0,3,0,3,0,0,0,0,0,0,0,3,0],
        [0,3,0,3,3,3,3,3,3,3,3,3,0],
        [0,3,0,0,0,0,0,0,0,0,2,3,0], // Banana
        [0,3,3,3,3,3,3,3,3,3,0,3,0],
        [0,3,5,0,0,0,0,0,0,0,0,3,0], // Monster
        [0,3,0,3,3,3,3,3,3,3,4,3,0], // Exit
        [0,3,3,3,3,3,3,3,3,3,3,3,0]
    ]
];

class Level {
    constructor(game) {
        this.game = game;
        this.currentLevel = 0; // Start at level 1 (index 0) by default
        this.grid = [];
        this.entities = [];
        this.bananas = [];
        this.bananasCollected = 0;
        this.scene = null;
    }

    init(scene) {
        this.scene = scene;
        this.loadLevel(this.currentLevel);
    }

    loadLevel(levelIndex) {
        if (levelIndex >= LEVELS.length) {
            this.game.gameComplete();
            return;
        }

        this.currentLevel = levelIndex;
        this.grid = [];
        this.entities = [];
        this.bananas = [];
        this.bananasCollected = 0;
        
        // Clear previous level objects from the scene
        this.clearLevel();
        
        // Create a copy of the level data
        const levelData = LEVELS[levelIndex];
        
        // Process the level data
        for (let x = 0; x < LEV_DIMENSION_X; x++) {
            this.grid[x] = [];
            for (let y = 0; y < LEV_DIMENSION_Y; y++) {
                const tileType = levelData[x][y];
                this.grid[x][y] = tileType;
                
                // Create 3D objects based on tile type
                this.createObject(x, y, tileType);
            }
        }
        
        // Update UI
        document.getElementById('level-info').textContent = `Level: ${this.currentLevel + 1}`;
        document.getElementById('bananas-info').textContent = `Bananas: ${this.bananasCollected}/${this.bananas.length}`;
    }

    clearLevel() {
        // Remove all level-related objects from the scene
        if (this.scene) {
            const objectsToRemove = [];
            this.scene.traverse((object) => {
                if (object.userData.levelObject) {
                    objectsToRemove.push(object);
                }
            });
            
            objectsToRemove.forEach(object => {
                this.scene.remove(object);
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
    }

    createObject(x, y, tileType) {
        if (!this.scene) return;
        
        const position = this.gridToWorld(x, y);
        
        switch (tileType) {
            case OBJECT_WALL:
                this.createWall(position);
                break;
            case OBJECT_BANANA:
                this.createBanana(position);
                break;
            case OBJECT_PLAYER:
                this.game.createPlayer(position);
                break;
            case OBJECT_EXIT:
                this.createExit(position);
                break;
            case OBJECT_MONSTER_GREEN:
                this.game.createMonster(position, 'green');
                break;
            case OBJECT_MONSTER_PURPLE:
                this.game.createMonster(position, 'purple');
                break;
            case OBJECT_BLOCK_LIGHT:
            case OBJECT_BLOCK_HEAVY:
                this.createBlock(position, tileType);
                break;
            case OBJECT_KEY_1:
            case OBJECT_KEY_2:
            case OBJECT_KEY_3:
            case OBJECT_KEY_4:
            case OBJECT_KEY_5:
            case OBJECT_KEY_6:
                this.createKey(position, tileType - OBJECT_KEY_1 + 1);
                break;
            case OBJECT_DOOR_1:
            case OBJECT_DOOR_2:
            case OBJECT_DOOR_3:
            case OBJECT_DOOR_4:
            case OBJECT_DOOR_5:
            case OBJECT_DOOR_6:
                this.createDoor(position, tileType - OBJECT_DOOR_1 + 1);
                break;
        }
    }

    createWall(position) {
        // Create a wall that resembles the original game's walls
        const geometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 1.5, TILE_SIZE);
        
        // Create a textured material that resembles the original game's wall texture
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x888888,
            emissive: 0x222222,
            flatShading: true
        });
        
        const wall = new THREE.Mesh(geometry, material);
        
        // Add a wireframe overlay to make the grid pattern visible
        const wireframeGeometry = new THREE.BoxGeometry(TILE_SIZE * 1.01, TILE_SIZE * 1.51, TILE_SIZE * 1.01);
        const wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wall.add(wireframe);
        
        wall.position.set(position.x, position.y + TILE_SIZE * 0.75, position.z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        wall.userData.levelObject = true;
        wall.userData.type = OBJECT_WALL;
        
        this.scene.add(wall);
    }

    createBanana(position) {
        const geometry = new THREE.SphereGeometry(TILE_SIZE * 0.3, 8, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const banana = new THREE.Mesh(geometry, material);
        
        banana.position.set(position.x, position.y + TILE_SIZE * 0.3, position.z);
        banana.userData.levelObject = true;
        banana.userData.type = OBJECT_BANANA;
        
        this.scene.add(banana);
        this.bananas.push(banana);
        
        // Add animation
        this.game.animations.push({
            object: banana,
            type: 'rotate',
            speed: 0.02
        });
    }

    createExit(position) {
        const geometry = new THREE.CylinderGeometry(TILE_SIZE * 0.5, TILE_SIZE * 0.5, TILE_SIZE * 0.1, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const exit = new THREE.Mesh(geometry, material);
        
        exit.position.set(position.x, position.y + TILE_SIZE * 0.05, position.z);
        exit.userData.levelObject = true;
        exit.userData.type = OBJECT_EXIT;
        
        this.scene.add(exit);
    }

    createBlock(position, type) {
        const isHeavy = type === OBJECT_BLOCK_HEAVY;
        const geometry = new THREE.BoxGeometry(TILE_SIZE * 0.8, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
        const material = new THREE.MeshLambertMaterial({ 
            color: isHeavy ? 0x0000aa : 0x0088ff 
        });
        const block = new THREE.Mesh(geometry, material);
        
        block.position.set(position.x, position.y + TILE_SIZE * 0.4, position.z);
        block.userData.levelObject = true;
        block.userData.type = type;
        block.userData.movable = true;
        block.userData.heavy = isHeavy;
        
        this.scene.add(block);
        this.entities.push(block);
    }

    createKey(position, keyNumber) {
        const geometry = new THREE.CylinderGeometry(TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.1, 8);
        
        // Different colors for different keys
        const colors = [0xffff00, 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff];
        const material = new THREE.MeshLambertMaterial({ color: colors[keyNumber - 1] });
        
        const key = new THREE.Mesh(geometry, material);
        key.position.set(position.x, position.y + TILE_SIZE * 0.05, position.z);
        key.userData.levelObject = true;
        key.userData.type = OBJECT_KEY_1 + keyNumber - 1;
        
        this.scene.add(key);
        
        // Add animation
        this.game.animations.push({
            object: key,
            type: 'float',
            speed: 0.01,
            amplitude: 0.2
        });
    }

    createDoor(position, doorNumber) {
        const geometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE * 1.5, TILE_SIZE);
        
        // Different colors for different doors
        const colors = [0xffff00, 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff];
        const material = new THREE.MeshLambertMaterial({ color: colors[doorNumber - 1] });
        
        const door = new THREE.Mesh(geometry, material);
        door.position.set(position.x, position.y + TILE_SIZE * 0.75, position.z);
        door.userData.levelObject = true;
        door.userData.type = OBJECT_DOOR_1 + doorNumber - 1;
        door.userData.doorNumber = doorNumber;
        
        this.scene.add(door);
    }

    gridToWorld(gridX, gridY) {
        // Convert grid coordinates to world coordinates
        // Center the level in the world
        const offsetX = -((LEV_DIMENSION_X - 1) * TILE_SIZE) / 2;
        const offsetZ = -((LEV_DIMENSION_Y - 1) * TILE_SIZE) / 2;
        
        return {
            x: offsetX + gridX * TILE_SIZE,
            y: 0, // Ground level
            z: offsetZ + gridY * TILE_SIZE
        };
    }

    worldToGrid(worldX, worldZ) {
        // Convert world coordinates to grid coordinates
        const offsetX = -((LEV_DIMENSION_X - 1) * TILE_SIZE) / 2;
        const offsetZ = -((LEV_DIMENSION_Y - 1) * TILE_SIZE) / 2;
        
        const gridX = Math.round((worldX - offsetX) / TILE_SIZE);
        const gridY = Math.round((worldZ - offsetZ) / TILE_SIZE);
        
        return { x: gridX, y: gridY };
    }

    isValidPosition(gridX, gridY) {
        return gridX >= 0 && gridX < LEV_DIMENSION_X && 
               gridY >= 0 && gridY < LEV_DIMENSION_Y;
    }

    getTileAt(gridX, gridY) {
        if (!this.isValidPosition(gridX, gridY)) return OBJECT_WALL;
        return this.grid[gridX][gridY];
    }

    collectBanana(banana) {
        const index = this.bananas.indexOf(banana);
        if (index !== -1) {
            this.bananas.splice(index, 1);
            this.scene.remove(banana);
            this.bananasCollected++;
            
            // Update UI
            document.getElementById('bananas-info').textContent = `Bananas: ${this.bananasCollected}/${this.bananas.length + this.bananasCollected}`;
            
            // Play sound
            this.game.playSound('getpoint');
            
            // Check if all bananas are collected
            if (this.bananas.length === 0) {
                // Activate exit
                this.game.activateExit();
            }
        }
    }

    openDoor(doorNumber) {
        let doorFound = false;
        
        this.scene.traverse((object) => {
            if (object.userData.type === OBJECT_DOOR_1 + doorNumber - 1) {
                // Play door opening animation
                this.game.animations.push({
                    object: object,
                    type: 'fade',
                    duration: DOOR_ANIMATION_DURATION,
                    onComplete: () => {
                        this.scene.remove(object);
                    }
                });
                
                doorFound = true;
            }
        });
        
        if (doorFound) {
            // Play sound
            this.game.playSound('opendoor');
        }
        
        return doorFound;
    }

    nextLevel() {
        this.loadLevel(this.currentLevel + 1);
    }
} 