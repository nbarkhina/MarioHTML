var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameType;
    (function (GameType) {
        GameType[GameType["MARIO"] = 0] = "MARIO";
        GameType[GameType["GOOMBA"] = 1] = "GOOMBA";
        GameType[GameType["COINBLOCK"] = 2] = "COINBLOCK";
        GameType[GameType["MUSHROOM"] = 3] = "MUSHROOM";
        GameType[GameType["COIN"] = 4] = "COIN";
        GameType[GameType["PLATFORM"] = 5] = "PLATFORM";
        GameType[GameType["LAVA"] = 6] = "LAVA";
        GameType[GameType["FIREBALL"] = 7] = "FIREBALL";
        GameType[GameType["FIRERING"] = 8] = "FIRERING";
        GameType[GameType["BOWSER"] = 9] = "BOWSER";
        GameType[GameType["BOWSERFIRE"] = 10] = "BOWSERFIRE";
        GameType[GameType["TURTLE"] = 11] = "TURTLE";
    })(GameType = exports.GameType || (exports.GameType = {}));
    var GameState;
    (function (GameState) {
        GameState[GameState["GAME_STATE_LOADING"] = 0] = "GAME_STATE_LOADING";
        GameState[GameState["GAME_STATE_INTRO"] = 1] = "GAME_STATE_INTRO";
        GameState[GameState["GAME_STATE_PLAYING"] = 2] = "GAME_STATE_PLAYING";
        GameState[GameState["GAME_STATE_PAUSED"] = 3] = "GAME_STATE_PAUSED";
        GameState[GameState["GAME_STATE_WON"] = 4] = "GAME_STATE_WON";
    })(GameState = exports.GameState || (exports.GameState = {}));
    class Animator {
        constructor(x, y, width, height) {
            this.frames = [];
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        LoadFrame(filename) {
            let frame = new Image();
            frame.src = filename;
            this.frames.push(frame);
        }
    }
    exports.Animator = Animator;
    class SpecialObject {
        constructor() {
            this.type = 0; //what is it
            this.x = 0;
            this.y = 0; //coordinates
            this.height = 0;
            this.width = 0; //dimensions
        }
    }
    exports.SpecialObject = SpecialObject;
    ;
    class MarioGame {
        constructor(screenWidth, screenHeight, ctx, inputController, isMobile, isSixtyFPSmode) {
            // GLOBALS ////////////////////////////////////////////////
            /*
            **********GRID CHART**********
                *
            0-BLANK SPACE
            1-BREAKABLE BROWN BLOCK
            2,3-PIPE MIDSECTION
            4,5-PIPE TOP
            8-UNBREAKABLE BROWN BLOCK
            a-GOOMBA
            b-COIN BLOCK
            c-MUSHROOM BLOCK
            d-COIN
            e-FALLING PLATFORM
            f-SIDE TO SIDE PLATFORM
            g-UP DOWN PLATFORM
        
            --BOWSER'S CASTLE--
            6-UNBREAKABLE GRAY BRICK BLOCK
            7-UNBREAKABLE REGULAR BLOCK
            h-LAVA
            i-LAVA WITH RISING FIREBALL
            j-SPINNING FIRE RING
            k-BOWSER
        
            */
            this.screenWidth = 0;
            this.screenHeight = 0;
            this.sampleImage = new Image();
            this.sampleX = 100;
            this.sampleY = 100;
            this.isMobile = false;
            //world
            this.gravity = 2; //gravity on objects
            this.velocity = 0; //how fast mario is going
            this.marioX = 70; //mario's top left corner
            this.marioY = 350; //mario's top left corner
            this.animationCounter = 0; //counts which frame mario is on
            this.backSprites = 9; //number of sprites used for level
            this.direction = 0; //0==right  1==left
            this.maxVelocity = 7; //max speed of mario walking
            this.acceleration = .5; //mario's acceleration
            this.width = 40;
            this.height = 40; //mario's bounding box
            this.worldHeight = 12;
            this.worldWidth = 128; //world's grid dimensions
            this.slideFriction = 1; //how much mario slides
            this.flying = 0; //if mario is in the air 0==false 1==true
            this.jumpCounter = 0; //counts how many frames mario has been jumping for
            this.jumpLimit = 8; //how many frames mario can jump for
            this.jumpAcceleration = 0; //mario's maximum vertical acceleration (set to jumpSpeed)
            this.ySpeed = 0; //speed mario is rising or falling
            this.jumpReset = 0; //ready for jumping 0=true 1=false
            this.jumpSpeed = 15; //speed constant for jumping
            this.jumpSpeedRunning = 4; //mario can jump a little higher
            this.camera = 0; //camera's x coordinate
            // specialSize = 0;		//current size of special characters
            this.goombaVelocity = -1; //goomba's speed
            this.mushroomVelocity = 2; //mushroom's speed
            this.killCount = 0; //number of times mario has died
            this.coinAnimator = 0; //coin animator
            this.lavaAnimator = 0; //coin animator
            this.lives = 1000; //don't limit lives
            this.coins = 0;
            this.currentLevel = 0;
            this.gameOver = false;
            this.gameOverCounter = 0;
            this.bigHeight = 60;
            this.numLevels = 8;
            this.gameState = 0;
            this.dying = false;
            this.dyingCounter = 0;
            this.dyingX = 0;
            this.dyingY = 0;
            this.winningCounter = 0;
            this.marioObject = new SpecialObject();
            this.grid = [];
            this.tempgrid = [];
            this.level1 = [];
            this.level2 = [];
            this.level3 = [];
            this.level4 = [];
            this.level5 = [];
            this.level6 = [];
            this.level7 = [];
            this.level8 = [];
            this.backColor = 0;
            this.startinglivesnum = 10;
            this.hardwareaccelerate = true;
            this.platformVelocity = 4;
            this.platformTurnaroundFrames = 60;
            this.winScreen = new Image();
            this.runkey = false;
            this.jumpkey = false;
            this.leftkey = false;
            this.rightkey = false;
            this.isSixtyFPSmode = false;
            this.firstTimeFpsCheck = true;
            this.lastCalledTime = new Date();
            this.fpscounter = 0;
            this.currentfps = 0;
            this.screenWidth = screenWidth;
            this.screenHeight = screenHeight;
            this.ctx = ctx;
            this.sampleImage.src = "Images/mario1.png";
            this.inputController = inputController;
            this.isMobile = isMobile;
            //adjust physics from 30FPS to 60FPS
            this.isSixtyFPSmode = isSixtyFPSmode;
            if (isSixtyFPSmode) {
                this.gravity = 1;
                this.maxVelocity = 4.0;
                this.acceleration = .25;
                this.slideFriction = .5;
                this.jumpLimit = 17;
                this.jumpSpeed = 8;
                this.jumpSpeedRunning = 2.5;
                this.goombaVelocity = -.5;
                this.mushroomVelocity = 1;
                this.platformVelocity = 2;
                this.platformTurnaroundFrames = 120;
            }
            //ported code
            this.initgame();
        }
        clearScreen() {
            let gradient_mode = true;
            if (gradient_mode) {
                var my_gradient = this.ctx.createLinearGradient(0, 0, 0, 480);
                if (this.currentLevel != 4 && this.currentLevel != 8) {
                    my_gradient.addColorStop(0, "#D1E4EA");
                    my_gradient.addColorStop(1, "lightblue");
                }
                else {
                    my_gradient.addColorStop(0, "#F0EAE6");
                    my_gradient.addColorStop(1, "#efbf99");
                }
                this.ctx.fillStyle = my_gradient;
            }
            else {
                let backcolor = "lightblue";
                if (this.currentLevel == 4 || this.currentLevel == 8) {
                    backcolor = "#f0eae6";
                }
                this.ctx.fillStyle = backcolor;
            }
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        draw() {
            this.clearScreen();
            this.updateInput();
            this.countFPS();
            if (this.gameState == GameState.GAME_STATE_LOADING) {
                this.loading_screen();
            }
            if (this.gameState == GameState.GAME_STATE_INTRO) {
                //TODO draw intro screen
            }
            if (this.gameState == GameState.GAME_STATE_PLAYING) {
                this.gameMain();
                this.drawSTATS();
            }
            if (this.gameState == GameState.GAME_STATE_PAUSED) {
            }
            if (this.gameState == GameState.GAME_STATE_WON) {
                this.win();
            }
        }
        countFPS() {
            this.fpscounter++;
            let delta = (new Date().getTime() - this.lastCalledTime.getTime()) / 1000;
            if (delta > 1) {
                this.currentfps = this.fpscounter;
                this.fpscounter = 0;
                this.lastCalledTime = new Date();
            }
        }
        drawSTATS() {
            this.ctx.font = "bold 18px Comic Sans MS";
            this.ctx.fillStyle = "#F3F0F0";
            this.ctx.fillRect(52, 5, 185, 28);
            this.ctx.fillStyle = "#FF0000";
            this.ctx.fillText("Level: " + this.currentLevel.toString(), 60, 25);
            this.ctx.fillText("FPS: " + this.currentfps.toString(), 160, 25);
        }
        updateInput() {
            this.inputController.update();
            if (this.inputController.Key_Action_1 == false)
                this.runkey = false;
            if (this.inputController.Key_Action_2 == false)
                this.jumpkey = false;
            if (this.inputController.Key_Left == false)
                this.leftkey = false;
            if (this.inputController.Key_Right == false)
                this.rightkey = false;
            if (this.inputController.Key_Action_1 == true)
                this.runkey = true;
            if (this.inputController.Key_Action_2 == true)
                this.jumpkey = true;
            if (this.inputController.Key_Left == true)
                this.leftkey = true;
            if (this.inputController.Key_Right == true)
                this.rightkey = true;
        }
        initgame() {
            this.specialCharacters = [];
            this.grid = [];
            for (let i = 0; i < 12; i++) {
                let arr1 = [];
                this.grid.push(arr1);
            }
            this.tempgrid = [];
            this.loadbitmaps();
            this.startGame();
        }
        //so that i can debug the loading sequence
        startGame() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.loadLevel(1);
            });
        }
        loadbitmaps() {
            this.tiles = new Animator(0, 0, 40, 40);
            for (let index = 0; index < this.backSprites; index++) {
                this.tiles.LoadFrame("Images/background" + index + ".png");
            }
            this.mario = new Animator(0, 0, 40, 40);
            for (let index = 1; index < 10; index++) {
                this.mario.LoadFrame("Images/mario" + index + ".png");
            }
            this.bigMario = new Animator(0, 0, 40, 60);
            for (let index = 0; index < 8; index++) {
                this.bigMario.LoadFrame("Images/b" + index + ".png");
            }
            this.goomba = new Animator(0, 0, 40, 40);
            for (let index = 0; index < 3; index++) {
                this.goomba.LoadFrame("Images/goomba" + index + ".png");
            }
            this.coinBlock = new Animator(0, 0, 40, 40);
            for (let index = 0; index < 4; index++) {
                this.coinBlock.LoadFrame("Images/block" + index + ".png");
            }
            this.mushroom = new Animator(0, 0, 40, 40);
            this.mushroom.LoadFrame("Images/mushroom.png");
            this.coin = new Animator(0, 0, 40, 40);
            this.coin.LoadFrame("Images/coin.png");
            this.platform = new Animator(0, 0, 80, 20);
            this.platform.LoadFrame("Images/platform.png");
            this.lava = new Animator(0, 0, 40, 40);
            for (let index = 0; index < 2; index++) {
                this.lava.LoadFrame("Images/lava" + index + ".png");
            }
            this.fireball = new Animator(0, 0, 40, 40);
            for (let index = 0; index < 2; index++) {
                this.fireball.LoadFrame("Images/fire" + index + ".png");
            }
            this.firering = new Animator(0, 0, 20, 20);
            for (let index = 0; index < 4; index++) {
                this.firering.LoadFrame("Images/smallfire" + index + ".png");
            }
            this.bowser = new Animator(0, 0, 80, 80);
            for (let index = 0; index < 2; index++) {
                this.bowser.LoadFrame("Images/bowser" + index + ".png");
            }
            this.bowserfire = new Animator(0, 0, 40, 20);
            for (let index = 0; index < 2; index++) {
                this.bowserfire.LoadFrame("Images/bowserfire" + index + ".png");
            }
            this.turtle = new Animator(0, 0, 40, 40);
            for (let index = 1; index < 6; index++) {
                this.turtle.LoadFrame("Images/turtle" + index + ".png");
            }
            this.winScreen.src = "Images/winscreen.jpg";
        }
        loadLevel(level) {
            return __awaiter(this, void 0, void 0, function* () {
                this.gameState = GameState.GAME_STATE_LOADING;
                yield this.loadFile(level);
                this.resetLevel();
                this.currentLevel = level;
                this.log();
                this.gameState = GameState.GAME_STATE_PLAYING;
            });
        }
        resetLevel() {
            for (let i = 0; i < 12; i++) {
                this.grid[i] = [];
            }
            for (let i = 0; i < 12; i++) {
                for (let j = 0; j < this.tempgrid[i].length; j++) {
                    this.grid[i].push(this.tempgrid[i][j]);
                }
            }
            this.worldHeight = 12; //worldWidth = 128; //world's grid dimensions
            this.marioX = 70; //mario's top left corner
            this.marioY = 350; //mario's top left corner
            this.backColor = 287;
            this.dying = false;
            this.gameOver = false;
            this.gameOverCounter = 0;
            this.animationCounter = 0; //counts which frame mario is on
            this.direction = 0; //0==right  1==left
            this.flying = 0; //if mario is in the air 0==false 1==true
            this.jumpCounter = 0; //counts how many frames mario has been jumping for
            this.ySpeed = 0; //speed mario is rising or falling
            this.velocity = 0;
            this.jumpReset = 0; //ready for jumping 0=true 1=false
            this.specialCharacters = [];
            this.camera = 0; //camera's x coordinate
            this.coinAnimator = 0; //coin animator
            this.lavaAnimator = 0; //coin animator
            this.killCount = 0; //number of times mario has died
            this.mario.curr_frame = 0;
            this.mario.x = this.marioX;
            this.mario.y = this.marioY;
            this.marioObject.type = GameType.MARIO;
            this.marioObject.x = this.marioX;
            this.marioObject.y = this.marioY;
            this.marioObject.height = this.height;
            this.marioObject.width = this.width;
            this.marioObject.image = null;
        }
        loadFile(level) {
            return __awaiter(this, void 0, void 0, function* () {
                let filename = 'Levels/level' + level + '.txt';
                let leveltext = yield $.get(filename);
                console.log(filename + ' - LOADED');
                this.tempgrid = [];
                let level_rows = leveltext.split("\r\n");
                for (let i = 0; i < 12; i++) {
                    let line = level_rows[i];
                    let arr1 = [];
                    for (let j = 0; j < line.length; j++)
                        arr1.push(line.charAt(j));
                    this.tempgrid.push(arr1);
                    this.worldWidth = line.length;
                }
            });
        }
        log() {
            return __awaiter(this, void 0, void 0, function* () {
                //add a slight delay to allow animation loop to settle
                yield new Promise(resolve => { setTimeout(resolve, 2000); });
                //do we need to enable frame skipping?
                if (this.firstTimeFpsCheck) {
                    this.determineIfFrameSkippingEnabled();
                }
                if (document.location.href.toLocaleLowerCase().indexOf('neilb.net') > 1) {
                    let referrer = document.referrer;
                    if (referrer == null || referrer == "")
                        referrer = "NONE";
                    $.get('https://neilb.net/tetrisjsbackend/api/stuff/addmarioscore?level=' + this.currentLevel + '&lives=' + this.lives + '&fps=' + this.currentfps + '&referrer=' + referrer);
                }
            });
        }
        //fix for high refresh monitors making the game run too fast
        //only determine this when the game first loads to avoid
        //random dips and spikes from triggering frame skipping
        determineIfFrameSkippingEnabled() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isSixtyFPSmode == true) {
                    if (this.currentfps > 70) {
                        let fpsController = window["myApp"].fpsController;
                        fpsController.UpdateTargetFPS(60);
                        fpsController.enabled = true;
                        console.log('frame skipping enabled');
                    }
                }
                //TODO move this functionality into the FPS Controller class
                this.firstTimeFpsCheck = false;
            });
        }
        gameMain() {
            //BACKGROUND ANIMATORS
            this.animate_bg_objects();
            //MOVE MARIO
            if (!this.gameOver && !this.dying) {
                this.MARIO_RUN_PHYSICS(); //process mario's jumping and velocity
                this.MARIO_MOVE_X(); //adjust mario's horizontal motion
                this.MARIO_MOVE_Y(); //adjust mario's vertical motion
            }
            //run scripts for all objects
            for (let i = 0; i < this.specialCharacters.length; i++) {
                this.process_object(this.specialCharacters[i], i);
            }
            this.DRAW_WORLD(); //draws the background
            //draws objects
            for (let i = 0; i < this.specialCharacters.length; i++) {
                if (this.specialCharacters[i].alive)
                    this.draw_object(this.specialCharacters[i]);
            }
            //get lives from coins
            if (this.coins > 99) {
                this.coins = 0;
                this.lives++;
            }
            //process dying sequence
            if (this.dying) {
                if ((this.dyingCounter % 2) == 1) {
                    this.backColor--;
                }
                else
                    this.backColor++;
                this.mario.curr_frame = 8;
                this.mario.x = this.dyingX;
                this.mario.y = this.dyingY;
                this.Draw_Image(this.mario, this.marioObject);
                this.dyingCounter++;
                if (this.dyingY > 500)
                    this.die();
            }
            if (this.dyingCounter > 30) {
                this.dyingY += 15;
            }
            //draw_mario
            if (!this.gameOver) {
                if (this.height == 40) {
                    this.Draw_Image(this.mario, this.marioObject);
                }
                else {
                    this.bigMario.curr_frame = this.mario.curr_frame;
                    this.bigMario.x = this.mario.x;
                    this.bigMario.y = this.mario.y;
                    this.Draw_Image(this.bigMario, this.marioObject);
                }
            }
            //remove objects that are beyond the camera
            this.updateList();
            //MARIO FELL OFF THE WORLD
            if (this.marioY > (this.worldHeight * 2) * 40) {
                this.killMario();
            }
            //GOTO NEXT LEVEL
            if (this.marioX >= (this.worldWidth * 40)) {
                if (this.currentLevel < this.numLevels) {
                    this.loadLevel(this.currentLevel + 1);
                }
                else {
                    this.mario.x = 50;
                    this.mario.y = 400;
                    this.animationCounter = 0;
                    this.mario.curr_frame = 0;
                    this.currentLevel++;
                    this.log();
                    this.win();
                }
            }
        }
        animate_bg_objects() {
            this.coinAnimator++;
            let coin_anim_change = 46;
            if (this.isSixtyFPSmode)
                coin_anim_change = 91;
            if (this.coinAnimator == coin_anim_change) {
                this.coinAnimator = 0;
            }
            this.lavaAnimator++;
            if (this.lavaAnimator == 61) {
                this.lavaAnimator = 0;
            }
        }
        DRAW_WORLD() {
            let offset = Math.floor((this.camera / 40));
            let gridNum = 0;
            for (let i = 0; i < 12; i++) {
                for (let j = offset; j < offset + 17; j++) {
                    if (!this.grid[i][j])
                        continue;
                    gridNum = this.grid[i][j].charCodeAt(0) - '0'.charCodeAt(0);
                    if (gridNum < 49) {
                        this.tiles.curr_frame = gridNum;
                        this.tiles.x = j * 40 - Math.floor(this.camera);
                        this.tiles.y = i * 40;
                        if (gridNum != 0) {
                            this.Draw_World_Image(this.tiles, i, j);
                        }
                    }
                    else {
                        if (gridNum == 49) {
                            this.create_object(GameType.GOOMBA, j * 40, i * 40, 40, 40, false, false, this.goombaVelocity, 0, 0);
                        }
                        if (gridNum == 52) {
                            this.create_object(GameType.COIN, j * 40, i * 40, 40, 40, false, true, 1, 0, 0);
                        }
                        if (gridNum == 53) {
                            this.create_object(GameType.PLATFORM, j * 40, i * 40, 20, 80, false, false, 0, 0, 0);
                        }
                        if (gridNum == 54) {
                            this.create_object(GameType.PLATFORM, j * 40, i * 40, 20, 80, false, true, this.platformVelocity, 0, 1);
                        }
                        if (gridNum == 55) {
                            this.create_object(GameType.PLATFORM, j * 40, i * 40, 20, 80, false, true, this.platformVelocity, 0, 2);
                        }
                        if (gridNum == 56) {
                            this.create_object(GameType.LAVA, j * 40, i * 40, 40, 40, true, true, 0, 0, 0);
                        }
                        if (gridNum == 57) {
                            this.create_object(GameType.LAVA, j * 40, i * 40, 40, 40, true, true, 0, 0, 0);
                            this.create_object(GameType.FIREBALL, j * 40, (i + 1) * 40, 40, 40, false, true, -30, 0, 0);
                        }
                        if (gridNum == 59) {
                            if (this.isSixtyFPSmode)
                                this.create_object(GameType.BOWSER, j * 40, i * 40, 80, 80, false, true, -2.5, -.75, -30);
                            else
                                this.create_object(GameType.BOWSER, j * 40, i * 40, 80, 80, false, true, -5, -1.5, -30);
                        }
                        if (gridNum == 60) {
                            this.create_object(GameType.TURTLE, j * 40, i * 40, 40, 40, false, false, this.goombaVelocity, 0, 0);
                        }
                        this.grid[i][j] = '0';
                        if (gridNum == 58) {
                            this.grid[i][j] = '7';
                            this.Draw_World_Image(this.tiles, i, j);
                            this.create_object(GameType.FIRERING, (j * 40) + 10, (i * 40) + 10, 20, 20, false, true, (j * 40) + 10, (i * 40) + 10, 0);
                            this.create_object(GameType.FIRERING, (j * 40) + 10, (i * 40) + 10 - 20, 20, 20, false, true, (j * 40) + 10, (i * 40) + 10, 1);
                            this.create_object(GameType.FIRERING, (j * 40) + 10, (i * 40) + 10 - 40, 20, 20, false, true, (j * 40) + 10, (i * 40) + 10, 2);
                            this.create_object(GameType.FIRERING, (j * 40) + 10, (i * 40) + 10 - 60, 20, 20, false, true, (j * 40) + 10, (i * 40) + 10, 3);
                            this.create_object(GameType.FIRERING, (j * 40) + 10, (i * 40) + 10 - 80, 20, 20, false, true, (j * 40) + 10, (i * 40) + 10, 4);
                        }
                        if (gridNum == 50) {
                            this.create_object(GameType.COINBLOCK, j * 40, i * 40, 40, 40, false, false, 0, 0, 0);
                            this.grid[i][j] = '0';
                        }
                        if (gridNum == 51) {
                            this.create_object(GameType.COINBLOCK, j * 40, i * 40, 40, 40, false, false, 1, 0, 0);
                            this.grid[i][j] = '0';
                        }
                        this.tiles.curr_frame = gridNum;
                        this.tiles.x = j * 40 - Math.floor(this.camera);
                        this.tiles.y = i * 40;
                    }
                }
            }
        }
        Draw_World_Image(tiles, i, j) {
            this.ctx.drawImage(tiles.frames[tiles.curr_frame], tiles.x, tiles.y);
        }
        Draw_Image(anim, obj) {
            this.ctx.drawImage(anim.frames[anim.curr_frame], anim.x, anim.y);
        }
        MARIO_MOVE_Y() {
            this.ySpeed += this.gravity;
            if (this.ySpeed > this.jumpAcceleration)
                this.ySpeed = this.jumpAcceleration;
            this.marioY += this.ySpeed;
            this.flying = 1; //mario is always in the air, unless a collision is detected
            let xcood; //grid coordinates of mario
            let ycood;
            xcood = Math.floor((this.marioX + this.width - 1 - ((this.marioX + this.width - 1) % 40)) / 40);
            ycood = Math.floor((this.marioY - ((this.marioY) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth &&
                (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                if ((xcood - 1) >= 0 && (this.grid[ycood][xcood - 1].charCodeAt(0) - '0'.charCodeAt(0)) == 0 && (this.marioX % 40) < 15) {
                    this.marioX = this.marioX - (this.marioX % 40);
                }
                else {
                    this.marioY = this.marioY - (this.marioY % 40) + 40;
                    this.ySpeed = 0;
                    this.jumpReset = 1;
                    if (this.height == this.bigHeight && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) == 1) {
                        this.grid[ycood][xcood] = '0';
                    }
                }
            }
            xcood = Math.floor((this.marioX - ((this.marioX) % 40)) / 40);
            ycood = Math.floor((this.marioY - ((this.marioY) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0
                && xcood < this.worldWidth && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                if ((xcood + 1) < this.worldWidth && (this.grid[ycood][xcood + 1].charCodeAt(0) - '0'.charCodeAt(0)) == 0
                    && (this.marioX % 40) > 25) {
                    this.marioX = this.marioX - (this.marioX % 40) + 40;
                }
                else {
                    this.marioY = this.marioY - (this.marioY % 40) + 40;
                    this.ySpeed = 0;
                    this.jumpReset = 1;
                    if (this.height == this.bigHeight && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) == 1) {
                        this.grid[ycood][xcood] = '0';
                    }
                }
            }
            xcood = Math.floor((this.marioX + this.width - 1 - ((this.marioX + this.width - 1) % 40)) / 40);
            ycood = Math.floor((this.marioY + this.height - 1 - ((this.marioY + this.height - 1) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0
                && xcood < this.worldWidth && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                this.marioY = (ycood * 40) - this.height;
                this.flying = 0;
                this.jumpCounter = 0;
                this.ySpeed = 0;
            }
            xcood = Math.floor((this.marioX - ((this.marioX) % 40)) / 40);
            ycood = Math.floor((this.marioY + this.height - 1 - ((this.marioY + this.height - 1) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth &&
                (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                this.marioY = (ycood * 40) - this.height;
                this.flying = 0;
                this.jumpCounter = 0;
                this.ySpeed = 0;
            }
            this.updateMario();
            let collisionTest;
            for (let i = 0; i < this.specialCharacters.length; i++) {
                collisionTest = 0;
                if (this.specialCharacters[i].alive && !this.specialCharacters[i].marioTransparent)
                    collisionTest = 4 + this.collision_test(this.marioObject, this.specialCharacters[i]);
                if (collisionTest > 4)
                    this.process_collision(this.marioObject, this.specialCharacters[i], collisionTest, i);
            }
            if (this.flying == 1) {
                if (this.direction == 0) {
                    this.mario.curr_frame = 4;
                }
                if (this.direction == 1) {
                    this.mario.curr_frame = 5;
                }
            }
            this.mario.y = Math.floor(this.marioY);
        }
        MARIO_RUN_PHYSICS() {
            let tempVelocity = this.maxVelocity; //tempVelocity is the current maximum velocity
            if (this.runkey) //run button
             {
                tempVelocity = this.maxVelocity * 2; //mario can run at twice maxVelocity
                if (this.velocity > this.maxVelocity || this.velocity < -this.maxVelocity) //once mario reaches a certain speed
                    this.jumpAcceleration = this.jumpSpeed + this.jumpSpeedRunning; //he can jump a little higher
                else
                    this.jumpAcceleration = this.jumpSpeed;
            }
            else
                this.jumpAcceleration = this.jumpSpeed; //if user lets go of control, reset jumpAcceleration
            if (this.leftkey || this.rightkey) //move buttons
             {
                if (this.rightkey) {
                    if (this.velocity < tempVelocity) //if the user is slower that max, keep accelerating
                        this.velocity += this.acceleration;
                    else
                        this.velocity -= this.acceleration; //otherwise slow him down to max
                    this.direction = 0; //sets the direction
                }
                if (this.leftkey) {
                    if (this.velocity > -tempVelocity)
                        this.velocity -= this.acceleration;
                    else
                        this.velocity += this.acceleration;
                    this.direction = 1;
                }
            }
            else {
                if (this.direction == 0 && this.velocity > 0) //slow the user down
                 {
                    this.velocity -= this.acceleration;
                    if (this.velocity < 0)
                        this.velocity = 0;
                }
                if (this.direction == 1 && this.velocity < 0) {
                    this.velocity += this.acceleration;
                    if (this.velocity > 0)
                        this.velocity = 0;
                }
            }
            if (this.jumpkey) //jump button
             {
                if (this.jumpCounter < this.jumpLimit && this.jumpReset == 0) //allow user to keep jumping as long as jumpLimit
                 { //hasn't been reached
                    this.ySpeed = -this.jumpAcceleration; //adjust ySpeed
                    this.jumpCounter++;
                }
                else {
                    this.jumpReset = 1; //if jumpLimit has been reached, jumpReset needs to be reset before jumping again
                }
            }
            else {
                if (this.flying == 1) //if user is flying, don't let user jump
                    this.jumpCounter = this.jumpLimit;
                this.jumpReset = 0;
            }
        }
        MARIO_MOVE_X() {
            this.marioX += this.velocity; //move mario
            //Animation Stuff
            if (this.flying == 0) {
                if (this.direction == 0) {
                    if (this.velocity > 0 && this.animationCounter <= 0) {
                        if (this.isSixtyFPSmode) {
                            this.animationCounter = 18 - Math.floor(this.velocity * 2);
                        }
                        else {
                            this.animationCounter = 12 - Math.floor(this.velocity);
                        }
                        if (this.mario.curr_frame == 0) {
                            this.mario.curr_frame = 1;
                        }
                        else {
                            this.mario.curr_frame = 0;
                        }
                    }
                    if (this.velocity == 0) {
                        this.mario.curr_frame = 0;
                    }
                    if (this.velocity < 0) {
                        this.velocity += this.slideFriction;
                        this.mario.curr_frame = 6;
                    }
                }
                if (this.direction == 1) {
                    if (this.velocity < 0 && this.animationCounter <= 0) {
                        if (this.isSixtyFPSmode) {
                            this.animationCounter = 18 - Math.floor(this.velocity * 2);
                        }
                        else {
                            this.animationCounter = 12 - Math.floor(this.velocity);
                        }
                        if (this.mario.curr_frame == 2) {
                            this.mario.curr_frame = 3;
                        }
                        else {
                            this.mario.curr_frame = 2;
                        }
                    }
                    if (this.velocity == 0) {
                        this.mario.curr_frame = 2;
                    }
                    if (this.velocity > 0) {
                        this.velocity -= this.slideFriction;
                        this.mario.curr_frame = 7;
                    }
                }
                this.animationCounter--;
            }
            let xcood; //grid coordinates of mario
            let ycood;
            xcood = Math.floor((this.marioX + this.width - 1 - ((this.marioX + this.width - 1) % 40)) / 40);
            ycood = Math.floor((this.marioY - ((this.marioY) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 &&
                xcood < this.worldWidth && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                this.marioX = (xcood * 40) - this.width;
                this.velocity = 0;
            }
            xcood = Math.floor((this.marioX - ((this.marioX) % 40)) / 40);
            ycood = Math.floor((this.marioY - ((this.marioY) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth &&
                (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                this.marioX = this.marioX - (this.marioX % 40) + 40;
                this.velocity = 0;
            }
            xcood = Math.floor((this.marioX + this.width - 1 - ((this.marioX + this.width - 1) % 40)) / 40);
            ycood = Math.floor((this.marioY + this.height - 1 - ((this.marioY + this.height - 1) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth &&
                (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                this.marioX = (xcood * 40) - this.width;
                this.velocity = 0;
            }
            xcood = Math.floor((this.marioX - ((this.marioX) % 40)) / 40);
            ycood = Math.floor((this.marioY + this.height - 1 - ((this.marioY + this.height - 1) % 40)) / 40);
            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth &&
                (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0
                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                this.marioX = this.marioX - (this.marioX % 40) + 40;
                this.velocity = 0;
            }
            this.updateMario();
            let collisionTest;
            for (let i = 0; i < this.specialCharacters.length; i++) {
                collisionTest = 0;
                if (this.specialCharacters[i].alive && !this.specialCharacters[i].marioTransparent)
                    collisionTest = this.collision_test(this.marioObject, this.specialCharacters[i]);
                if (collisionTest > 0)
                    this.process_collision(this.marioObject, this.specialCharacters[i], collisionTest, i);
            }
            let camera_front = 240;
            if (this.isMobile)
                camera_front = 100;
            if (this.marioX > this.camera + camera_front) {
                this.camera = this.marioX - camera_front;
                if (Math.floor(this.camera / 40) >= (this.worldWidth - 16)) {
                    this.camera = (this.worldWidth - 16) * 40;
                }
            }
            if (this.marioX < this.camera) {
                this.marioX = this.camera;
                this.velocity = 0;
            }
            this.mario.x = Math.floor(this.marioX) - Math.floor(this.camera);
        }
        updateMario() {
            this.marioObject.x = this.marioX;
            this.marioObject.y = this.marioY;
            this.marioObject.height = this.height;
            this.marioObject.width = this.width;
        }
        collision_test(obj, obj2) {
            let x, y;
            x = Math.floor(obj.x + obj.width - 1);
            y = Math.floor(obj.y);
            if (Math.floor(obj2.x) <= x && x <= Math.floor(obj2.x + obj2.width - 1) &&
                Math.floor(obj2.y) <= y && y <= Math.floor(obj2.y + obj2.height - 1)) {
                return (1);
            }
            x = Math.floor(obj.x);
            y = Math.floor(obj.y);
            if (Math.floor(obj2.x) <= x && x <= Math.floor(obj2.x + obj2.width - 1) &&
                Math.floor(obj2.y) <= y && y <= Math.floor(obj2.y + obj2.height - 1)) {
                return (2);
            }
            x = Math.floor(obj.x + obj.width - 1);
            y = Math.floor(obj.y + obj.height - 1);
            if (Math.floor(obj2.x) <= x && x <= Math.floor(obj2.x + obj2.width - 1) &&
                Math.floor(obj2.y) <= y && y <= Math.floor(obj2.y + obj2.height - 1)) {
                return (3);
            }
            x = Math.floor(obj.x);
            y = Math.floor(obj.y + obj.height - 1);
            if (Math.floor(obj2.x) <= x && x <= Math.floor(obj2.x + obj2.width - 1) &&
                Math.floor(obj2.y) <= y && y <= Math.floor(obj2.y + obj2.height - 1)) {
                return (4);
            }
            x = Math.floor(obj2.x + obj2.width - 1);
            y = Math.floor(obj2.y);
            if (Math.floor(obj.x) <= x && x <= Math.floor(obj.x + obj.width - 1) &&
                Math.floor(obj.y) <= y && y <= Math.floor(obj.y + obj.height - 1)) {
                return (2);
            }
            x = Math.floor(obj2.x);
            y = Math.floor(obj2.y);
            if (Math.floor(obj.x) <= x && x <= Math.floor(obj.x + obj.width - 1) &&
                Math.floor(obj.y) <= y && y <= Math.floor(obj.y + obj.height - 1)) {
                return (1);
            }
            x = Math.floor(obj2.x + obj2.width - 1);
            y = Math.floor(obj2.y + obj2.height - 1);
            if (Math.floor(obj.x) <= x && x <= Math.floor(obj.x + obj.width - 1) &&
                Math.floor(obj.y) <= y && y <= Math.floor(obj.y + obj.height - 1)) {
                return (4);
            }
            x = Math.floor(obj2.x);
            y = Math.floor(obj2.y + obj2.height - 1);
            if (Math.floor(obj.x) <= x && x <= Math.floor(obj.x + obj.width - 1) &&
                Math.floor(obj.y) <= y && y <= Math.floor(obj.y + obj.height - 1)) {
                return (3);
            }
            return (0);
        }
        draw_object(obj) {
            switch (obj.type) {
                case GameType.GOOMBA:
                    {
                        this.goomba.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.goomba.y = Math.floor(obj.y);
                        this.goomba.curr_frame = obj.currFrame;
                        this.Draw_Image(this.goomba, obj);
                        break;
                    }
                case GameType.COINBLOCK:
                    {
                        this.coinBlock.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.coinBlock.y = Math.floor(obj.y);
                        this.coinBlock.curr_frame = obj.currFrame;
                        this.Draw_Image(this.coinBlock, obj);
                        break;
                    }
                case GameType.MUSHROOM:
                    {
                        this.mushroom.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.mushroom.y = Math.floor(obj.y);
                        this.mushroom.curr_frame = obj.currFrame;
                        this.Draw_Image(this.mushroom, obj);
                        break;
                    }
                case GameType.COIN:
                    {
                        this.coin.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.coin.y = Math.floor(obj.y);
                        this.coin.curr_frame = obj.currFrame;
                        this.Draw_Image(this.coin, obj);
                        break;
                    }
                case GameType.PLATFORM:
                    {
                        this.platform.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.platform.y = Math.floor(obj.y);
                        this.platform.curr_frame = obj.currFrame;
                        this.Draw_Image(this.platform, obj);
                        break;
                    }
                case GameType.LAVA:
                    {
                        this.lava.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.lava.y = Math.floor(obj.y);
                        this.lava.curr_frame = obj.currFrame;
                        this.Draw_Image(this.lava, obj);
                        break;
                    }
                case GameType.FIREBALL:
                    {
                        this.fireball.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.fireball.y = Math.floor(obj.y);
                        this.fireball.curr_frame = obj.currFrame;
                        this.Draw_Image(this.fireball, obj);
                        break;
                    }
                case GameType.FIRERING:
                    {
                        this.firering.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.firering.y = Math.floor(obj.y);
                        this.firering.curr_frame = obj.currFrame;
                        this.Draw_Image(this.firering, obj);
                        break;
                    }
                case GameType.BOWSER:
                    {
                        this.bowser.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.bowser.y = Math.floor(obj.y);
                        this.bowser.curr_frame = obj.currFrame;
                        this.Draw_Image(this.bowser, obj);
                        break;
                    }
                case GameType.BOWSERFIRE:
                    {
                        this.bowserfire.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.bowserfire.y = Math.floor(obj.y);
                        this.bowserfire.curr_frame = obj.currFrame;
                        this.Draw_Image(this.bowserfire, obj);
                        break;
                    }
                case GameType.TURTLE:
                    {
                        this.turtle.x = Math.floor(obj.x) - Math.floor(this.camera);
                        this.turtle.y = Math.floor(obj.y);
                        this.turtle.curr_frame = obj.currFrame;
                        this.Draw_Image(this.turtle, obj);
                        break;
                    }
            }
        }
        create_object(type, x, y, height, width, marioTransparent, objectTransparent, velocity, ySpeed, state) {
            let special = new SpecialObject();
            special.type = type;
            special.x = x;
            special.y = y;
            special.height = height;
            special.width = width;
            special.marioTransparent = marioTransparent;
            special.objectTransparent = objectTransparent;
            special.alive = true;
            special.animator = 0;
            special.currFrame = 0;
            special.ySpeed = ySpeed;
            special.velocity = velocity;
            special.state = state;
            special.image = null;
            this.specialCharacters.push(special);
        }
        updateList() {
            for (let i = 0; i < this.specialCharacters.length; i++) {
                if (this.specialCharacters[i].x < this.camera - (640)) {
                    this.specialCharacters[i].alive = false;
                }
                if (!this.specialCharacters[i].alive) {
                    this.specialCharacters.splice(i, 1);
                }
            }
        }
        die() {
            if (!this.gameOver) {
                if (this.lives > 0) {
                    this.lives--;
                    this.resetLevel();
                    this.height = 40;
                    this.width = 40;
                }
                else {
                    this.gameOver = true;
                    this.marioY = -500;
                    this.mario.y = -500;
                    //GAME OVER
                }
            }
        }
        killMario() {
            this.dying = true;
            this.dyingCounter = 0;
            this.dyingX = Math.floor(this.mario.x);
            this.dyingY = Math.floor(this.mario.y);
            this.marioY = -500;
            this.mario.y = -500;
        }
        loading_screen() {
            this.ctx.font = "bold 18px Comic Sans MS";
            this.ctx.fillStyle = "#FF0000";
            this.ctx.fillText("Loading Level...", 260, 170);
        }
        win() {
            this.gameState = GameState.GAME_STATE_WON;
            this.ctx.drawImage(this.winScreen, 0, 0);
            this.ctx.font = "bold 18px Comic Sans MS";
            this.ctx.fillStyle = "#FF0000";
            this.ctx.fillText("Thanks for Playing!", 240, 170);
        }
        process_collision(obj, obj2, direction, objnum) {
            if (obj.type == GameType.MARIO) {
                if (obj2.type == GameType.PLATFORM) {
                    if (direction == 1 || direction == 3) {
                        this.marioX = obj2.x - this.width;
                        this.velocity = 0;
                    }
                    if (direction == 2 || direction == 4) {
                        this.marioX = obj2.x + obj2.width;
                        this.velocity = 0;
                    }
                    if (direction == 5 || direction == 6) {
                        this.marioY = obj2.y + obj2.height;
                        this.ySpeed = 0;
                        this.jumpReset = 1;
                    }
                    if (obj2.state == 0) {
                        if (direction == 7 || direction == 8) {
                            this.flying = 0;
                            this.jumpCounter = 0;
                            obj2.y = obj.y + obj.height;
                        }
                    }
                    if (obj2.state == 1) {
                        if (direction == 7 || direction == 8) {
                            this.flying = 0;
                            this.jumpCounter = 0;
                            this.ySpeed = 0;
                            this.marioY = obj2.y - this.height;
                            this.marioX += obj2.velocity;
                        }
                    }
                    if (obj2.state == 2) {
                        if (direction == 7 || direction == 8) {
                            this.flying = 0;
                            this.jumpCounter = 0;
                            this.marioY = obj2.y - this.height + obj2.velocity;
                        }
                    }
                }
                if (obj2.type == GameType.COIN) {
                    this.coins++;
                    obj2.alive = false;
                }
                if (obj2.type == GameType.MUSHROOM) {
                    this.height = this.bigHeight;
                    obj2.alive = false;
                }
                if (obj2.type == GameType.FIRERING) {
                    if (this.height == this.bigHeight) {
                        this.height = 40;
                        objnum = objnum - obj2.state;
                        this.specialCharacters[objnum].alive = false;
                        this.specialCharacters[objnum + 1].alive = false;
                        this.specialCharacters[objnum + 2].alive = false;
                        this.specialCharacters[objnum + 3].alive = false;
                        this.specialCharacters[objnum + 4].alive = false;
                    }
                    else
                        this.killMario();
                }
                if (obj2.type == GameType.FIREBALL || obj2.type == GameType.BOWSER || obj2.type == GameType.BOWSERFIRE) {
                    if (this.height == this.bigHeight) {
                        this.height = 40;
                        obj2.alive = false;
                    }
                    else
                        this.killMario();
                }
                if (obj2.type == GameType.GOOMBA) {
                    if (direction == 7 || direction == 8) {
                        this.marioY = obj2.y - this.mario.height;
                        this.ySpeed = -this.jumpAcceleration;
                        if (this.isSixtyFPSmode)
                            this.ySpeed *= 1.4;
                        obj2.currFrame = 2;
                    }
                    else {
                        if (this.height == this.bigHeight) {
                            this.height = 40;
                            obj2.alive = false;
                        }
                        else
                            this.killMario();
                    }
                }
                if (obj2.type == GameType.TURTLE) {
                    if (direction == 7 || direction == 8) {
                        if (obj2.state == 0) {
                            this.marioY = obj2.y - this.height;
                            this.ySpeed = -this.jumpAcceleration;
                            if (this.isSixtyFPSmode)
                                this.ySpeed *= 1.4;
                            obj2.state = 1;
                            obj2.velocity = 0;
                        }
                        else {
                            if (obj2.state == 2) {
                                this.marioY = obj2.y - this.height;
                                this.ySpeed = -this.jumpAcceleration;
                                if (this.isSixtyFPSmode)
                                    this.ySpeed *= 1.4;
                                obj2.state = 1;
                                obj2.velocity = 0;
                            }
                            else {
                                if (direction == 7) {
                                    obj2.state = 2;
                                    obj2.x = this.marioX + this.width;
                                    obj2.velocity = this.maxVelocity * 2;
                                }
                                else {
                                    obj2.state = 2;
                                    obj2.x = this.marioX - obj2.width;
                                    obj2.velocity = -this.maxVelocity * 2;
                                }
                            }
                        }
                    }
                    else {
                        if (obj2.state == 0 || obj2.state == 2) {
                            if (this.height == this.bigHeight) {
                                this.height = 40;
                                obj2.alive = false;
                            }
                            else
                                this.killMario();
                        }
                        if (obj2.state == 1) {
                            if (direction == 1 || direction == 3 || direction == 5 || direction == 7) {
                                obj2.state = 2;
                                obj2.x = this.marioX + this.width;
                                obj2.velocity = this.maxVelocity * 2;
                            }
                            else {
                                obj2.state = 2;
                                obj2.x = this.marioX - obj2.width;
                                obj2.velocity = -this.maxVelocity * 2;
                            }
                        }
                    }
                }
                if (obj2.type == GameType.COINBLOCK) {
                    if (direction == 1 || direction == 3) {
                        this.marioX = obj2.x - this.width;
                        this.velocity = 0;
                    }
                    if (direction == 2 || direction == 4) {
                        this.marioX = obj2.x + obj2.width;
                        this.velocity = 0;
                    }
                    if (direction == 5 || direction == 6) {
                        this.marioY = obj2.y + obj2.height;
                        this.ySpeed = 0;
                        this.jumpReset = 1;
                        if (obj2.state == 0) {
                            obj2.currFrame = 3;
                            obj2.state = 1;
                            if (obj2.velocity == 0) {
                                this.coins++;
                            }
                            else {
                                this.create_object(GameType.MUSHROOM, obj2.x, obj2.y - 40, 40, 40, false, false, this.mushroomVelocity, 0, 0);
                            }
                            this.grid[Math.floor(obj2.y / 40)][Math.floor(obj2.x / 40)] = '8';
                        }
                    }
                    if (direction == 7 || direction == 8) {
                        this.marioY = obj2.y - this.height;
                        this.flying = 0;
                        this.jumpCounter = 0;
                        this.ySpeed = 0;
                    }
                }
            }
            if (obj.type == GameType.GOOMBA) {
                if (obj2.type == GameType.GOOMBA) {
                    if (direction == 1 || direction == 3) {
                        obj.x = obj2.x - obj.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 2 || direction == 4) {
                        obj.x = obj2.x + obj2.width;
                        obj.velocity *= -1;
                    }
                }
                if (obj2.type == GameType.TURTLE) {
                    if (obj2.state == 0 || obj2.state == 1) {
                        if (direction == 1 || direction == 3) {
                            obj.x = obj2.x - obj.width;
                            obj.velocity *= -1;
                        }
                        if (direction == 2 || direction == 4) {
                            obj.x = obj2.x + obj2.width;
                            obj.velocity *= -1;
                        }
                    }
                    else {
                        obj.alive = false;
                    }
                }
                if (obj2.type == GameType.COINBLOCK || obj2.type == GameType.PLATFORM) {
                    if (direction == 1 || direction == 3) {
                        obj.x = obj2.x - obj.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 2 || direction == 4) {
                        obj.x = obj2.x + obj2.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 7 || direction == 8) {
                        obj.y = obj2.y - obj.height;
                        obj.ySpeed = 0;
                    }
                }
            }
            if (obj.type == GameType.MUSHROOM) {
                if (obj2.type == GameType.COINBLOCK || obj2.type == GameType.PLATFORM) {
                    if (direction == 1 || direction == 3) {
                        obj.x = obj2.x - obj.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 2 || direction == 4) {
                        obj.x = obj2.x + obj2.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 7 || direction == 8) {
                        obj.y = obj2.y - obj.height;
                        obj.ySpeed = 0;
                    }
                }
            }
            if (obj.type == GameType.TURTLE) {
                if (obj2.type == GameType.GOOMBA) {
                    if (obj.state == 0 || obj.state == 1) {
                        if (direction == 1 || direction == 3) {
                            obj.x = obj2.x - obj.width;
                            obj.velocity *= -1;
                        }
                        if (direction == 2 || direction == 4) {
                            obj.x = obj2.x + obj2.width;
                            obj.velocity *= -1;
                        }
                    }
                    else {
                        obj2.alive = false;
                    }
                }
                if (obj2.type == GameType.TURTLE) {
                    if (obj2.state == 2 || obj.state == 2) {
                        if (obj2.state == 2 && obj.state != 2) {
                            obj.alive = false;
                        }
                        if (obj2.state != 2 && obj.state == 2) {
                            obj2.alive = false;
                        }
                        if (obj2.state == 2 && obj.state == 2) {
                            obj.alive = false;
                            obj2.alive = false;
                        }
                    }
                    else {
                        if (direction == 1 || direction == 3) {
                            obj.x = obj2.x - obj.width;
                            obj.velocity *= -1;
                        }
                        if (direction == 2 || direction == 4) {
                            obj.x = obj2.x + obj2.width;
                            obj.velocity *= -1;
                        }
                    }
                }
                if (obj2.type == GameType.COINBLOCK || obj2.type == GameType.PLATFORM) {
                    if (direction == 1 || direction == 3) {
                        obj.x = obj2.x - obj.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 2 || direction == 4) {
                        obj.x = obj2.x + obj2.width;
                        obj.velocity *= -1;
                    }
                    if (direction == 7 || direction == 8) {
                        obj.y = obj2.y - obj.height;
                        obj.ySpeed = 0;
                    }
                }
            }
        }
        process_object(obj, objNum) {
            switch (obj.type) {
                case GameType.COINBLOCK:
                    {
                        let coin_anim_change = 15;
                        if (this.isSixtyFPSmode)
                            coin_anim_change = 30;
                        if (obj.state == 0) {
                            if (this.coinAnimator == coin_anim_change) {
                                obj.currFrame = 1;
                            }
                            if (this.coinAnimator == coin_anim_change * 2) {
                                obj.currFrame = 2;
                            }
                            if (this.coinAnimator == coin_anim_change * 3) {
                                obj.currFrame = 0;
                            }
                        }
                        break;
                    }
                case GameType.GOOMBA:
                    {
                        if (obj.currFrame == 2 && obj.state == 0) {
                            obj.animator = 0;
                            obj.state = 1;
                            obj.marioTransparent = true;
                        }
                        if (obj.state == 0) {
                            obj.x += obj.velocity; //move goomba
                            obj.animator++;
                            let goomba_anim_switch = 5;
                            if (this.isSixtyFPSmode)
                                goomba_anim_switch = 10;
                            if (obj.animator == goomba_anim_switch) {
                                if (obj.currFrame == 0) {
                                    obj.currFrame = 1;
                                }
                                else {
                                    obj.currFrame = 0;
                                }
                                obj.animator = 0;
                            }
                            //grid coordinates of mario
                            let xcood, xcood2, xcood3, xcood4;
                            let ycood, ycood2, ycood3, ycood4;
                            xcood = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                            ycood = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                            xcood2 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                            ycood2 = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                            xcood3 = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                            ycood3 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                            xcood4 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                            ycood4 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth
                                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.x = (xcood * 40) - obj.width;
                                obj.velocity *= -1;
                            }
                            else if (ycood2 >= 0 && ycood2 < this.worldHeight && xcood2 >= 0 && xcood2 < this.worldWidth
                                && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.x = obj.x - (obj.x % 40) + 40;
                                obj.velocity *= -1;
                            }
                            else if (ycood3 >= 0 && ycood3 < this.worldHeight && xcood3 >= 0 && xcood3 < this.worldWidth
                                && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.x = (xcood3 * 40) - obj.width;
                                obj.velocity *= -1;
                            }
                            else if (ycood4 >= 0 && ycood4 < this.worldHeight && xcood4 >= 0 && xcood4 < this.worldWidth
                                && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.x = obj.x - (obj.x % 40) + 40;
                                obj.velocity *= -1;
                            }
                            let collisionTest;
                            for (let i = 0; i < this.specialCharacters.length; i++) {
                                collisionTest = 0;
                                if (this.specialCharacters[i].alive && !this.specialCharacters[i].objectTransparent
                                    && i != objNum)
                                    collisionTest = this.collision_test(obj, this.specialCharacters[i]);
                                if (collisionTest > 0)
                                    this.process_collision(obj, this.specialCharacters[i], collisionTest, i);
                            }
                            obj.ySpeed += this.gravity;
                            obj.y += obj.ySpeed;
                            xcood = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                            ycood = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                            xcood2 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                            ycood2 = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                            xcood3 = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                            ycood3 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                            xcood4 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                            ycood4 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                            if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth
                                && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.y = obj.y - (obj.y % 40) + 40;
                                obj.ySpeed = 0;
                            }
                            else if (ycood2 >= 0 && ycood2 < this.worldHeight && xcood2 >= 0 && xcood2 < this.worldWidth
                                && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.y = obj.y - (obj.y % 40) + 40;
                                obj.ySpeed = 0;
                            }
                            else if (ycood3 >= 0 && ycood3 < this.worldHeight && xcood3 >= 0 && xcood3 < this.worldWidth
                                && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.y = (ycood3 * 40) - obj.height;
                                obj.ySpeed = 0;
                            }
                            else if (ycood4 >= 0 && ycood4 < this.worldHeight && xcood4 >= 0 && xcood4 < this.worldWidth
                                && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                                obj.y = (ycood4 * 40) - obj.height;
                                obj.ySpeed = 0;
                            }
                            for (let i = 0; i < this.specialCharacters.length; i++) {
                                collisionTest = 0;
                                if (this.specialCharacters[i].alive && !this.specialCharacters[i].objectTransparent && i != objNum)
                                    collisionTest = 4 + this.collision_test(obj, this.specialCharacters[i]);
                                if (collisionTest > 4)
                                    this.process_collision(obj, this.specialCharacters[i], collisionTest, i);
                            }
                            if (obj.y > this.worldHeight * 40)
                                obj.alive = false;
                        }
                        else {
                            obj.animator++;
                            if (obj.animator > 30)
                                obj.alive = false;
                        }
                        break;
                    }
                case GameType.TURTLE:
                    {
                        obj.x += obj.velocity; //move turtle
                        obj.animator++;
                        let turtle_anim_switch = 5;
                        if (this.isSixtyFPSmode)
                            turtle_anim_switch = 10;
                        if (obj.animator == turtle_anim_switch) {
                            if (obj.velocity > 0) {
                                if (obj.currFrame == 0) {
                                    obj.currFrame = 1;
                                }
                                else {
                                    obj.currFrame = 0;
                                }
                            }
                            else {
                                if (obj.currFrame == 2) {
                                    obj.currFrame = 3;
                                }
                                else {
                                    obj.currFrame = 2;
                                }
                            }
                            obj.animator = 0;
                        }
                        if (obj.state == 1 || obj.state == 2) {
                            obj.currFrame = 4;
                        }
                        let xcood, xcood2, xcood3, xcood4;
                        let ycood, ycood2, ycood3, ycood4;
                        xcood = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood2 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood2 = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood3 = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood3 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        xcood4 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood4 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth
                            && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = (xcood * 40) - obj.width;
                            obj.velocity *= -1;
                        }
                        else if (ycood2 >= 0 && ycood2 < this.worldHeight && xcood2 >= 0 && xcood2 < this.worldWidth
                            && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = obj.x - (obj.x % 40) + 40;
                            obj.velocity *= -1;
                        }
                        else if (ycood3 >= 0 && ycood3 < this.worldHeight && xcood3 >= 0 && xcood3 < this.worldWidth
                            && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = (xcood3 * 40) - obj.width;
                            obj.velocity *= -1;
                        }
                        else if (ycood4 >= 0 && ycood4 < this.worldHeight && xcood4 >= 0 && xcood4 < this.worldWidth
                            && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = obj.x - (obj.x % 40) + 40;
                            obj.velocity *= -1;
                        }
                        let collisionTest;
                        for (let i = 0; i < this.specialCharacters.length; i++) {
                            collisionTest = 0;
                            if (this.specialCharacters[i].alive && !this.specialCharacters[i].objectTransparent && i != objNum)
                                collisionTest = this.collision_test(obj, this.specialCharacters[i]);
                            if (collisionTest > 0)
                                this.process_collision(obj, this.specialCharacters[i], collisionTest, i);
                        }
                        obj.ySpeed += this.gravity;
                        obj.y += obj.ySpeed;
                        xcood = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood2 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood2 = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood3 = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood3 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        xcood4 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood4 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth
                            && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = obj.y - (obj.y % 40) + 40;
                            obj.ySpeed = 0;
                        }
                        else if (ycood2 >= 0 && ycood2 < this.worldHeight && xcood2 >= 0 && xcood2 < this.worldWidth
                            && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = obj.y - (obj.y % 40) + 40;
                            obj.ySpeed = 0;
                        }
                        else if (ycood3 >= 0 && ycood3 < this.worldHeight && xcood3 >= 0 && xcood3 < this.worldWidth
                            && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = (ycood3 * 40) - obj.height;
                            obj.ySpeed = 0;
                        }
                        else if (ycood4 >= 0 && ycood4 < this.worldHeight && xcood4 >= 0 && xcood4 < this.worldWidth
                            && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = (ycood4 * 40) - obj.height;
                            obj.ySpeed = 0;
                        }
                        for (let i = 0; i < this.specialCharacters.length; i++) {
                            collisionTest = 0;
                            if (this.specialCharacters[i].alive && !this.specialCharacters[i].objectTransparent && i != objNum)
                                collisionTest = 4 + this.collision_test(obj, this.specialCharacters[i]);
                            if (collisionTest > 4)
                                this.process_collision(obj, this.specialCharacters[i], collisionTest, i);
                        }
                        if (obj.y > this.worldHeight * 40)
                            obj.alive = false;
                        break;
                    }
                case GameType.BOWSER:
                    {
                        let fire_anim = 20;
                        let turnaround_anim = 41;
                        let yspeed_state = 40;
                        let reset_state = 81;
                        let randstate = 90;
                        let randanim = 50;
                        if (this.isSixtyFPSmode) {
                            fire_anim *= 2;
                            turnaround_anim = (2 * turnaround_anim) - 1;
                            yspeed_state *= 2;
                            reset_state = (2 * reset_state) - 1;
                            randstate *= 2;
                            randanim *= 2;
                        }
                        if (obj.animator >= 0)
                            obj.y += obj.velocity;
                        if (obj.animator == fire_anim) {
                            let fire_speed = -3;
                            if (this.isSixtyFPSmode)
                                fire_speed = -2;
                            this.create_object(GameType.BOWSERFIRE, obj.x, obj.y, 20, 40, false, true, fire_speed, 0, 0);
                            obj.currFrame = 1;
                            obj.velocity *= -1;
                        }
                        if (obj.animator == turnaround_anim) {
                            obj.animator = -(Math.floor(Math.random() * randstate));
                            obj.velocity *= -1;
                            obj.currFrame = 0;
                        }
                        obj.animator++;
                        if (obj.state >= 0)
                            obj.x += obj.ySpeed;
                        if (obj.state == yspeed_state) {
                            obj.ySpeed *= -1;
                        }
                        if (obj.state == reset_state) {
                            obj.ySpeed *= -1;
                            obj.state = -(Math.floor(Math.random() * randanim));
                        }
                        obj.state++;
                        break;
                    }
                case GameType.BOWSERFIRE:
                    {
                        if (obj.animator >= 0)
                            obj.x += obj.velocity;
                        if (this.marioY > obj.y)
                            obj.y += 1;
                        else
                            obj.y -= 1;
                        if (obj.animator == 20) {
                            obj.currFrame = 1;
                        }
                        if (obj.animator == 41) {
                            obj.currFrame = 0;
                            obj.animator = 0;
                        }
                        obj.animator++;
                        break;
                    }
                case GameType.FIRERING:
                    {
                        obj.x = obj.x - obj.velocity;
                        obj.y = obj.y - obj.ySpeed;
                        let xTemp = obj.x;
                        let yTemp = obj.y;
                        let velocity = 3;
                        if (this.isSixtyFPSmode)
                            velocity = 1.5;
                        obj.x = (xTemp * Math.cos((velocity * (3.14159) / 180))) + (yTemp * Math.sin((velocity * (3.14159) / 180)));
                        obj.y = -(xTemp * Math.sin((velocity * (3.14159) / 180))) + (yTemp * Math.cos((velocity * (3.14159) / 180)));
                        obj.x = obj.x + obj.velocity;
                        obj.y = obj.y + obj.ySpeed;
                        if (obj.animator == 5) {
                            obj.currFrame = 1;
                        }
                        if (obj.animator == 10) {
                            obj.currFrame = 2;
                        }
                        if (obj.animator == 15) {
                            obj.currFrame = 3;
                        }
                        if (obj.animator == 20) {
                            obj.animator = -1;
                            obj.currFrame = 0;
                        }
                        obj.animator++;
                        break;
                    }
                case GameType.LAVA:
                    {
                        if (this.lavaAnimator == 30) {
                            obj.currFrame = 0;
                        }
                        if (this.lavaAnimator == 60) {
                            obj.currFrame = 1;
                        }
                        break;
                    }
                case GameType.FIREBALL:
                    {
                        let velMultiplier = 1;
                        let animMultiplier = 1;
                        if (this.isSixtyFPSmode) {
                            velMultiplier = 0.5;
                            animMultiplier = 2;
                        }
                        if (obj.animator >= 0)
                            obj.y += obj.velocity * velMultiplier;
                        if (obj.animator == 14 * animMultiplier) {
                            obj.velocity *= -1;
                            obj.currFrame = 0;
                        }
                        if (obj.animator == 29 * animMultiplier) {
                            obj.animator = -(Math.floor(Math.random() * 90 * animMultiplier));
                            obj.velocity *= -1;
                            obj.currFrame = 1;
                        }
                        obj.animator++;
                        break;
                    }
                case GameType.PLATFORM:
                    {
                        if (obj.state == 0) {
                            if (obj.y > 500)
                                obj.alive = false;
                        }
                        if (obj.state == 1) {
                            obj.x += obj.velocity;
                            if (obj.animator == this.platformTurnaroundFrames) {
                                obj.animator = -1;
                                obj.velocity *= -1;
                            }
                            obj.animator++;
                        }
                        if (obj.state == 2) {
                            obj.y += obj.velocity;
                            this.updateMario();
                            let collisionTest = 0;
                            collisionTest = 4 + this.collision_test(this.marioObject, obj);
                            if (collisionTest > 4)
                                this.process_collision(this.marioObject, obj, collisionTest, objNum);
                            if (obj.animator == this.platformTurnaroundFrames) {
                                obj.animator = -1;
                                obj.velocity *= -1;
                            }
                            obj.animator++;
                        }
                        break;
                    }
                case GameType.MUSHROOM:
                    {
                        obj.x += obj.velocity; //move goomba
                        let xcood, xcood2, xcood3, xcood4;
                        let ycood, ycood2, ycood3, ycood4;
                        xcood = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood2 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood2 = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood3 = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood3 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        xcood4 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood4 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth
                            && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = (xcood * 40) - obj.width;
                            obj.velocity *= -1;
                        }
                        else if (ycood2 >= 0 && ycood2 < this.worldHeight && xcood2 >= 0 && xcood2 < this.worldWidth
                            && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = obj.x - (obj.x % 40) + 40;
                            obj.velocity *= -1;
                        }
                        else if (ycood3 >= 0 && ycood3 < this.worldHeight && xcood3 >= 0 && xcood3 < this.worldWidth
                            && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = (xcood3 * 40) - obj.width;
                            obj.velocity *= -1;
                        }
                        else if (ycood4 >= 0 && ycood4 < this.worldHeight && xcood4 >= 0 && xcood4 < this.worldWidth
                            && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.x = obj.x - (obj.x % 40) + 40;
                            obj.velocity *= -1;
                        }
                        let collisionTest;
                        for (let i = 0; i < this.specialCharacters.length; i++) {
                            collisionTest = 0;
                            if (this.specialCharacters[i].alive && !this.specialCharacters[i].objectTransparent && i != objNum)
                                collisionTest = this.collision_test(obj, this.specialCharacters[i]);
                            if (collisionTest > 0)
                                this.process_collision(obj, this.specialCharacters[i], collisionTest, i);
                        }
                        obj.ySpeed += this.gravity;
                        obj.y += obj.ySpeed;
                        xcood = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood2 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood2 = Math.floor((obj.y - ((obj.y) % 40)) / 40);
                        xcood3 = Math.floor((obj.x + obj.width - 1 - ((obj.x + obj.width - 1) % 40)) / 40);
                        ycood3 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        xcood4 = Math.floor((obj.x - ((obj.x) % 40)) / 40);
                        ycood4 = Math.floor((obj.y + obj.height - 1 - ((obj.y + obj.height - 1) % 40)) / 40);
                        if (ycood >= 0 && ycood < this.worldHeight && xcood >= 0 && xcood < this.worldWidth
                            && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood][xcood].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = obj.y - (obj.y % 40) + 40;
                            obj.ySpeed = 0;
                        }
                        else if (ycood2 >= 0 && ycood2 < this.worldHeight && xcood2 >= 0 && xcood2 < this.worldWidth
                            && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood2][xcood2].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = obj.y - (obj.y % 40) + 40;
                            obj.ySpeed = 0;
                        }
                        else if (ycood3 >= 0 && ycood3 < this.worldHeight && xcood3 >= 0 && xcood3 < this.worldWidth
                            && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood3][xcood3].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = (ycood3 * 40) - obj.height;
                            obj.ySpeed = 0;
                        }
                        else if (ycood4 >= 0 && ycood4 < this.worldHeight && xcood4 >= 0 && xcood4 < this.worldWidth
                            && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) > 0 && (this.grid[ycood4][xcood4].charCodeAt(0) - '0'.charCodeAt(0)) < 49) {
                            obj.y = (ycood4 * 40) - obj.height;
                            obj.ySpeed = 0;
                        }
                        for (let i = 0; i < this.specialCharacters.length; i++) {
                            collisionTest = 0;
                            if (this.specialCharacters[i].alive && !this.specialCharacters[i].objectTransparent && i != objNum)
                                collisionTest = 4 + this.collision_test(obj, this.specialCharacters[i]);
                            if (collisionTest > 4)
                                this.process_collision(obj, this.specialCharacters[i], collisionTest, i);
                        }
                        if (obj.y > this.worldHeight * 40)
                            obj.alive = false;
                        break;
                    }
            }
        }
    }
    exports.MarioGame = MarioGame;
});
//# sourceMappingURL=mariogame.js.map