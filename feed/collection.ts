import type {HydratedDocument, Types} from 'mongoose';
import { Freet } from '../freet/model';
import UserCollection from '../user/collection';
import HashtagCollection from "../hashtag/collection";
import FreetCollection from '../freet/collection';
import FollowCollection from '../follow/collection';
import SubscribeCollection from '../subscribe/collection';
import MuteTopicsCollection from '../mute-topics/collection';
import {MuteTopic} from '../mute-topics/model';

/**
 * This files contains a class that has the functionality to explore getting Freets
 * stored in MongoDB, 
 */
 class FeedCollection {
    /**
     * get the freets from followed users, subscribed hashtags which do not 
     * contain muted topics.
     * 
     * @param userId the id of the user requesting the feed
     * @returns an array of freets
     */
    static async getFreets(userId:Types.ObjectId|string):Promise<HydratedDocument<Freet>[]>{
        const user = await UserCollection.findOneByUserId(userId);
        const following = await FollowCollection.findAllByUsername(user.username);
        const subscribed = await SubscribeCollection.findAllBySubscriber(userId);
        let freets: HydratedDocument<Freet>[] = [];
        for (const follow of following){
            const otherUser = await UserCollection.findOneByUserId(follow.followedId);
            freets = freets.concat(await FreetCollection.findAllByUsername(otherUser.username));
        }
        for(const sub of subscribed){
            const tagname = sub.hashtagName;
            const hashtags = await HashtagCollection.findAllByTagname(tagname);
            for (const hashtag of hashtags){
                const addedFreet = await FreetCollection.findOne(hashtag.freetId);
                let alreadyThere = false;
                for(const freet of freets){
                    if(freet._id.toString() === addedFreet._id.toString()) alreadyThere = true;
                }
                if(!alreadyThere) freets.push(addedFreet);
            }
        }
        //check if a freet is already in the array
        const mutedTopics = await MuteTopicsCollection.findAllByUser(userId);
        const topics:string[] = [];
        for (const muted of mutedTopics){
          topics.push(muted.topic);
        } 
        freets = freets.filter((freet)=>{
            let viewable = true; 
            for(const topic of topics){
                if (freet.content.split(/\s+|\./) // split words based on whitespace or a '.'
                    .includes(topic)){  // check if words exists in the list of words){
                    viewable = false;
                    break;
                }
            }
            return viewable;
        })
        const sortedFreets = freets.sort((n1,n2)=>{
            if (n1.dateModified.getTime() > n2.dateModified.getTime()){
                return -1;
            }else if (n1.dateModified.getTime() < n2.dateModified.getTime()){
                return 1;
            }return 0;
        });
        return sortedFreets;
    }

 }

 export default FeedCollection;