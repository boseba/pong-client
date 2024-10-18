import { PlayerType } from "../../enums/player-type.enum";
import { Position } from "../../enums/position.enum";
import { Size } from "../../interfaces/size.interface";
import { Guid } from "../../shared/models/guid.model";
import { ComputerPaddle, OpponentPaddle, Paddle, PlayerPaddle } from "./models.exports";

export abstract class Player {
  id: Guid;
  paddle!: Paddle;
  name: string;
  score: number = 0;
  type: PlayerType;


  constructor(name: string, type: PlayerType) {
    this.id = Guid.create();
    this.name = name;
    this.type = type;
  }
}

export class GuestPlayer extends Player {

  constructor(name: string, type: PlayerType = PlayerType.Opponent, gameArea: Size) {
    super(name, type);

    if(type === PlayerType.Opponent) {
      this.paddle = new OpponentPaddle(Position.Right, gameArea);
    } else if (type === PlayerType.Player) {
      this.paddle = new PlayerPaddle( Position.Right, gameArea);     
    }
  }
}

export class ComputerPlayer extends GuestPlayer {
  reactionLatency: number = 0.7;
  reactionDelay: number = 0.02;
  targetOffset: number = 0;
  maxOffset: number = 50;
  offsetChangeFrequency: number = 5;
  lastOffsetChangeTime: number = 0;
  reactionTime: number = 0;

  override paddle: ComputerPaddle;

  constructor(gameArea: Size) {
    super('Computer', PlayerType.Computer, gameArea);

    this.paddle = new ComputerPaddle(gameArea); 
  }
}



export class HostPlayer extends Player {
  constructor(name: string, type: PlayerType = PlayerType.Player, gameArea: Size) {
    super(name, type);

    if(type === PlayerType.Opponent) {
      this.paddle = new OpponentPaddle(Position.Left, gameArea);
    } else if (type === PlayerType.Player) {
      this.paddle = new PlayerPaddle( Position.Left, gameArea);     
    }
  }
}