
export interface Position
{
    x: number
    y: number
}

export interface PSize {
	width: number
	height: number
    texture?: string
    color: string
    position: Position
    scale: number
    rotation: number
    
}

export interface GameConfig {
	player: number
	bricks: Array<PSize>
	ball: Array<PSize>
	paddle1: PSize
	paddle2: PSize
	score: {p1: number, p2: number}
	sec: number
	
}

export interface key
{
	start: boolean
	left : boolean
	right : boolean
	rotate_pos : boolean
	rotate_neg : boolean
}

export interface Data{
	mode: string
	dimension: string
	map: string
	option: string
}