import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';
import UserCollection from  '../user/collection';

const router = express.Router();

/**
 * Get all the usernames of the users you follow.
 *
 * @name GET /api/follow
 *
 * @return {Array<string>} - The created follow
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const follows = await FollowCollection.findAllByUsername(user.username);
    const followedUsers = [];
    for (const follow of follows){
      const otherUser = await UserCollection.findOneByUserId(follow.followedId);
      followedUsers.push( otherUser.username);
    }
    res.status(200).json({
      following:followedUsers
    });
  }

);

/**
 * Create a new follow.
 *
 * @name POST /api/follow
 *
 * @param {string} username - The userId of the user they want to follow
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the otherUserId is not found
 * @throws {405} - If the user already follows the object 
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      followValidator.isObjectExists,
      followValidator.isObjectFollowed
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const other = await UserCollection.findOneByUsername(req.body.username);
      const follow = await FollowCollection.addOne(userId, other._id);
  
      res.status(201).json({
        message: 'Your follow was created successfully.',
      });
    }
  );
  
  /**
   * Delete a freet
   *
   * @name DELETE /api/follow/:username?
   *
   * @param {string} username - the username to unfollow
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in 
   * @throws {404} - If `username` does not exist
   * @throws {405} - if the user does not follow the user with `username`
   */
  router.delete(
    '/:username?',
    [
      userValidator.isUserLoggedIn,
      followValidator.isObjectExistsUnfollow,
      followValidator.isFollowExists
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const other = await UserCollection.findOneByUsername(req.params.username)
      const follow = await FollowCollection.findOneByParticipants(userId, other._id);
      const deleted = await FollowCollection.deleteOne(follow._id);
      res.status(200).json({
        message: 'Your follow was deleted successfully.'
      });
    }
  );
  
  export {router as followRouter};