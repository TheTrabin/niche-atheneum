const db = require("../data/dbConfig.js");
const { update } = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  remove,
  put
};

function find() {
  return db("users").select("id", "username").orderBy("id");
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("users").where({ id }).first();
}

function remove(id) {
  return db('users').where('id', id).del();
}

function put(id, changes) {
  return db("users")
  .where('id', id)
  .update(changes)
  .then((count) => (count > 0 ? get(id) : null));
}