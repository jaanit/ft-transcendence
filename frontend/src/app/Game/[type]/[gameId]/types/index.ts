
import {Ball, Brick, PSize, Paddle} from "./component"

export interface GameConfig {
	player: number
	bricks: Array<PSize>
	ball: Array<PSize>
	paddle1: PSize
	paddle2: PSize
	score: {p1: number, p2: number}
	sec: number
	
}
// interface key {
// 	left: boolean
// 	right: boolean
// 	turn_left: boolean
// 	turn_right: boolean
// }

export class Game 
{
	world: {h:number, w:number}
	ball: Array<Ball>
	paddle: [Paddle, Paddle]
	bricks: Array<Brick>
	score: {p1: number, p2: number}
	keysPressed: Set<string>;
	sec: number
	time : Date
	start: boolean
	constructor()
	{
		this.world = {h: 1000, w: 600}
		this.ball = new Array();
		this.paddle = [new Paddle(40, 250, 150, 30), new Paddle(970, 250, 150, 30)]
		this.bricks = new Array();
		this.score = {p1: 0, p2: 0};
		this.keysPressed = new Set()
		this.sec = -1
		this.time = new Date()
		this.start = false
	}
	get_data():GameConfig
	{
		const b = new Array(this.bricks)
		const data: GameConfig = {
			player: -1,
			ball: this.ball.map(value => value.get_data(this.world.h, this.world.w, 0xffffff)),
			paddle1: this.paddle[0].get_data(this.world.h, this.world.w, 0xffffff),
			paddle2: this.paddle[1].get_data(this.world.h, this.world.w, 0xffffff),
			bricks: Array.from(this.bricks).map(value => value.get_data(this.world.h, this.world.w, 0xffffff)),
			score: this.score,
			sec: this.sec
		}
		return data
	}
	bot()
	{
		if (this.ball.length)
		{
			if (this.ball[0].position.y < this.paddle[1].position.y)
			 	this.paddle[1].move_left(1, 0)
			if (this.ball[0].position.y > this.paddle[1].position.y)
				this.paddle[1].move_right(1, 600)
		}
		else
		{
			if (this.world.w/2 < this.paddle[1].position.y)
			 	this.paddle[1].move_left(1, 0)
			if (this.world.w/2 > this.paddle[1].position.y)
				this.paddle[1].move_right(1, 600)
		}
	}
	check_keys()
	{

		this.paddle[0].rotate(0)
		// this.paddle[0].restScale()
		if (this.keysPressed.has('a') || this.keysPressed.has('A'))
			this.paddle[0].changeScale(1.5)
		if (this.keysPressed.has("ArrowUp") || this.keysPressed.has("ArrowLeft"))
			this.paddle[0].move_left(1, 0)
		if (this.keysPressed.has("ArrowDown") || this.keysPressed.has("ArrowRight"))
			this.paddle[0].move_right(1, 600)
		if (this.keysPressed.has('x'))
			this.paddle[0].rotate(Math.PI/6)
		else if (this.keysPressed.has('c'))
			this.paddle[0].rotate(-Math.PI/6)
		// if (this.keysPressed.has('w') || this.keysPressed.has('W'))
		// 	this.paddle[1].move_left(1, 0)
		// if (this.keysPressed.has('s') || this.keysPressed.has('S'))
		// 	this.paddle[1].move_right(1, 600)
		if (this.keysPressed.has(' '))
			this.start = true
		
	}
	check_intersection()
	{
		if (this.ball.length)
		{
			this.paddle[0].check_intersection(this.ball[0], -1)
			this.paddle[1].check_intersection(this.ball[0], 1)
			for(let i = 0;i < this.bricks.length ; i++ )
			{
				const type = this.bricks[i].check_intersect(this.ball[0])
				if (type)
					this.bricks.pop()
			
				if (type == 1)
				{
					if(this.ball[0].dx > 0)
						this.paddle[0].changeScale(1.3)
					else
						this.paddle[1].changeScale(1.3)
				}
				if (type == 2)
				{
						if(this.ball[0].dx > 0)
							this.paddle[0].changeScale(0.7)
						else
							this.paddle[1].changeScale(0.7)
				}
				if (type == 3)
				{
						this.ball[0].change_scale(1.3)
				}
				if (type == 4)
				{
					this.ball[0].change_scale(0.7)
				}
				if (type == 5)
					this.ball[0].setSpeed(3);
				if(type == 6)
					this.ball[0].setSpeed(4);

			}	
			
		}
	}
	update()
	{
		this.check_keys()
		if(!this.start)
		{
			this.time = new Date()
			return ;
		}
		if (!this.ball.length)
		{
			const now = new Date()
			this.sec = Math.floor((now.getTime() - this.time.getTime())/1000)
			if (this.sec >= 3)
			{
				this.ball.push(new Ball(1000, 500, 20, 100))
				this.sec = -1
			}
		}
		this.check_intersection()
		this.bot()
		if (this.bricks.length < 1 && Math.floor(Math.random() * 1000) == 0)
			this.bricks.push(new Brick())
		if (this.ball.length)
		{
			if (this.ball[0].out.left || this.ball[0].out.right)
			{
				this.score.p1 += Number(this.ball[0].out.right);
				this.score.p2 += Number(this.ball[0].out.left);
				this.ball.pop()
				this.time = new Date()
			}
			else
				this.ball[0].update()
		}
	}

}
