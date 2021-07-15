const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../core/cosmos_configs");
const dbContext = require("../model/cosmos/core");

const { endpoint, key, databaseId, hashtagContainerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(hashtagContainerId);

async function createHashTagEntry(item) {
container.items.create(item)
      .then(res => {
       // Do nothing
      })
      .catch(err => {
        // Do nothing
      });
}

async function getPostsByHashtag(hashtag) {
  console.log('here: ', hashtag);
  const querySpec = {
    query: `SELECT * FROM ${process.env.AZURE_COSMOS_HASHTAGS_CONTAINER_ID} ht WHERE  ht.hashtag = @hashtag`,
    parameters: [
      {
        name: "@hashtag",
        value: hashtag
      }
    ]
  };
  try {
    const {resources: result} = await container.items.query(querySpec).fetchAll();
    return {resources: result}
  } catch (error) {
    console.log('here: ', error);
    throw new Error('Error in getting data from cosmos');
  }
}


module.exports = { createHashTagEntry, getPostsByHashtag };