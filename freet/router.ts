import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = await Promise.all(authorFreets.map(async (x)=> await util.constructFreetResponse(x,userId)));
    const filteredRes = response.filter(x => x.author!=='Anonymous User');
    //if an anonymous freet shows up the author's identity is exposed
    res.status(200).json(filteredRes);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {string} anonymousTo - To whom the Freet will be anonymous to
 *                              ("None","Followers","NonFollowers","All")
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 * @throws {405} - if the anonymousTo is not a valid entry
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    freetValidator.isValidAnonymousRequest
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content,req.body.anonymousTo);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: await util.constructFreetResponse(freet,userId)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @param {string} anonymousTo - To whom the Freet will be anonymous to
 *                              ("None","Followers","NonFollowers","All")
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {405} - if the anonymousTo is not a valid entry 
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier 
  ],
  async(req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.body.anonymousTo !== undefined) {
      const userId = (req.session.userId as string) ?? '';
      freetValidator.isValidAnonymousRequest(req,res,undefined);
      const freet = await FreetCollection.updateAnonymity(req.params.freetId, req.body.anonymousTo)
      res.status(200).json({
        message: `Your freet's anonymity was updated successfully to:${req.body.anonymousTo}`,
        freet: await util.constructFreetResponse(freet,userId)
      });
    }else{
      next();
      return;
    }
  },[
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet content was updated successfully.',
      freet: await util.constructFreetResponse(freet,userId)
    });
  }
);

export {router as freetRouter};
