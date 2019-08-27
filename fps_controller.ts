//https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe

export class FPSController{

    fpsInterval:number
	startTime:number;
	now:number;
	then:number;
    elapsed:number;
	enabled:boolean = false;
    
    constructor(target_fps:number){
		this.fpsInterval = 1000 / target_fps;
		this.then = Date.now();
		this.startTime = this.then;
    }

    UpdateTargetFPS(target_fps:number)
    {
		this.fpsInterval = 1000 / target_fps;
    }

    IsFrameReady():boolean{
        this.now = Date.now();
        this.elapsed = this.now - this.then;

        // if enough time has elapsed, draw the next frame
        if (this.elapsed > this.fpsInterval)
        {
            // Get ready for next frame by setting then=now, but also adjust for your
			// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            this.then = this.now - (this.elapsed % this.fpsInterval);
            return true;
        }
        else
            return false;
    }

}