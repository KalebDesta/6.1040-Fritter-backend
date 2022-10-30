import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow} from './model';

// Update this if you add a property to the Freet type!
type FollowResponse = {
    _id: string;
    follower: string;
    followed: string;
    dateCreated: string
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

  
