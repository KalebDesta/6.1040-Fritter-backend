import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Freet } from '../freet/model';

/**
 * This file defines the properties stored in a Hashtag
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Hashtag on the backend
export type Hashtag = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    tagname: string;
    freetId: Types.ObjectId;
  };

export type PopulatedHashtag = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    tagname: string;
    freetId: Freet;
  }
  
  // Mongoose schema definition for interfacing with a MongoDB table
  // Hashtags stored in this table will have these fields, with the
  // type given by the type property, inside MongoDB
  const HashtagSchema = new Schema({
    // The Hashtag's name
    tagname: {
      type: String,
      required: true
    },
    // The post the tag is associated with
    freetId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Freet"
    }
  });
  
  const HashtagModel = model<Hashtag>('Hashtag', HashtagSchema);
  export default HashtagModel;
  