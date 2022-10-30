import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties of Subscribe
 */

// Type definition for Subscribe on the backend
export type MuteTopic = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    topic: string;
    dateCreated: Date
}

export type PopulatedMuteTopic= {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User;
    topic: string;
    dateCreated: Date
}

const MuteTopicSchema = new Schema<MuteTopic>({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    topic:{
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

const MuteTopicModel = model<MuteTopic>('MuteTopic', MuteTopicSchema);
export default MuteTopicModel;
