/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */
function viewFreetsWithHashtag(fields) {
    fetch(`/api/hashtags?tagname=${fields.tagname}`)
        .then(showResponse)
        .catch(showResponse);
}

function createHashtag(fields) {
    fetch('/api/hashtags', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}
  
function deleteHashtag(fields) {
    fetch(`/api/hashtags/${fields.freetId}`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}  
