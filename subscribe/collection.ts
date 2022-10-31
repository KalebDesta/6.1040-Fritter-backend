import type {HydratedDocument, Types} from 'mongoose';
import type {Subscribe} from './model';
import SubscribeModel from './model';
import UserCollection from '../user/collection';
import { Hashtag } from 'hashtag/model';

/**
 * This files contains a class that has the functionality to explore subscribe
 * stored in MongoDB, including subscribing, unsubscribing.
 */
 class SubscribeCollection {
    /**
      * Add a subscribe to the collection
      * 
      * @param {string} subscriberId - The id of the user who wants to subscribe
      * @param {string} hashtagName - The name of the hashtag to be subscribed to
      * @return {Promise<HydratedDocument<Subscribe>>} - The newly created subscribe
      */
    static async addOne(subscriberId: Types.ObjectId|string, hashtagName: string): Promise<HydratedDocument<Subscribe>> {
        const date = new Date();
        const subscribe = new SubscribeModel({
        subscriberId,
        hashtagName,
        dateCreated: date,
        });
        await subscribe.save(); // Saves freet to MongoDB
        return subscribe.populate('subscriberId');
    }
    /**
      * Find a subscribe by subscriberId and tagname
      * 
      * @param {string} subscriberId - The id of the subscriber
      * @param {string} hashtagName - the name of the hashtag they want to subscribe to 
      * @return {Promise<HydratedDocument<Subscribe>> | Promise<null>} - The subscribe object, if any
      */
    static async findOne(subscriberId: Types.ObjectId | string, hashtagName:string): Promise<HydratedDocument<Subscribe>> {
        return await SubscribeModel.findOne({subscriberId: subscriberId, hashtagName:hashtagName}).populate('subscriberId');
    }


    /**
      * Get all the subscribes in by given user
      * 
      * @param {string} subscriberId - The id of the subscribing user
      * @return {Promise<HydratedDocument<Subscribe>[]>} - An array of all of the subscribes
      */
    static async findAllBySubscriber(subscriberId: Types.ObjectId | string): Promise<Array<HydratedDocument<Subscribe>>> {
        return await SubscribeModel.find({subscriberId: subscriberId}).populate('subscriberId');
    }
    
    /**
     * Get all the subscribes of a given hashtag
     * 
     * @param {string} hashtagName - the name of the hashtag they want to subscribe to 
     * @return {Promise<HydratedDocument<Subscribe>[]>} - An array of all of the subscribes
     */
    static async findAllByHashtagName(hashtagName:string): Promise<Array<HydratedDocument<Subscribe>>> {
        return await SubscribeModel.find({hashtagName:hashtagName}).populate('subscriberId');
    }

    /**
      * get the subscribe object with both subscriberId and hashtagName
      * 
      * @param subscriberId - The id of the subscribing user
      * @param hashtagName - the name of the hashtag they want to subscribe to 
      * @returns {Promise<HydratedDocument<Subscribe>>} a follow object
      */
    static async findOneByParticipants(subscriberId: Types.ObjectId|string, hashtagName: string):Promise<HydratedDocument<Subscribe>>{
        const subscribe = await SubscribeModel.findOne({subscriberId: subscriberId, hashtagName:hashtagName}).populate('subscriberId');
        return subscribe;
    }

    /**
     * Delete a susbcribe with given subscriberId and hashtagname.
     *
     * @param {string} subscriberId - The id of the subscriber
     * @param {string} hashtagName - the name of the hashtag they want to subscribe to 
     * @return {Promise<Boolean>} - true if the subscribe has been deleted, false otherwise
     */
    static async deleteOne(subscriberId: Types.ObjectId|string, hashtagName: string): Promise<boolean> {
        const subscribe = await SubscribeModel.deleteOne({subscriberId: subscriberId, hashtagName:hashtagName}).populate('subscriberId');
        return subscribe !== null;
    }

 }

 export default SubscribeCollection;