class Entity {
    constructor(position, type) {
        this.position = position;
        this.type = type;
        this.mesh = null;
        this.gridPosition = { x: 0, y: 0 };
        this.direction = DIR_NONE;
        this.isMoving = false;
        this.targetPosition = null;
        this.moveSpeed = 0;
        this.animationFrame = 0;
        this.animationCounter = 0;
    }

    update(deltaTime) {
        // Update animation counter
        this.animationCounter++;
        if (this.animationCounter >= ANIMATION_DURATION) {
            this.animationCounter = 0;
            this.animationFrame = (this.animationFrame + 1) % 4; // 4 frames of animation
        }

        // Handle movement
        if (this.isMoving && this.targetPosition) {
            const moveStep = this.moveSpeed * deltaTime;
            
            // Calculate direction vector
            const dirVector = {
                x: this.targetPosition.x - this.mesh.position.x,
                z: this.targetPosition.z - this.mesh.position.z
            };
            
            // Calculate distance to target
            const distance = Math.sqrt(dirVector.x * dirVector.x + dirVector.z * dirVector.z);
            
            if (distance <= moveStep) {
                // We've reached the target position
                this.mesh.position.x = this.targetPosition.x;
                this.mesh.position.z = this.targetPosition.z;
                this.isMoving = false;
                this.targetPosition = null;
                this.onMoveComplete();
            } else {
                // Normalize direction vector
                dirVector.x /= distance;
                dirVector.z /= distance;
                
                // Move towards target
                this.mesh.position.x += dirVector.x * moveStep;
                this.mesh.position.z += dirVector.z * moveStep;
            }
        }
    }

    moveTo(targetGridX, targetGridY, level) {
        if (this.isMoving) return false;
        
        // Convert grid position to world position
        const targetWorldPos = level.gridToWorld(targetGridX, targetGridY);
        
        // Set target position
        this.targetPosition = {
            x: targetWorldPos.x,
            z: targetWorldPos.z
        };
        
        // Update grid position
        this.gridPosition.x = targetGridX;
        this.gridPosition.y = targetGridY;
        
        // Start moving
        this.isMoving = true;
        
        return true;
    }

    onMoveComplete() {
        // To be overridden by subclasses
    }

    setDirection(direction) {
        if (this.direction !== direction) {
            this.direction = direction;
            this.updateRotation();
        }
    }

    updateRotation() {
        if (!this.mesh) return;
        
        switch (this.direction) {
            case DIR_UP:
                this.mesh.rotation.y = Math.PI;
                break;
            case DIR_LEFT:
                this.mesh.rotation.y = Math.PI / 2;
                break;
            case DIR_DOWN:
                this.mesh.rotation.y = 0;
                break;
            case DIR_RIGHT:
                this.mesh.rotation.y = -Math.PI / 2;
                break;
        }
    }
}

class Player extends Entity {
    constructor(position) {
        super(position, OBJECT_PLAYER);
        this.moveSpeed = PLAYER_SPEED;
        this.keys = [false, false, false, false, false, false]; // Keys 1-6
        this.isDead = false;
        this.isWinning = false;
    }

