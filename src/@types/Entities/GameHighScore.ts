import type User from './User';

export default interface GameHighScore {
  /** Position in high score table for the game */
  position?: number;
  /** User */
  user?: User;
  /** Score */
  score?: number;
}
