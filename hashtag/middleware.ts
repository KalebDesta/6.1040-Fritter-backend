import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import HashtagCollection from './collection';

/**
 * Checks if a freet with freetId is req.body exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.freetId);
    const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
    if (!freet) {
      res.status(404).json({
        error: {
          freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
        }
      });
      return;
    }
  
    next();
  };


/**
 * checks if there is atleast one hashtag with tagname
 */
const isTagNameExists = async (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.query.tagname as string;
    const hashtag = await HashtagCollection.findOne(tagname);
    if (!hashtag){
        res.status(404).json({
            error: 'there are no freets that contain this hashtag.'
        });
        return;
    }

    next();
}

/**
 * checks if the tagname in params is valid
 */
const isValidParamsTagname = (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.query.tagname as string;
    if (!tagname.trim()) {
      res.status(400).json({
        error: 'tagname must be at least one character long.'
      });
      return;
    }

    next();
};

/**
 * checks if the tagname in body is valid
 */
const isValidBodyTagName = (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.body.tagname;
    if (!tagname.trim()) {
      res.status(400).json({
        error: 'tagname must be at least one character long.'
      });
      return;
    }
  
    if (tagname.length > 50) {
      res.status(413).json({
        error: 'tagname must be no more than 50 characters.'
      });
      return;
    }
  
    next();
  };

/**
 * checks if a hashtag is in a freet
 */
const isHashtagInFreet = async (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.body.tagname;
    const freetId = req.params.freetId;
    const hashtag = await HashtagCollection.findOneByTagAndFreet(freetId,tagname);
    if (!hashtag){
        res.status(406).json({
            error: "the hashtag is not contained within this freet."
        });
        return;
    }

    next();
};


/**
 * checks if a hashtag is in a freet
 */
 const isHashtagExists = async (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.body.tagname as string;
    const freetId = req.body.freetId;
    const hashtag = await HashtagCollection.findOneByTagAndFreet(freetId,tagname);
    if (hashtag){
        res.status(406).json({
            error: "the hashtag is already contained within this freet."
        });
        return;
    }

    next();
};

/*
*checks if the author is the one making the request
*/
const isValidBodyModifier =async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FreetCollection.findOne(req.body.freetId);
    const userId = req.session.userId ;
    if(freet.authorId!==userId){
        res.status(415).json({
            error: 'only the author of a freet can add a hashtag to a freet!'
        });
    }    

}
  export {
    isValidBodyTagName,
    isValidParamsTagname,
    isTagNameExists,
    isFreetExists,
    isHashtagInFreet,
    isHashtagExists,
    isValidBodyModifier
  }