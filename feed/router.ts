import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetUtil from '../freet/util';


const router = express.Router();

/**
 * Get all the freets 
 *
 * @name GET /api/feed
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 * @throws {403} - If the user is not logged in
 */
router.get(
'/',
[
    userValidator.isUserLoggedIn
],
async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const freets = await FeedCollection.getFreets(userId);
    const response = await Promise.all(freets.map(async (x)=> await freetUtil.constructFreetResponse(x,userId)));
    res.status(200).json(response);
});

export {router as feedRouter};

