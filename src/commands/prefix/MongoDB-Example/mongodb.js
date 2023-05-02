const { database } = require("../../../../index.js"); // we import our database from where we first initialized it

/**
 * same with this `db` object
 * @param {database} db
 */

async function run(db) {
  const collection = db.collection("COLLECTION_NAME");
  // now that we've got our collection, we can play around with it.
  // for more information on how it works, visit https://www.mongodb.com/docs/drivers/node/current/

  // some basic examples:

  // here we insert a new document with these as its values.
  const foo123 = { name: "iPhone X", price: 999 };
  await collection.insertOne(foo123);

  // ...

  // here, we update a document.
  const foo = { name: "iPhone X" };
  const bar = { $set: { price: 899 } };
  collection.updateOne(foo, bar);

  // ...

  //here, we find a document.
  const bar123 = { name: "iPhone X" };
  collection.findOne(bar123);
}

module.exports = {
  name: "db",
  aliases: ["db"],
  cooldown: 5000,
  run: async (client, message, args, prefix, db) => {
    await run(db);
  },
};
