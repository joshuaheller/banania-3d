// Game constants
const TILE_SIZE = 1; // Size of each tile in the 3D world
const PLAYER_SPEED = 3; // Player movement speed
const MONSTER_SPEED = 2; // Monster movement speed
const CAMERA_HEIGHT = 15; // Increased camera height for a better view
const CAMERA_DISTANCE = 15; // Increased camera distance for a better view

// Camera view constants
const CAMERA_VIEW_BEHIND = 0; // Default view from behind and above
const CAMERA_VIEW_TOP = 1; // Top-down view
const CAMERA_VIEW_ISOMETRIC = 2; // Isometric view

// Level constants
const LEV_DIMENSION_X = 21;
const LEV_DIMENSION_Y = 13;

// Game object types
const OBJECT_EMPTY = 0;
const OBJECT_PLAYER = 1;
const OBJECT_BANANA = 2;
const OBJECT_WALL = 3;
const OBJECT_EXIT = 4;
const OBJECT_MONSTER_GREEN = 5;
const OBJECT_MONSTER_PURPLE = 6;
const OBJECT_BLOCK_LIGHT = 7;
const OBJECT_BLOCK_HEAVY = 8;
const OBJECT_KEY_1 = 9;
const OBJECT_KEY_2 = 10;
const OBJECT_KEY_3 = 11;
const OBJECT_KEY_4 = 12;
const OBJECT_KEY_5 = 13;
const OBJECT_KEY_6 = 14;
const OBJECT_DOOR_1 = 15;
const OBJECT_DOOR_2 = 16;
const OBJECT_DOOR_3 = 17;
const OBJECT_DOOR_4 = 18;
const OBJECT_DOOR_5 = 19;
const OBJECT_DOOR_6 = 20;

// Direction constants
const DIR_NONE = -1;
const DIR_UP = 0;
const DIR_LEFT = 1;
const DIR_DOWN = 2;
const DIR_RIGHT = 3;

// Game states
const STATE_LOADING = 0;
const STATE_TITLE = 1;
const STATE_PLAYING = 2;
const STATE_LEVEL_COMPLETE = 3;
const STATE_GAME_OVER = 4;
const STATE_GAME_COMPLETE = 5;

// Animation constants
const ANIMATION_DURATION = 8; // How many frames before animation changes
const DOOR_ANIMATION_DURATION = 15; // Door opening animation duration

// Sound constants
const SOUND_VOLUME = 0.7; 