    createMesh(scene) {
        // Create a simple player mesh (will be replaced with a proper model later)
        const geometry = new THREE.BoxGeometry(TILE_SIZE * 0.6, TILE_SIZE * 0.9, TILE_SIZE * 0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.set(this.position.x, this.position.y + TILE_SIZE * 0.45, this.position.z);
        this.mesh.userData.entity = this;
        this.mesh.userData.type = this.type;
        
        // Add to scene
        scene.add(this.mesh);
    }

    move(direction, level, game) {
        if (this.isMoving || this.isDead || this.isWinning) return false;
        
        this.setDirection(direction);
        
        // Calculate target position based on direction
        let targetX = this.gridPosition.x;
        let targetY = this.gridPosition.y;
        
        switch (direction) {
            case DIR_UP:
                targetY--;
                break;
            case DIR_LEFT:
                targetX--;
                break;
            case DIR_DOWN:
                targetY++;
                break;
            case DIR_RIGHT:
                targetX++;
                break;
        }
        
        // Check if the target position is valid
        if (!level.isValidPosition(targetX, targetY)) {
            return false;
        }
        
        const targetTile = level.getTileAt(targetX, targetY);
        
        // Handle different tile types
        switch (targetTile) {
            case OBJECT_EMPTY:
                // Empty space, can move
                return this.moveTo(targetX, targetY, level);
                
            case OBJECT_BANANA:
                // Collect banana and move
                this.collectBanana(targetX, targetY, level, game);
                return this.moveTo(targetX, targetY, level);
                
            case OBJECT_EXIT:
                // Move to exit if all bananas are collected
                if (level.bananas.length === 0) {
                    this.isWinning = true;
                    this.moveTo(targetX, targetY, level);
                    game.playSound('yeah');
                    setTimeout(() => {
                        level.nextLevel();
                        this.isWinning = false;
                    }, 1500);
                    return true;
                }
                return false;
                
            case OBJECT_KEY_1:
            case OBJECT_KEY_2:
            case OBJECT_KEY_3:
            case OBJECT_KEY_4:
            case OBJECT_KEY_5:
            case OBJECT_KEY_6:
                // Collect key and move
                this.collectKey(targetTile - OBJECT_KEY_1, targetX, targetY, level, game);
                return this.moveTo(targetX, targetY, level);
                
            case OBJECT_DOOR_1:
            case OBJECT_DOOR_2:
            case OBJECT_DOOR_3:
            case OBJECT_DOOR_4:
            case OBJECT_DOOR_5:
            case OBJECT_DOOR_6:
                // Try to open door with key
                const doorNumber = targetTile - OBJECT_DOOR_1 + 1;
                if (this.keys[doorNumber - 1]) {
                    level.openDoor(doorNumber);
                    return this.moveTo(targetX, targetY, level);
                }
                return false;
                
            case OBJECT_BLOCK_LIGHT:
            case OBJECT_BLOCK_HEAVY:
                // Try to push block
                return this.pushBlock(targetX, targetY, direction, level, game);
                
            case OBJECT_MONSTER_GREEN:
            case OBJECT_MONSTER_PURPLE:
                // Die when touching monster
                this.die(game);
                return false;
                
            default:
                return false;
        }
    }

    collectBanana(x, y, level, game) {
        // Find the banana object at this position
        let banana = null;
        level.scene.traverse((object) => {
            if (object.userData.type === OBJECT_BANANA) {
                const gridPos = level.worldToGrid(object.position.x, object.position.z);
                if (gridPos.x === x && gridPos.y === y) {
                    banana = object;
                }
            }
        });
        
        if (banana) {
            level.collectBanana(banana);
        }
    }

    collectKey(keyIndex, x, y, level, game) {
        // Find the key object at this position
        let key = null;
        level.scene.traverse((object) => {
            if (object.userData.type === OBJECT_KEY_1 + keyIndex) {
                const gridPos = level.worldToGrid(object.position.x, object.position.z);
                if (gridPos.x === x && gridPos.y === y) {
                    key = object;
                }
            }
        });
        
        if (key) {
            this.keys[keyIndex] = true;
            level.scene.remove(key);
            game.playSound('getpoint');
        }
    }

    pushBlock(x, y, direction, level, game) {
        // Find the block at this position
        let block = null;
        level.scene.traverse((object) => {
            if (object.userData.type === OBJECT_BLOCK_LIGHT || object.userData.type === OBJECT_BLOCK_HEAVY) {
                const gridPos = level.worldToGrid(object.position.x, object.position.z);
                if (gridPos.x === x && gridPos.y === y) {
                    block = object;
                }
            }
        });
        
        if (!block) return false;
        
        const isHeavy = block.userData.type === OBJECT_BLOCK_HEAVY;
        
        // Calculate target position for the block
        let targetX = x;
        let targetY = y;
        
        switch (direction) {
            case DIR_UP:
                targetY--;
                break;
            case DIR_LEFT:
                targetX--;
                break;
            case DIR_DOWN:
                targetY++;
                break;
            case DIR_RIGHT:
                targetX++;
                break;
        }
        
        // Check if the target position for the block is valid
        if (!level.isValidPosition(targetX, targetY)) {
            return false;
        }
        
        const targetTile = level.getTileAt(targetX, targetY);
        
        // Block can only be pushed to empty spaces
        if (targetTile !== OBJECT_EMPTY) {
            return false;
        }
        
        // Move the block
        const targetWorldPos = level.gridToWorld(targetX, targetY);
        
        // Animate block movement
        const moveAnimation = {
            object: block,
            type: 'move',
            targetPosition: {
                x: targetWorldPos.x,
                y: block.position.y,
                z: targetWorldPos.z
            },
            speed: this.moveSpeed,
            onComplete: () => {
                // Update grid
                level.grid[x][y] = OBJECT_EMPTY;
                level.grid[targetX][targetY] = block.userData.type;
            }
        };
        
        game.animations.push(moveAnimation);
        
        // Player can now move to the block's previous position
        return this.moveTo(x, y, level);
    }

    die(game) {
        if (this.isDead) return;
        
        this.isDead = true;
        game.playSound('argl');
        
        // Play death animation
        const deathAnimation = {
            object: this.mesh,
            type: 'scale',
            targetScale: { x: 0.1, y: 0.1, z: 0.1 },
            duration: 30,
            onComplete: () => {
                game.gameOver();
            }
        };
        
        game.animations.push(deathAnimation);
    }

    reset() {
        this.isDead = false;
        this.isWinning = false;
        this.isMoving = false;
        this.targetPosition = null;
        this.direction = DIR_NONE;
        this.keys = [false, false, false, false, false, false];
        
        if (this.mesh) {
            this.mesh.scale.set(1, 1, 1);
        }
    }
}

class Monster extends Entity {
    constructor(position, type) {
        super(position, type === 'green' ? OBJECT_MONSTER_GREEN : OBJECT_MONSTER_PURPLE);
        this.moveSpeed = MONSTER_SPEED;
        this.moveTimer = 0;
        this.moveInterval = 2000; // Increased from 1000 to 2000 ms (2 seconds) to slow down monsters
        this.canPushBlocks = type === 'purple'; // Purple monsters can push blocks
    }

