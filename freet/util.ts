import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet, ViewerTypes} from '../freet/model';
import FollowCollection from '../follow/collection';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  anonymousTo: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = async (freet: HydratedDocument<Freet>,reqUserId:string|Types.ObjectId): Promise<FreetResponse> => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  let {username} = freetCopy.authorId;
  const isFollowing = await FollowCollection.findOneByParticipants(reqUserId, freet.authorId);
  const isAuthor = (reqUserId.toString() === freet.authorId._id.toString())
  console.log(freetCopy);
  delete freetCopy.authorId;
  switch (freetCopy.anonymousTo){
    case "None":
      break;
    case "Followers":
      console.log(isFollowing);
      if (isFollowing){
        console.log("following")
        console.log()
        username = "Anonymous User";
      }
      break;
    case "NonFollowers":
      console.log(isFollowing,isAuthor);
      if (!isFollowing && !isAuthor){
        console.log("not following")
        username = "Anonymous User";
      }
      break;
    case "All":
      console.log(freet.authorId.toString(),reqUserId.toString());
      if (!isAuthor){
        console.log("all")
        username = "Anonymous User";
      }
      break;
  }
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    anonymousTo: freetCopy.anonymousTo,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified)
  };
};

export {
  constructFreetResponse
};
