import type PollOption from './PollOption';

/**
 * This object contains information about a poll.
 */
export default interface Poll {
  /**
   *  	Unique poll identifier
   */
  id: string;
  /**
   * Poll question, 1-255 characters
   */
  question: string;
  /**
   * List of poll options
   */
  options: PollOption[];
  /**
   * True, if the poll is closed
   */
  is_closed: boolean;
}