    createMesh(scene) {
        // Create a simple monster mesh (will be replaced with a proper model later)
        const geometry = new THREE.SphereGeometry(TILE_SIZE * 0.4, 8, 8);
        const material = new THREE.MeshLambertMaterial({ 
            color: this.type === OBJECT_MONSTER_GREEN ? 0x00ff00 : 0x800080 
        });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.set(this.position.x, this.position.y + TILE_SIZE * 0.4, this.position.z);
        this.mesh.userData.entity = this;
        this.mesh.userData.type = this.type;
        
        // Add to scene
        scene.add(this.mesh);
    }

    update(deltaTime, level, game) {
        super.update(deltaTime);
        
        // Update move timer
        this.moveTimer += deltaTime * 1000;
        
        if (this.moveTimer >= this.moveInterval && !this.isMoving) {
            this.moveTimer = 0;
            this.moveTowardsPlayer(level, game);
        }
    }

    moveTowardsPlayer(level, game) {
        if (!game.player || game.player.isDead || game.player.isWinning) return;
        
        // Get player position
        const playerPos = game.player.gridPosition;
        
        // Calculate direction towards player
        const dx = playerPos.x - this.gridPosition.x;
        const dy = playerPos.y - this.gridPosition.y;
        
        // Determine primary direction (horizontal or vertical)
        const moveHorizontal = Math.abs(dx) > Math.abs(dy);
        
        let directions = [];
        
        if (moveHorizontal) {
            // Try horizontal movement first
            if (dx > 0) directions.push(DIR_RIGHT);
            else if (dx < 0) directions.push(DIR_LEFT);
            
            // Then try vertical
            if (dy > 0) directions.push(DIR_DOWN);
            else if (dy < 0) directions.push(DIR_UP);
        } else {
            // Try vertical movement first
            if (dy > 0) directions.push(DIR_DOWN);
            else if (dy < 0) directions.push(DIR_UP);
            
            // Then try horizontal
            if (dx > 0) directions.push(DIR_RIGHT);
            else if (dx < 0) directions.push(DIR_LEFT);
        }
        
        // Add random directions as fallbacks
        const randomDirs = [DIR_UP, DIR_LEFT, DIR_DOWN, DIR_RIGHT]
            .filter(dir => !directions.includes(dir))
            .sort(() => Math.random() - 0.5);
        
        directions = directions.concat(randomDirs);
        
        // Try each direction until one works
        for (const direction of directions) {
            if (this.move(direction, level, game)) {
                break;
            }
        }
    }

