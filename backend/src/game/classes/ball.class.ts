import { Position, PSize } from "../interfaces/utils.interface";


export class Circle
{
    position: Position
    r: number
    scale: number
    constructor(x: number, y: number, r: number)
    {
        this.position = {x:x,y:y};
        this.r = r;
        this.scale = 1;
    }
    change_scale(scale: number)
    {
        this.rest_scale()
        this.scale = scale;
        this.r *= this.scale;
    }
    rest_scale()
    {
        this.r /= this.scale;
        this.scale = 1;
    }
    change_position(x: number, y: number)
    {
        this.position = {x:x,y:y};
    }
    intersect(c : Circle) : boolean
    {
        const dis = (this.position.x - c.position.x)**2 + (this.position.y - c.position.y)**2
        return (dis < ((c.r + this.r))**2)
    }
}

export class Ball extends Circle
{
    dx: number
    dy: number
    speed: number
    time: Date
    out: {left:boolean , right:boolean}
    constructor(h: number, w: number, r: number, arc: number)
    {
        const ang = Math.PI/ 6 + 2*(Math.PI * Math.random())/3;
        const dir = Math.floor(Math.random() * 2) * 2 - 1;
        // const dir = 1;
        const x = h/2 + arc * Math.sin(ang) * dir
        const y = w/2 + arc * Math.cos(ang)
        // const x = 800;
        // const y = 250
        super(x, y, r);
        this.speed = 6
        this.dx = Math.sin(ang) * dir * this.speed
        this.dy = Math.cos(ang) * this.speed
        this.time = new Date
        this.out = {left:false,right:false}
    } 
    set_velocity(vx: number, vy: number)
    {
        this.dx = this.speed * vx/((vx**2 + vy**2)**(1/2)) 
        this.dy = this.speed * vy /((vx**2 + vy**2)**(1/2))
    }
    set_velocity_angle(dr: number, ang: number)
    {
        ang = ang + ((Math.random() - .5) * Math.PI)/6
        this.dx = this.speed * dr * Math.cos(ang) + 0.01;
        this.dy = this.speed * dr * Math.sin(ang) + 0.01;
    }
    getSpeed():number
    {
        return (this.dx*this.dx + this.dy*this.dy)**(1/2)
    }
    setSpeed(speed: number)
    {
        this.speed = speed
    }
    update()
    {
        
        this.position.x = this.position.x + this.dx
        this.position.y = this.position.y + this.dy
        this.out.left = (this.position.x < 0)
        this.out.right = (this.position.x > 1000)
        if (this.position.y + this.r>= 600)
            this.dy = -1 * Math.abs(this.dy)
        if (this.position.y - this.r<= 0)
            this.dy = Math.abs(this.dy)
    }
    get_data(h: number, w: number, color: number): PSize
    {
        const scale = h/w;
        let data: PSize = {height: this.r  *1000/h,
                        width:this.r *  1000/h,
                        color: "",
                        position: {x: (this.position.x) * 1000 /h,
                                    y: (this.position.y)  * 1000 /h},
                        scale: this.scale,
                        rotation: 0
                        
                    }
        // let data: PSize = {height: this.r /2 *100/h,
        //                 width:this.r * 100 / h,
        //                 color: color,
        //                 position: {x: (this.position.x) * 100 /h,
        //                             y: (this.position.y) * 100 /h},
        //                 scale: this.scale,
        //                 rotation: 0

        //             }
        return data;
    }
}