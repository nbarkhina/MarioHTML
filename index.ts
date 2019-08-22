import { MarioGame } from "./mariogame";
import { InputController } from "./input_controller";
import { FPSController } from "./fps_controller";

declare var rivets;

class MyApp{

	ctx:CanvasRenderingContext2D;
	canvas:HTMLCanvasElement;
    marioGame:MarioGame;
	inputContoller:InputController;
	mobileMode = false;
	isSixtyFPS = true;
	isThirtyFPS = false;
	fpsController:FPSController;
	useragent:string = '';

	constructor(){
		rivets.bind(document.getElementsByTagName('body')[0], { data: this });

		this.canvas = document.getElementById('my-canvas') as HTMLCanvasElement;

		this.useragent = navigator.userAgent.toLocaleLowerCase();

		//mobile device
		if ((window.innerWidth<600 || this.useragent.includes('iphone') || 
			this.useragent.includes('ipad') || this.useragent.includes('android'))
			&& window.innerWidth<window.innerHeight)
		{
			this.mobileMode = true;
		}


		
		

		


		if (this.mobileMode)
		{
			document.getElementById('header').style.display = "none";
			$("#mobileDiv").show();
            $('#my-canvas').width(window.innerWidth);
			$('#my-canvas').appendTo("#mobileCanvas");
			this.inputContoller = new InputController('divTouchSurface');

			document.getElementById('my-canvas').addEventListener( 'touchstart', function (e) { e.preventDefault(); }, false );
            document.getElementById('my-canvas').addEventListener( 'touchend', function (e) { e.preventDefault(); }, false );
            document.getElementById('my-canvas').addEventListener( 'touchmove', function (e) { e.preventDefault(); }, false );

		}
		else
		{
			this.inputContoller = new InputController('divMain');

			//MS Edge doesn't work well with wasd keys, misses some key up events
			this.inputContoller.KeyMappings = {
				Mapping_Left:'Left',
				Mapping_Right:'Right',
				Mapping_Up:'Up',
				Mapping_Down:'Down',
				// Mapping_Action_1:'Shift',
				// Mapping_Action_2:' ',
				Mapping_Action_1:'a',
				Mapping_Action_2:'s',
				Mapping_Start:'p',
				Mapping_Select:'n',
				Mapping_Joy_L: ',',
				Mapping_Joy_R: '.'
			};
			this.inputContoller.setupGamePad();
			// this.inputContoller.Gamepad_Process_Axis = true;
			$('#divMain').show();
		}

		this.ctx = this.canvas.getContext('2d');
		this.createGame();
		this.fpsController = new FPSController(30);

		$('#divLoading').hide();


		window.requestAnimationFrame(this.draw.bind(this));
	}

	createGame(){
		this.marioGame = new MarioGame(this.canvas.width, this.canvas.height,this.ctx,
			this.inputContoller,this.mobileMode, this.isSixtyFPS);
	}

	thirty(){
		this.isSixtyFPS = false;
		this.isThirtyFPS = true;
		this.createGame();
	}
	
	sixty(){
		this.isSixtyFPS = true;
		this.isThirtyFPS = false;
		this.createGame();
	}

	prevLevel(){
		if (this.marioGame.currentLevel>1)
			this.marioGame.loadLevel(this.marioGame.currentLevel-1);
	}

	nextLevel(){
		if (this.marioGame.currentLevel<8)
			this.marioGame.loadLevel(this.marioGame.currentLevel+1);		
	}
	
	btnClick(){
		this.marioGame.startGame();
	}

	drawGame(){

		this.marioGame.draw();
	}

	draw(){
		
		if (this.isSixtyFPS)
			this.drawGame();
		else if (this.fpsController.IsFrameReady()) {
			this.drawGame();
		}

		window.requestAnimationFrame(this.draw.bind(this));
	}
	
}

window["myApp"] = new MyApp();