    move(direction, level, game) {
        if (this.isMoving) return false;
        
        this.setDirection(direction);
        
        // Calculate target position based on direction
        let targetX = this.gridPosition.x;
        let targetY = this.gridPosition.y;
        
        switch (direction) {
            case DIR_UP:
                targetY--;
                break;
            case DIR_LEFT:
                targetX--;
                break;
            case DIR_DOWN:
                targetY++;
                break;
            case DIR_RIGHT:
                targetX++;
                break;
        }
        
        // Check if the target position is valid
        if (!level.isValidPosition(targetX, targetY)) {
            return false;
        }
        
        const targetTile = level.getTileAt(targetX, targetY);
        
        // Handle different tile types
        switch (targetTile) {
            case OBJECT_EMPTY:
                // Empty space, can move
                return this.moveTo(targetX, targetY, level);
                
            case OBJECT_PLAYER:
                // Kill player
                game.player.die(game);
                return false;
                
            case OBJECT_BLOCK_LIGHT:
                // Purple monsters can push light blocks
                if (this.canPushBlocks) {
                    return this.pushBlock(targetX, targetY, direction, level, game);
                }
                return false;
                
            default:
                return false;
        }
    }

    pushBlock(x, y, direction, level, game) {
        // Find the block at this position
        let block = null;
        level.scene.traverse((object) => {
            if (object.userData.type === OBJECT_BLOCK_LIGHT) {
                const gridPos = level.worldToGrid(object.position.x, object.position.z);
                if (gridPos.x === x && gridPos.y === y) {
                    block = object;
                }
            }
        });
        
        if (!block) return false;
        
        // Calculate target position for the block
        let targetX = x;
        let targetY = y;
        
        switch (direction) {
            case DIR_UP:
                targetY--;
                break;
            case DIR_LEFT:
                targetX--;
                break;
            case DIR_DOWN:
                targetY++;
                break;
            case DIR_RIGHT:
                targetX++;
                break;
        }
        
        // Check if the target position for the block is valid
        if (!level.isValidPosition(targetX, targetY)) {
            return false;
        }
        
        const targetTile = level.getTileAt(targetX, targetY);
        
        // Block can only be pushed to empty spaces
        if (targetTile !== OBJECT_EMPTY) {
            return false;
        }
        
        // Move the block
        const targetWorldPos = level.gridToWorld(targetX, targetY);
        
        // Animate block movement
        const moveAnimation = {
            object: block,
            type: 'move',
            targetPosition: {
                x: targetWorldPos.x,
                y: block.position.y,
                z: targetWorldPos.z
            },
            speed: this.moveSpeed,
            onComplete: () => {
                // Update grid
                level.grid[x][y] = OBJECT_EMPTY;
                level.grid[targetX][targetY] = block.userData.type;
            }
        };
        
        game.animations.push(moveAnimation);
        
        // Monster can now move to the block's previous position
        return this.moveTo(x, y, level);
    }

    onMoveComplete() {
        // Check if monster is on the same tile as player
        const game = this.mesh.userData.game;
        if (game && game.player) {
            const playerPos = game.player.gridPosition;
            if (playerPos.x === this.gridPosition.x && playerPos.y === this.gridPosition.y) {
                game.player.die(game);
            }
        }
    }
} 