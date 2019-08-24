declare var navigator;

export class GamePadState {
    buttonDown: boolean = false;
    buttonNum: number = -1;
    buttonTimer = 0;
    keyName: string = '';


    constructor(buttonNum: number, keyName: string) {
        this.buttonNum = buttonNum;
        this.keyName = keyName;
    }

}

export class KeyMappings {
    Mapping_Left: string = null;
    Mapping_Right: string = null;
    Mapping_Up: string = null;
    Mapping_Down: string = null;
    Mapping_Action_1: string = null;
    Mapping_Action_2: string = null;
    Mapping_Start: string = null;
    Mapping_Select: string = null;
    Mapping_Joy_L: string = null;
    Mapping_Joy_R: string = null;
}

export class InputController {

    gamepadButtons: GamePadState[] = [];

    Key_Up = false;
    Key_Down = false;
    Key_Left = false;
    Key_Left_Long = false;
    Key_Right = false;
    Key_Right_Long = false;
    Key_Action_1 = false;
    Key_Action_2 = false;
    Key_Start = false;
    Key_Select = false;
    Gamepad_Process_Axis = false;
    Touch_Tap = false;
    Touch_Start = false;
    Touch_End = false;
    KeyMappings: KeyMappings;

    //touch
    private touchX_Start: number = 0;
    private touchY_Start: number = 0;
    MobileA = false; MobileA_Counter = 0;
    MobileB = false; MobileB_Counter = 0;
    MobileX = false; MobileX_Counter = 0;
    MobileY = false; MobileY_Counter = 0;

    constructor(touch_element_id?: string, touch_exclude_id?: string) {
        window["inputController"] = this;


        //need this for full screen touch support
        if (touch_element_id) {
            if (touch_exclude_id) {
                document.getElementById(touch_exclude_id).addEventListener('touchstart', function (e) { e.stopPropagation(); }, false);
                document.getElementById(touch_exclude_id).addEventListener('touchend', function (e) { e.stopPropagation(); }, false);
            }
            document.getElementById(touch_element_id).addEventListener('touchstart', this.touchStart, false);
            document.getElementById(touch_element_id).addEventListener('touchend', this.touchEnd, false);
            document.getElementById(touch_element_id).addEventListener('touchmove', this.touchMove, false);

            document.getElementById('mobileA').addEventListener('touchstart', this.mobilePressA.bind(this), false);
            document.getElementById('mobileB').addEventListener('touchstart', this.mobilePressB.bind(this), false);
            document.getElementById('mobileY').addEventListener('touchstart', this.mobilePressY.bind(this), false);
            document.getElementById('mobileX').addEventListener('touchstart', this.mobilePressX.bind(this), false);
            document.getElementById('mobileA').addEventListener('touchend', this.mobileReleaseA.bind(this), false);
            document.getElementById('mobileB').addEventListener('touchend', this.mobileReleaseB.bind(this), false);
            document.getElementById('mobileX').addEventListener('touchend', this.mobileReleaseX.bind(this), false);
            document.getElementById('mobileY').addEventListener('touchend', this.mobileReleaseY.bind(this), false);
            document.getElementById('mobileA').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            document.getElementById('mobileB').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            document.getElementById('mobileX').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            document.getElementById('mobileY').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        }


        //defaults - gets overwritten in index.ts
        this.KeyMappings = {
            Mapping_Left: 'Left',
            Mapping_Right: 'Right',
            Mapping_Up: 'Up',
            Mapping_Down: 'Down',
            Mapping_Action_1: 'a',
            Mapping_Action_2: 's',
            Mapping_Start: 'p',
            Mapping_Select: 'n',
            Mapping_Joy_L: ',',
            Mapping_Joy_R: '.'
        }


        //only for HTML5 Canvas
        //document.addEventListener( 'wheel', this.prevent, false );
        //document.addEventListener( 'contextmenu', this.prevent, false );

        document.onkeydown = this.keyDown;
        document.onkeyup = this.keyUp;
    }

    //run button
    mobilePressA(event) {
        event.preventDefault();
        this.MobileA = true;
    }

