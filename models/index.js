users= [{
    pseudo: 'morgane',
    password: 'evin'
},{
    pseudo: 'david',
    password: 'kassas'
}]

function addUser(pseudo, password, email) {
  users = users + [{
    pseudo: pseudo,
    password: password,
    email: email
  }]
}
module.exports = {users, addUser}