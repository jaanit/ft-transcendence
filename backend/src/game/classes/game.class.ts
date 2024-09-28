import { Ball } from './ball.class';
import { Paddle, Brick } from './paddle.class';
import { GameConfig, key } from '../interfaces/utils.interface';

export class Game {
  gameId: number;
  playerId1: string;
  playerId2?: string;
  socket1: string;
  socket2?: string;
  playerAI: boolean;
  world: { h: number; w: number };
  ball: Array<Ball>;
  // ball: Ball;
  paddle: [Paddle, Paddle];
  bricks: Array<Brick>;
  score: { p1: number; p2: number };
  keysPressed: Set<string>;
  sec: number;
  winner: string;
  time: Date;
  start: [boolean, boolean];
  status: string;
  createAt: Date;
  startedAt: Date;
  updatedAt: Date;
  constructor() {
    this.gameId = Math.floor(Math.random() * 1000);
    this.world = { h: 1000, w: 600 };
    this.ball = [];
    // this.ball = new Ball(1000, 500, 20, 100);
    this.paddle = [new Paddle(40, 250, 150, 30), new Paddle(970, 250, 150, 30)];
    this.bricks = [];
    this.score = { p1: 0, p2: 0 };
    this.keysPressed = new Set();
    this.sec = -1;
    this.time = new Date();
    this.start = [false, false];
  }
  get_data(player: number): GameConfig {
    const data: GameConfig = {
      player: player,
      ball: this.ball.map((value) =>
        value.get_data(this.world.h, this.world.w, 0xffffff),
      ),
      paddle1: this.paddle[0].get_data(this.world.h, this.world.w, 0xffffff),
      paddle2: this.paddle[1].get_data(this.world.h, this.world.w, 0xffffff),
      bricks: Array.from(this.bricks).map((value) =>
        value.get_data(this.world.h, this.world.w, 0xffffff),
      ),
      score: this.score,
      sec: this.sec,
    };
    return data;
  }
  bot() {
    if (this.ball.length) {
      if (this.ball[0].position.y < this.paddle[1].position.y)
        this.paddle[1].move_left(4, 0);
      if (this.ball[0].position.y > this.paddle[1].position.y)
        this.paddle[1].move_right(4, 600);
    } else {
      if (this.world.w / 2 < this.paddle[1].position.y)
        this.paddle[1].move_left(4, 0);
      if (this.world.w / 2 > this.paddle[1].position.y)
        this.paddle[1].move_right(4, 600);
    }
  }
  check_keys(keys: key, player: number) {
    this.paddle[player].rotate(0);

    // this.start[player] = keys.start
    if (keys.left) this.paddle[player].move_left(4, 0);
    if (keys.right) this.paddle[player].move_right(4, 600);
    if (keys.rotate_pos) this.paddle[player].rotate(Math.PI / 6);
    else if (keys.rotate_neg) this.paddle[player].rotate(-Math.PI / 6);
  }
  check_intersection() {
    if (this.ball.length) {
      this.paddle[0].check_intersection(this.ball[0], -1);
      this.paddle[1].check_intersection(this.ball[0], 1);
      for (let i = 0; i < this.bricks.length; i++) {
        const type = this.bricks[i].check_intersect(this.ball[0]);
        if (type) this.bricks.pop();

        if (type == 1) {
          if (this.ball[0].dx > 0) this.paddle[0].changeScale(1.3);
          else this.paddle[1].changeScale(1.3);
        }
        if (type == 2) {
          if (this.ball[0].dx > 0) this.paddle[0].changeScale(0.7);
          else this.paddle[1].changeScale(0.7);
        }
        if (type == 3) {
          this.ball[0].change_scale(1.3);
        }
        if (type == 4) {
          this.ball[0].change_scale(0.7);
        }
        if (type == 5) this.ball[0].setSpeed(8);
        if (type == 6) this.ball[0].setSpeed(10);
      }
    }
  }
  update() {
    if (this.status == 'finished') {
      return;
    }
    if (!this.start[0] || !this.start[1]) {
      this.time = new Date();
      return;
    }
    if (!this.ball.length) {
      const now = new Date();
      this.sec = Math.floor((now.getTime() - this.time.getTime()) / 1000);
      if (this.sec >= 3) {
        this.ball.push(new Ball(1000, 500, 20, 100));
        // this.ball = (new Ball(1000, 500, 20, 100))
        this.sec = -1;
      }
    }
    this.check_intersection();
    if (this.playerAI) {
      this.bot();
    }
    if (this.bricks.length < 1 && Math.floor(Math.random() * 1000) == 0)
      this.bricks.push(new Brick());
    if (this.ball.length) {
      if (this.ball[0].out.left || this.ball[0].out.right) {
        this.score.p1 += Number(this.ball[0].out.right);
        this.score.p2 += Number(this.ball[0].out.left);
        this.ball.pop();
        this.time = new Date();
      } else this.ball[0].update();
    }
    if (
      (this.score.p1 >= 10 || this.score.p2 >= 10) &&
      Math.abs(this.score.p1 - this.score.p2) > 1
    ) {
      this.status = 'finished';
      this.winner =
        this.score.p1 > this.score.p2 ? this.playerId1 : this.playerId2;
    }
  }
}