    //jump button
    mobilePressB(event) {
        event.preventDefault();
        this.Key_Action_2 = true;
        this.MobileB = true;
    }
    mobilePressX(event) {
        event.preventDefault();
        this.MobileX = true;
    }
    mobilePressY(event) {
        event.preventDefault();
        this.MobileY = true;
    }
    mobileReleaseA(event) {
        event.preventDefault();
        if (this.Key_Action_1)
        {
            this.MobileA = false;
            this.Key_Action_1 = false;
        }
        else
        {
            this.MobileA = true;
            this.Key_Action_1 = true;
        }
        
    }
    mobileReleaseB(event) {
        event.preventDefault();
        this.Key_Action_2 = false;
        this.MobileB = false;
    }
    mobileReleaseX(event) {
        event.preventDefault();
        this.MobileX = false;
        window["myApp"].nextLevel();
    }
    mobileReleaseY(event) {
        event.preventDefault();
        this.MobileY = false;
        window["myApp"].prevLevel();

    }

    setupGamePad() {
        window.addEventListener("gamepadconnected", this.initGamePad.bind(this));
        this.gamepadButtons.push(new GamePadState(14, this.KeyMappings.Mapping_Left));
        this.gamepadButtons.push(new GamePadState(15, this.KeyMappings.Mapping_Right));
        this.gamepadButtons.push(new GamePadState(13, this.KeyMappings.Mapping_Down));
        this.gamepadButtons.push(new GamePadState(12, this.KeyMappings.Mapping_Up));
        this.gamepadButtons.push(new GamePadState(2, this.KeyMappings.Mapping_Action_1));
        this.gamepadButtons.push(new GamePadState(0, this.KeyMappings.Mapping_Action_2));
        this.gamepadButtons.push(new GamePadState(9, this.KeyMappings.Mapping_Start));
        this.gamepadButtons.push(new GamePadState(8, this.KeyMappings.Mapping_Select));
        this.gamepadButtons.push(new GamePadState(4, this.KeyMappings.Mapping_Joy_L));
        this.gamepadButtons.push(new GamePadState(5, this.KeyMappings.Mapping_Joy_R));
    }

    private initGamePad(e) {
        try {
            if (e.gamepad.buttons.length > 0) {
                // this.message = '<b>Gamepad Detected:</b><br>' + e.gamepad.id;
            }
        } catch{ }

        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
    }


