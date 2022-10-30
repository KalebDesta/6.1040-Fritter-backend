/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */
function viewFeed(fields) {
    fetch('/api/feed')
      .then(showResponse)
      .catch(showResponse);
  }