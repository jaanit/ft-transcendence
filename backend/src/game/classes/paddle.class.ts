import { Ball } from "./ball.class";
import { Circle } from "./ball.class";
import { Position, PSize  } from "../interfaces/utils.interface";

class Rectangle
{
    position: Position
    height: number
    width: number
    rotation: number
    scale: number
    constructor(x: number, y: number, h: number, w:number)
    {
        this.position = {x:x,y:y};
        this.width = w
        this.height = h
        this.scale = 1
        this.rotation = 0
    }
    change_scale(scale: number)
    {
        
        this.scale = scale;
        this.width = this.width * this.scale;
        this.height = this.height * this.scale;
    }
    rest_scale()
    {
        this.width /= this.scale;
        this.height /= this.scale;
        this.scale = 1;
    }
    change_rotation(ang: number)
    {
        this.rotation = ang
    }
    line_circle_intersection(line: { x1: number; y1: number; x2: number; y2: number }, c: Circle): boolean
    {
        const { x1, y1, x2, y2 } = line;

        const a = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        const b =
            2 * (x1 - c.position.x) * (x2 - x1) + 2 * (y1 - c.position.y) * (y2 - y1);
        const cc = (x1 - c.position.x) ** 2 + (y1 - c.position.y) ** 2 - (c.r) ** 2;

        const discriminant = b ** 2 - 4 * a * cc;
        if (discriminant < 0)
            return false;
        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        if (t1 >= -1 && t1 <= 1)
            return true;
        if (t2 >= -1 && t2 <= 1)
            return true;
        return false;
    }

    intersect(c : Circle, sig: number): boolean
    {
        
        const height = this.height - this.width
        const line1 = {
            x1 : this.position.x - this.width/2 * sig,
            y1 : this.position.y,
            x2 : this.position.x + Math.sin(-this.rotation) * height/2 - sig * this.width/2,
            y2 : this.position.y + Math.cos(-this.rotation) * height/2,
        }
        // const line2 = {
        //     x1 : this.position.x + this.width/2,
        //     y1 : this.position.y,
        //     x2 : this.position.x + Math.sin(-this.rotation) * height/2 + this.width/2,
        //     y2 : this.position.y + Math.cos(-this.rotation) * height/2,
        // }
        return (this.line_circle_intersection(line1, c))
    }
    
}

export class Paddle extends Rectangle
{
    side1: Circle
    side2: Circle
    time: Date
    constructor(x: number, y: number, h: number, w:number)
    {
        super(x, y, h, w)
        this.side1 = new Circle(x, y + h/2 -w/2, w/2)
        this.side2 = new Circle(x , y - h/2 + w/2 , w/2)
        this.time = new Date
    }
    rotate(ang: number)
    {
        let c =  (this.height - this.width)/2 * Math.cos(-ang)
        let s = (this.height - this.width)/2 * Math.sin(-ang)
        this.change_rotation(ang);
        this.side1.change_position(this.position.x + s, this.position.y + c)
        this.side2.change_position(this.position.x - s, this.position.y - c)
    }
    changeScale(scale: number) 
    {
        this.time = new Date()
        this.restScale()
        this.change_scale(scale)
        this.side1.change_scale(scale)
        this.side2.change_scale(scale)
        let c = (this.height - this.width)/2 * Math.cos(-this.rotation)
        let s = (this.height - this.width)/2 * Math.sin(-this.rotation)
        this.side1.change_position(this.position.x + s, this.position.y + c)
        this.side2.change_position(this.position.x - s, this.position.y - c)
    }
    restScale() 
    {
        this.rest_scale()
        this.side1.rest_scale()
        this.side2.rest_scale()
        let c = (this.height - this.width)/2 * Math.cos(-this.rotation)
        let s = (this.height - this.width)/2 * Math.sin(-this.rotation)
        this.side1.change_position(this.position.x + s, this.position.y + c)
        this.side2.change_position(this.position.x - s, this.position.y - c)
    }

