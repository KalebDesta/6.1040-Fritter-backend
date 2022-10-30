import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SubscribeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as subscribeValidator from './middleware';
// import * as util from './util';


const router = express.Router();

/**
 * Get all the tagnames of the Hashtags you are subscribed to.
 *
 * @name GET /api/subscribe
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
        const userId = (req.session.userId as string) ?? '';
        const subscribes = await SubscribeCollection.findAllBySubscriber(userId);
        const tagnames = [];
        for (const sub of subscribes){
            tagnames.push(sub.hashtagName);
        }
        res.status(200).json({
            subscribedTo:tagnames
        });
    });

/**
 * Create a new subscribe.
 *
 * @name POST /api/subscribe
 *
 * @param {string} tagname - The tagname of the hashtag they want to follow
 * @return {SubscribeResponse} - The created subscribe
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the hashtag is not found
 * @throws {405} - If the user is already subscribed to the hashtag 
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      subscribeValidator.isTagNameExists,
      subscribeValidator.isHashtagSubscribed
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const other = await SubscribeCollection.addOne(userId,req.body.tagname);
  
      res.status(201).json({
        message: 'Your subscribe was created successfully.',
      });
    }
  );
  
  /**
   * Delete a subscribe
   *
   * @name DELETE /api/subscribe/:tagname
   *
   * @param {string} tagname - the hashtag with tagname to unsubscribe from
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in 
   * @throws {404} - If the user does not follow the hashtag
   */
  router.delete(
    '/:tagname?',
    [
      userValidator.isUserLoggedIn,
      subscribeValidator.isHashtagNotSubscribed,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      await SubscribeCollection.deleteOne(userId,req.params.tagname);
      res.status(200).json({
        message: 'Your subscription was deleted successfully.'
      });
    }
  );
  
  export {router as subscribeRouter};