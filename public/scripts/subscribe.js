function subscribeHashtag(fields) {
    fetch(`/api/subscribe`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function unsubscribeHashtag(fields) {
    fetch(`/api/subscribe/${fields.tagname}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function getSubscribed(fields) {
    fetch(`/api/subscribe/`,{method:'GET'})
        .then(showResponse)
        .catch(showResponse);
}