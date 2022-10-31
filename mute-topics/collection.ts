import type {HydratedDocument, Types} from 'mongoose';
import type {MuteTopic} from './model';
import SubscribeCollection from '../subscribe/collection';
import MuteTopicModel from './model';

/**
 * This files contains a class that has the functionality to explore mutetopics
 * stored in MongoDB
 */
 class MuteTopicsCollection {
   /**
     * Add a topic to the collection and remove a subscription to a topic
     * 
     * @param {Types.ObjectId} userId - the id of the user muting a topic
     * @param {string} topic - The topic to be muted 
     * @return {Promise<HydratedDocument<MuteTopic>>} - The newly created mutetopic
     */
    static async addOne(userId: Types.ObjectId | string, topic: string): Promise<HydratedDocument<MuteTopic>> {
        const date = new Date();
        const muteTopic = new MuteTopicModel({
        userId,
        topic,
        dateCreated: date,
        });
        await muteTopic.save(); // Saves freet to MongoDB
        const subscribed = await SubscribeCollection.findAllBySubscriber(userId);
        for(const sub of subscribed){
            const tagname = sub.hashtagName;
            if (tagname === topic){
                SubscribeCollection.deleteOne(userId,tagname);
            }
        }
        return muteTopic.populate('userId');
    }

    /**
      * Find a muteTopic by userId and topic
      * 
      * @param {Types.ObjectId} userId - the id of the user muting a topic
      * @param {string} topic - The topic to be muted 
      * @return {Promise<HydratedDocument<MuteTopic>> | Promise<null>} - The newly created mutetopic
      */
    static async findOne(userId: Types.ObjectId | string, topic:string): Promise<HydratedDocument<MuteTopic>> {
        return await MuteTopicModel.findOne({userId: userId, topic:topic}).populate('userId');
    }


    /**
      * Get all the MuteTopics in by given user
      * 
      * @param {string} userId - The id of the user
      * @return {Promise<HydratedDocument<MuteTopic>[]>} - An array of all of the MuteTopics
      */
    static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<MuteTopic>>> {
        return await MuteTopicModel.find({userId: userId}).populate('userId');
    }
    
    /**
     * Get all the MuteTopics with a given topic
     * 
     * @param {string} topic - the name of the topic they want to mute 
     * @return {Promise<HydratedDocument<MuteTopic>[]>} - An array of all of the subscribes
     */
    static async findAllByHashtagName(topic:string): Promise<Array<HydratedDocument<MuteTopic>>> {
        return await MuteTopicModel.find({topic:topic}).populate('userId');
    }

    /**
     * Delete a muteTopic with given userId and topic.
     *
     * @param {string} userId - The id of the user
     * @param {string} topic - the topic they want to unmute  
     * @return {Promise<Boolean>} - true if the mute has been deleted, false otherwise
     */
    static async deleteOne(userId: Types.ObjectId|string, topic: string): Promise<boolean> {
        const muteTopic = await MuteTopicModel.deleteOne({userId: userId, topic:topic}).populate('userId');
        return muteTopic !== null;
    }

}

export default MuteTopicsCollection;
