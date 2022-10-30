import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore follow
 * stored in MongoDB, including following, unfollowing.
 */
 class FollowCollection {
    /**
     * Add a follow to the collection
     *
     * @param {string} followerId - The id of the user who wants to follow
     * @param {string} followedId - The id of the user who will be followed
     * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
     */
    static async addOne(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const date = new Date();
        const follow = new FollowModel({
        followerId,
        followedId,
        dateCreated: date,
        });
        await follow.save(); // Saves freet to MongoDB
        return follow.populate(['followerId','followedId']);
    }
    /**
     * Find a follow by followId
     *
     * @param {string} followId - The id of the follow to find
     * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow with the given freetId, if any
     */
    static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        return FollowModel.findOne({_id: freetId}).populate(['followerId','followedId']);
    }


    /**
     * Get all the follows in by given user
     *
     * @param {string} username - The username of the following user
     * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
     */
    static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
        const user = await UserCollection.findOneByUsername(username);
        return FollowModel.find({followerId: user._id}).populate(['followerId','followedId']);
    }
    /**
     * get the follow object from both follower and followed
     * 
     * @param followerId - the id of the follower
     * @param followedId - the id of the followed
     * @returns a follow object
     */
    static async findOneByParticipants(followerId:Types.ObjectId | string, followedId:Types.ObjectId | string):Promise<HydratedDocument<Follow>>{
        const follow = await FollowModel.findOne({followerId: followerId, followedId: followedId})
        return follow
    }
    /**
     * Delete a follow with given followId.
     *
     * @param {string} followId - The freetId of follow to delete
     * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
     */
    static async deleteOne(followId: Types.ObjectId | string): Promise<boolean> {
        const follow = await FollowModel.deleteOne({_id: followId});
        return follow !== null;
    }

 }

 export default FollowCollection;