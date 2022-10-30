import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import HashtagCollection from '../hashtag/collection';
import SubscribeCollection from './collection';

/**
 * checks if there is atleast one hashtag with tagname
 */
 const isTagNameExists = async (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.body.tagname;
    const hashtag = await HashtagCollection.findOne(tagname);
    if (!hashtag){
        res.status(404).json({
            error: 'there are no freets that contain this hashtag.'
        });
        return;
    }

    next();
}

const isHashtagSubscribed = async (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.body.tagname;
    const userId = (req.session.userId as string) ?? '';
    const subscribed = await SubscribeCollection.findOneByParticipants(userId,tagname);
    if(subscribed){
        res.status(405).json({
            error: "you are already subscribed to this hashtag."
        });
        return;
    }
    next();
}

const isHashtagNotSubscribed = async (req: Request, res: Response, next: NextFunction) => {
    const tagname = req.params.tagname;
    const userId = (req.session.userId as string) ?? '';
    const subscribed = await SubscribeCollection.findOneByParticipants(userId,tagname);
    if(!subscribed){
        res.status(404).json({
            error: "you are not subscribed to this hashtag."
        });
        return; 
    }
    next();
}

export{
    isTagNameExists,
    isHashtagNotSubscribed,
    isHashtagSubscribed
}