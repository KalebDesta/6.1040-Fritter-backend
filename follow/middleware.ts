import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from './collection';

/**
 * Checks if a follow with followId is req.params exists
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.username);
  const userId = (req.session.userId as string) ?? '';
  const otherUser = await UserCollection.findOneByUsername(req.params.username);
  const follow = await FollowCollection.findOneByParticipants(userId,otherUser._id);
  if (!follow) {
    res.status(405).json({
      error: {
        followNotFound: `You do not currently follow ${req.params.username}.`
      }
    });
    return;
  }

  next();
};

  /**
   * check if an object to be followed exists 
   */
  const isObjectExists = async (req: Request, res: Response, next: NextFunction) => {
    const other= await UserCollection.findOneByUsername(req.body.username)
    if(!other){
        res.status(404).json({
            error: 'the user does not exist'
        });
      return;
    }  

    next();
  }

  /**
   * checks if an object is already followed by a user
   */
  const isObjectFollowed = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.username);
    const userId = (req.session.userId as string) ?? '';
    const otherUser = await UserCollection.findOneByUsername(req.body.username);
    const follow = await FollowCollection.findOneByParticipants(userId,otherUser._id);
    if (follow) {
      res.status(405).json({
        error: {
          followNotFound: `the user ${req.body.username} is already followed.`
        }
      });
      return;
    }
  
    next();
  }
 
  const isObjectExistsUnfollow = async (req: Request, res: Response, next: NextFunction) => {
    const other= await UserCollection.findOneByUsername(req.params.username)
    if(!other){
        res.status(404).json({
            error: 'the user does not exist'
        });
      return;
    }  

    next();

  }
  

export {
    isFollowExists,
    isObjectFollowed,
    isObjectExists,
    isObjectExistsUnfollow
}