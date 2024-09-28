
"use client"

import { Brick, PSize } from "../types/component"

interface BricksProps {
    brick: PSize;
}

export default function Bricks({brick}: BricksProps){

    return (
        <div
        style={{
            position: 'absolute',
            left: `${brick.position.x}%`,
            top: `${brick.position.y}%`,
            width: `${brick.width}%`, 
            height: `${brick.height}%`,
            backgroundColor: `${brick.color}`,
        }}
        ></div>
    )

}