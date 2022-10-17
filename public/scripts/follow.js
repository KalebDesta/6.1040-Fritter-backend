function followUser(fields) {
    fetch(`/api/follow`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function unfollowUser(fields) {
    fetch(`/api/follow/${fields.username}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }

// export {unfollowUser,followUser}