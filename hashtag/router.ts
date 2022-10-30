import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import HashtagCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as hashtagValidator from './middleware';
import * as freetUtils from '../freet/util';
import { Hashtag } from './model';

const router = express.Router();

/**
 * get all freets that contain tagname
 * 
 * @name GET /api/hashtags?tagname=HASHTAG
 * @param {tagname} - the name of the hashtag
 * @return {FreetResponse[]} - An array of freets that contain tagname
 * @throws {400} - if tagname is not given or is empty or a stream of empty spaces
 * @throws {404} - if a hashtag with `tagname` is not found
 * @throws {405} - if the hashtag is already added 
 */
router.get('/', 
    [
      hashtagValidator.isValidParamsTagname,
      hashtagValidator.isTagNameExists,
    ],
   async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';    
        const hashtags = await HashtagCollection.findAllByTagname(req.query.tagname as string);
        const freets = [];
        for (const hashtag of hashtags){
            freets.push(await FreetCollection.findOne(hashtag.freetId));
        }
        const response = await Promise.all(freets.map(async (x)=> await freetUtils.constructFreetResponse(x,userId)));
        res.status(200).json(response);
   });

/**
 * create a hashtag
 * 
 * @name POST /api/hashtags
 * 
 * @param {tagname} - the name of the hashtag
 * @param {freetId} - the Id of the post associated with the hashtag
 * @returns {Hashtag} - the hashtag object created 
 * 
 * @throws {403} - if the user is not logged in
 * @throws {400} - If the tagname empty or a stream of empty spaces
 * @throws {413} - If the tagname is more than 50 characters long
 * @throws {404} - If the freetId is invalid
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      hashtagValidator.isValidBodyTagName,
      hashtagValidator.isFreetExists,
      hashtagValidator.isValidBodyModifier,
      hashtagValidator.isHashtagExists
    ],
    async (req: Request, res: Response) =>{
        const hashtag = HashtagCollection.addOne(req.body.freetId,req.body.tagname); 
        res.status(200).json({
            message: `You have inserted ${req.body.tagname} as a hashtag.`
        });
    });
/**
 * delete a hashtag from a post
 * 
 * @name DELETE /api/hashtags/:freetId?
 * 
 * @param {tagname} - the name of the hashtag
 * @param {freetId} - the Id of the freet associated with the hashtag
 * 
 * @throws {403} - if the user is not logged in or if the user is not the author of the post
 * @throws {400} - If the tagname empty or a stream of empty spaces
 * @throws {413} - If the tagname is more than 50 characters long
 * @throws {404} - if the freetId is invalid 
 * @throws {406} - if the tagname is not contained with in post
 */
router.delete('/:freetId?',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetExists,
        freetValidator.isValidFreetModifier,
        hashtagValidator.isValidBodyTagName,
        hashtagValidator.isHashtagInFreet
    ],
    async (req: Request, res: Response) => {
        await HashtagCollection.deleteOne(req.body.freetId,req.body.tagname);
        res.status(200).json({
            message:`you have successfully removed ${req.body.tagname} hashtsg from your freet.`
        });
    });

export {router as hashtagRouter};