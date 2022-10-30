function muteTopic(fields) {
    fetch(`/api/mute-topics`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function unmuteTopic(fields) {
    fetch(`/api/mute-topics/${fields.topic}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function getMutedTopics(fields) {
    fetch(`/api/mute-topics/`,{method:'GET'})
        .then(showResponse)
        .catch(showResponse);
}