    processGamepad() {
        try {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            if (!gamepads)
                return;
            var gp = null;
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] && gamepads[i].buttons.length > 0)
                    gp = gamepads[i];
            }


            if (gp) {
                for (let i = 0; i < gp.buttons.length; i++) {
                    //debug
                    // if (gp.buttons[i].pressed)
                    //     console.log(i);
                }
                this.gamepadButtons.forEach(button => {

                    if (gp.buttons[button.buttonNum].pressed) {
                        if (button.buttonTimer == 0) {
                            this.sendKeyDownEvent(button.keyName);
                            // console.log('button timer: ' + button.buttonTimer);
                        }
                        button.buttonDown = true;
                        button.buttonTimer++;
                    }
                    else if (button.buttonDown) {
                        // console.log('gamepad up');
                        if (!gp.buttons[button.buttonNum].pressed) {
                            button.buttonDown = false;
                            button.buttonTimer = 0;
                            this.sendKeyUpEvent(button.keyName);
                        }
                    }


                });


                //process axes
                if (this.Gamepad_Process_Axis) {
                    try {
                        let horiz_axis = gp.axes[0] as number;
                        let vertical_axis = gp.axes[1] as number;

                        if (horiz_axis < -.5)
                            this.Key_Left = true;
                        else
                            this.Key_Left = false;

                        if (horiz_axis > .5)
                            this.Key_Right = true;
                        else
                            this.Key_Right = false;

                        if (vertical_axis < -.5)
                            this.Key_Down = true;
                        else
                            this.Key_Down = false;

                        if (vertical_axis > .5)
                            this.Key_Up = true;
                        else
                            this.Key_Up = false;

                    } catch (error) { }
                }


            }


        } catch{ }
    }

    sendKeyDownEvent(key: string) {
        let keyEvent = new KeyboardEvent('Gamepad Event Down', { key: key });
        this.keyDown(keyEvent);
    }

    sendKeyUpEvent(key: string) {
        let keyEvent = new KeyboardEvent('Gamepad Event Up', { key: key });
        this.keyUp(keyEvent);
    }

    keyDown(event: KeyboardEvent) {
        if (event.key == 'ArrowLeft') event = new KeyboardEvent('', { key: 'Left' });
        if (event.key == 'ArrowRight') event = new KeyboardEvent('', { key: 'Right' });
        if (event.key == 'ArrowUp') event = new KeyboardEvent('', { key: 'Up' });
        if (event.key == 'ArrowDown') event = new KeyboardEvent('', { key: 'Down' });

        let input_controller = window["inputController"] as InputController;
        if (event.key == input_controller.KeyMappings.Mapping_Down) {
            input_controller.Key_Down = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Up) {
            input_controller.Key_Up = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Left) {
            input_controller.Key_Left = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Right) {
            input_controller.Key_Right = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Action_1) {
            input_controller.Key_Action_1 = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Action_2) {
            input_controller.Key_Action_2 = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Start) {
            input_controller.Key_Start = true;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Select) {
            input_controller.Key_Select = true;
        }

    }

    keyUp(event: KeyboardEvent) {
        //if debugging
        // console.log('key up', event);
        if (event.key == 'ArrowLeft') event = new KeyboardEvent('', { key: 'Left' });
        if (event.key == 'ArrowRight') event = new KeyboardEvent('', { key: 'Right' });
        if (event.key == 'ArrowUp') event = new KeyboardEvent('', { key: 'Up' });
        if (event.key == 'ArrowDown') event = new KeyboardEvent('', { key: 'Down' });

        let input_controller = window["inputController"] as InputController;
        if (event.key == input_controller.KeyMappings.Mapping_Down) {
            input_controller.Key_Down = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Up) {
            input_controller.Key_Up = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Left) {
            input_controller.Key_Left = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Right) {
            input_controller.Key_Right = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Action_1) {
            input_controller.Key_Action_1 = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Action_2) {
            input_controller.Key_Action_2 = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Start) {
            input_controller.Key_Start = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Select) {
            input_controller.Key_Select = false;
        }
        if (event.key == input_controller.KeyMappings.Mapping_Joy_L) {
            window["myApp"].prevLevel();
        }
        if (event.key == input_controller.KeyMappings.Mapping_Joy_R) {
            window["myApp"].nextLevel(); 
        }

    }

    prevent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    touchStart(event: TouchEvent) {
        event.preventDefault();
        let input_controller = window["inputController"] as InputController;
        input_controller.Touch_Start = true;

        //prevent multi-touch from grabbing the wrong touch event
        //there may be more than 2 touches so just loop until it's found
        for (let i = 0; i < event.touches.length; i++) {
            let touch = event.touches[i];

            if (touch.target["id"] == "divTouchSurface" || touch.target["id"] == "startDiv") {
                input_controller.touchX_Start = touch.clientX;
                input_controller.touchY_Start = touch.clientY;

                input_controller.touchXLast = touch.clientX;
                input_controller.touchYLast = touch.clientY;
            }
        }
    }

    touchXLast:number;
    touchYLast:number;
    quickTurnaroundEnabled:boolean = false;

    touchMove(event: TouchEvent) {
        event.preventDefault();
        let input_controller = window["inputController"] as InputController;

        //prevent multi-touch from grabbing the wrong touch event
        for (let i = 0; i < event.touches.length; i++) {
            let touch = event.touches[i];

            if (touch.target["id"] == "divTouchSurface" || touch.target["id"] == "startDiv") {
                var amount_horizontal = touch.clientX - input_controller.touchX_Start;
                var amount_vertical = touch.clientY - input_controller.touchY_Start;

                //handle sudden change in touch direction
                if (input_controller.quickTurnaroundEnabled)
                {
                    if (input_controller.Key_Right)
                    {
                        if (touch.clientX>input_controller.touchXLast)
                        {
                            input_controller.touchXLast = touch.clientX;
                        }
                        else
                        {
                            if (touch.clientX<input_controller.touchXLast-5)
                            {
                                input_controller.touchX_Start = touch.clientX-10;
                            }
                        }
                    }
                    if (input_controller.Key_Left)
                    {
                        if (touch.clientX<input_controller.touchXLast)
                        {
                            input_controller.touchXLast = touch.clientX;
                        }
                        else
                        {
                            if (touch.clientX>input_controller.touchXLast+5)
                            {
                                input_controller.touchX_Start = touch.clientX+10;
                            }
                        }
                    }
                }



                if (amount_horizontal > 10) {
                    if (!input_controller.Key_Right) {
                        input_controller.Key_Right = true;
                        input_controller.Key_Left = false;
                    }
                }
                if (amount_horizontal < -10) {
                    if (!input_controller.Key_Left) {
                        input_controller.Key_Left = true;
                        input_controller.Key_Right = false;
                    }
                }
                if (Math.abs(amount_horizontal)<=10)
                {
                    input_controller.Key_Left = false;
                    input_controller.Key_Right = false;
                }


                if (amount_vertical > 10) {
                    if (!input_controller.Key_Down) {
                        input_controller.Key_Down = true;
                    }
                }
                if (amount_vertical < -10) {
                    if (!input_controller.Key_Up) {
                        input_controller.Key_Up = true;
                    }
                }
            }
        }
    }


    touchEnd(event: TouchEvent) {
        event.preventDefault();
        event.stopPropagation();


        let input_controller = window["inputController"] as InputController;
        input_controller.Touch_End = true;

        if (input_controller.Key_Left==false && input_controller.Key_Right==false 
            && input_controller.Key_Down==false && input_controller.Key_Up==false)
            input_controller.Touch_Tap=true;
        if (input_controller.Key_Right)
        {
            input_controller.sendKeyUpEvent(input_controller.KeyMappings.Mapping_Right);
            input_controller.Key_Right=false;
        }
        if (input_controller.Key_Left)
        {
            input_controller.sendKeyUpEvent(input_controller.KeyMappings.Mapping_Left);
            input_controller.Key_Left=false;
        }
        if (input_controller.Key_Up)
        {
            input_controller.sendKeyUpEvent(input_controller.KeyMappings.Mapping_Up);
            input_controller.Key_Up=false;
        }
        if (input_controller.Key_Down)
        {
            input_controller.sendKeyUpEvent(input_controller.KeyMappings.Mapping_Down);
            input_controller.Key_Down=false;
        }
    }

    mouseUp(event) {
        event.preventDefault();
        // window["myApp"].isMouseDown = false;
    }

    mouseDown(event: MouseEvent) {
        event.preventDefault();
        // window["myApp"].isMouseDown = true;
    }

    mouseMove(event: MouseEvent) {
        event.preventDefault();
    }

    private touch_tap_counter = 0;
    private touch_start_counter = 0;
    private touch_end_counter = 0;

    processTouchEvents() {
        if (this.Touch_Tap)
            this.touch_tap_counter++;
        if (this.touch_tap_counter > 1) {
            this.Touch_Tap = false;
            this.touch_tap_counter = 0;
        }

        if (this.Touch_Start)
            this.touch_start_counter++;
        if (this.touch_start_counter > 1) {
            this.Touch_Start = false;
            this.touch_start_counter = 0;
        }


        if (this.Touch_End)
            this.touch_end_counter++;
        if (this.touch_end_counter > 1) {
            this.Touch_End = false;
            this.touch_end_counter = 0;
        }
    }

    update() {
        this.processGamepad();
        this.processTouchEvents();

        //used for double tap detection
        this.MobileA_Counter++;
        this.MobileB_Counter++;
        this.MobileX_Counter++;
        this.MobileY_Counter++;

    }
}