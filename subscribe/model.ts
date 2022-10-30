import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Hashtag} from '../hashtag/model';
/**
 * This file defines the properties of Subscribe
 */

// Type definition for Subscribe on the backend
export type Subscribe = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    subscriberId: Types.ObjectId;
    hashtagName: string;
    dateCreated: Date
}

export type PopulatedSubscribe = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    subscriberId: User;
    hashtagName: string;
    dateCreated: Date
}

const SubscribeSchema = new Schema<Subscribe>({
    subscriberId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    hashtagName:{
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

const SubscribeModel = model<Subscribe>('Subscribe', SubscribeSchema);
export default SubscribeModel;