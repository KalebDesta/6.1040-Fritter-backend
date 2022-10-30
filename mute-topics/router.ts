import type {Request, Response} from 'express';
import express from 'express';
import MuteTopicsCollection from './collection';
import * as userValidator from '../user/middleware';
import * as muteTopicValidator from './middleware';

const router = express.Router();

/**
 * Get all the topics the users has muted.
 *
 * @name GET /api/mute-topics
 *
 * @return {Array<string>} - The array of muted topics
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const mutedTopics = await MuteTopicsCollection.findAllByUser(userId);
    const topics = [];
    for (const muted of mutedTopics){
      topics.push( muted.topic);
    }
    res.status(200).json({
      mutedTopics:topics
    });
  }

);

/**
 * Create a new mutedTopic.
 *
 * @name POST /api/mute-topics
 *
 * @param {string} topic - The topic they want to mute
 * @throws {403} - If the user is not logged in
 * @throws {400} - if the topic is empty or a stream of empty spaces
 * @throws {405} - If the user has already muted the topic 
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      muteTopicValidator.isValidTopic,
      muteTopicValidator.isTopicMuted
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const follow = await MuteTopicsCollection.addOne(userId, req.body.topic);
  
      res.status(201).json({
        message: 'the topic has been muted successfully.',
      });
    }
  );
  
  /**
   * Delete a mute topic
   *
   * @name DELETE /api/mute-topics/:topic
   *
   * @param {string} topic - the topic to unmute
   * @return {string} - A success message
   * @throws {403} if the user is not logged in
   * @throws {404} if the topic does not exist with in the muted topics
   */
  router.delete(
    '/:topic?',
    [
      userValidator.isUserLoggedIn,
      muteTopicValidator.isValidTopicParams,
      muteTopicValidator.isTopicNotMuted
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const deleted = await MuteTopicsCollection.deleteOne(userId,req.params.topic);
      res.status(200).json({
        message: 'The topic was deleted successfully.'
      });
    }
  );
  
  export {router as muteTopicsRouter};