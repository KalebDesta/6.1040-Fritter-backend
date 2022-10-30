import type {HydratedDocument, Types} from 'mongoose';
import type {Hashtag} from './model';
import HashtagModel from './model';

/**
 * This file contains a class with functionality to interact with hashtags stored
 * in MongoDB, including adding, finding, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class HashtagCollection {

  /**
   * add a hashtag to a post
   * 
   * @param {string} freetId - The id of the freet associated with the hashtag
   * @param {string} tagname - The name of the hashtag
   * @return {Promise<HydratedDocument<Hashtag>>} - The newly created hashtag
   */
  static async addOne(freetId:Types.ObjectId | string, tagname:string): Promise<HydratedDocument<Hashtag>> {
    const hashtag = new HashtagModel({
      tagname,
      freetId,
    });
    await hashtag.save(); // Saves the hashtag to MongoDB
    return hashtag.populate('freetId');
  }
  /**
   * find a hashtag with the tagname
   * 
   * @param {string} tagname - The name of the hashtag
   * @returns {Promise<HydratedDocument<Hashtag>>} - returns a hashtag with tagname 
   */
  static async findOne(tagname:string):Promise<HydratedDocument<Hashtag>>{
    return await HashtagModel.findOne({tagname:tagname}).populate('freetId');
  }

  /**
   * find a hashtag with the tagname and freetId
   * 
   * @param {string} tagname - The name of the hashtag
   * @param {string} freetId - The id of the freet associated with the hashtag
   * @returns {Promise<HydratedDocument<Hashtag>>} - returns a hashtag with tagname 
   */
  static async findOneByTagAndFreet(freetId:Types.ObjectId | string,tagname:string):Promise<HydratedDocument<Hashtag>>{
    return await HashtagModel.findOne({tagname:tagname, freetId: freetId}).populate('freetId');
  }


  /**
   * get all the hashtags inserted into a freet
   * 
   * @param {string} freetId - The id of the freet
   * @return {Promise<Array<HydratedDocument<Hashtag>>>} - an array of hashtags on the freet
   */
  static async findAllInFreet(freetId:Types.ObjectId | string):Promise<Array<HydratedDocument<Hashtag>>>{
    return await HashtagModel.find({freetId: freetId}).populate('freetId');
  }
  
  /**
   * get all freets that contain a hashtag
   * 
   * @param {string} tagname - The name of the hashtag
   * @return {Promise<Array<HydratedDocument<Hashtag>>>} - an array of hashtags that contain the tagname
   */
  static async findAllByTagname(tagname:string):Promise<Array<HydratedDocument<Hashtag>>>{
    const hashtags = await HashtagModel.find({tagname: tagname}).populate('freetId');
    return hashtags;
  }

  /**
   * delete a hashtag from a given freet with freetId
   * 
   * @param {string} tagname - the name of the hashtag 
   * @param {string} freetId - The id of the freet
   * @returns {Promise<boolean>} - a boolean asserting that the hashtag has been deleted
   */
  static async deleteOne(freetId:Types.ObjectId|string, tagname:string): Promise<boolean> {
      const hashtag = await HashtagModel.deleteOne({tagname:tagname,freetId:freetId});
      return hashtag !== null;
    }

}

export default HashtagCollection