    check_intersection(ball: Ball, sig: number): number
    {
        const now = new Date()
        if (this.scale != 1 && now.getTime() - this.time.getTime() > 7000)
            this.restScale()
        if (this.intersect(ball, sig))
            ball.set_velocity_angle(-sig, this.rotation)
        else if (this.side1.intersect(ball))
            ball.set_velocity(ball.position.x - this.side1.position.x , ball.position.y - this.side1.position.y)
        else if (this.side2.intersect(ball))
            ball.set_velocity(ball.position.x - this.side2.position.x , ball.position.y - this.side2.position.y)
        return 0;
    }
    move_left(speed: number, limit : number)
    {
        if (this.position.y - this.height/2 >= limit)
        {
            this.position.y = this.position.y - speed
            this.side1.position.y = this.side1.position.y - speed
            this.side2.position.y = this.side2.position.y - speed
        }
    }
    move_right(speed: number, limit : number)
    {
        if (this.position.y + this.height/2<= limit)
        {
            this.position.y = this.position.y + speed
            this.side1.position.y = this.side1.position.y + speed
            this.side2.position.y = this.side2.position.y + speed
        }
    }
    get_data(h: number, w: number, color: number): PSize
    {

        const scale = h/w; 
        // const data: PSize = {height: this.height * 0.1*scale ,
        //                         width:this.width * 0.1,
        //                         color: "color",
        //                         position: {x: (this.position.x - this.width/(2 )) * 100 / h,
        //                                     y: (this.position.y - this.height/(2)) *scale * 100 / h},
        //                         scale: this.scale,
        //                         rotation: this.rotation
        //                     }
        const data: PSize = {height: this.height ,
                                width:this.width,
                                color: "#ff0000",
                                position: {x: (this.position.x ),
                                            y: (this.position.y)},
                                scale: this.scale,
                                rotation: this.rotation
                            }
        // const data: PSize = {height: this.side2.r * 2 * 0.1* scale ,
        //                             width:this.side2.r * 2 * 0.1,
        //                             color: 0,
        //                             position: {x: (this.side2.position.x - this.side2.r * 2/(2 )) * 100 / h,
        //                                         y: (this.side2.position.y - this.side2.r * 2/(2)) *scale * 100 / h},
        //                             scale: this.scale,
        //                             rotation: this.rotation
        //                         }
        return data;
    }
}

export class Brick extends Rectangle
{
    creation_time: Date
    type: number
    color: Array<string>
    constructor()
    {
        const x = 450 + Math.random() *100
        const y = 200 + Math.random() *200
        super(x, y, 70,70);
        this.creation_time = new Date()
        this.type = Math.floor(Math.random() * 6);
        this.color = new Array( "#f00000", "#00f000" , "#00f000", "#f000f0", "#f0f000", "#00f0f0");
        


    }
    get_data(h: number, w: number, color: number): PSize
    {
        // const scale = h/w;
        // const data: PSize = {height: this.height * 0.1*scale ,
        //                     width:this.width * 0.1,
        //                 color:  this.color,
        //                 position: {x: (this.position.x - this.width/2) * 100 / h,
        //                             y: (this.position.y - this.height/2) *scale * 100 / h},
        //                 scale: this.scale,
        //                 rotation: this.rotation
        //             }
        const data: PSize = {height: this.height ,
            width:this.width,
            color: this.color[this.type],
            position: {x: (this.position.x ),
                        y: (this.position.y)},
            scale: this.scale,
            rotation: this.rotation
        }
        
        return data;
    }
    check_intersect(c: Circle): number {
        const line1 = {
            x1 : this.position.x + this.width/2,
            y1 : this.position.y,
            x2 : this.position.x + this.width/2,
            y2 : this.position.y + this.height/2,
        }
        const line2 = {
            x1 : this.position.x - this.width/2,
            y1 : this.position.y,
            x2 : this.position.x - this.width/2,
            y2 : this.position.y + this.height/2,
        }
        const line3 = {
            x1 : this.position.x,
            y1 : this.position.y + this.height/2,
            x2 : this.position.x + this.width/2,
            y2 : this.position.y + this.height/2,
        }
        const line4 = {
            x1 : this.position.x,
            y1 : this.position.y - this.height/2,
            x2 : this.position.x + this.width/2,
            y2 : this.position.y - this.height/2,
        }
        if (this.line_circle_intersection(line1, c) ||
            this.line_circle_intersection(line4, c) ||
            this.line_circle_intersection(line2, c) ||
            this.line_circle_intersection(line3, c))
                return this.type + 1;
        return 0;
    }
}