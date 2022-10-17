import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties of Follow
 */

// Type definition for Follow on the backend
export type Follow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    followerId: Types.ObjectId;
    followedId: Types.ObjectId;
    dateCreated: Date
}

export type PopulatedFollow = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    followerId: User;
    followedId: User;
    dateCreated: Date
  };

const FollowSchema = new Schema<Follow>({
    followerId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    followedId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;