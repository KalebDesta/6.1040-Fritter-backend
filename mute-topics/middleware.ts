import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import MutedTopicsCollection from './collection';


/**
 * Checks if a topic is req.body exists
 */
 const isTopicMuted = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const mutedTopic = await MutedTopicsCollection.findOne(userId,req.body.topic);
    if (mutedTopic) {
      res.status(405).json({
        error: {
          topicIsMuted: `The topic is already muted.`
        }
      });
      return;
    }
  
    next();
  };
  
/**
 * Checks if a topic is req.params does not exists
 */
 const isTopicNotMuted = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const validFormat = Types.ObjectId.isValid(req.params.topic);
    const mutedTopic = validFormat ? await MutedTopicsCollection.findOne(userId,req.params.topic) : '';
    if (!mutedTopic) {
      res.status(404).json({
        error: {
          topicNotMuted: `the topic is not muted.`
        }
      });
      return;
    }
  
    next();
  };
  
  /**
   * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
   * spaces and not more than 140 characters
   */
  const isValidTopic = (req: Request, res: Response, next: NextFunction) => {
    const {topic} = req.body as {topic: string};
    if (!topic.trim()) {
      res.status(400).json({
        error: 'Freet content must be at least one character long.'
      });
      return;
    }
    next();
  };
  
    /**
   * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
   * spaces and not more than 140 characters
   */
     const isValidTopicParams = (req: Request, res: Response, next: NextFunction) => {
        const topic = req.params.topic;
        if (!topic.trim()) {
          res.status(400).json({
            error: 'Freet content must be at least one character long.'
          });
          return;
        }
        next();
      };
   
export{
    isTopicMuted,
    isValidTopic,
    isTopicNotMuted,
    isValidTopicParams
}