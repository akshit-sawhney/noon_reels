const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../core/cosmos_configs");
const dbContext = require("../model/cosmos/core");

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

async function createNoonReel(item) {
container.items.create(item)
      .then(res => {
       // Do nothing
      })
      .catch(err => {
        // Do nothing
      });
}

async function getReels(userId) {

  const querySpec = {
    query: `SELECT * FROM ${process.env.AZURE_COSMOS_CONTAINER_ID} nr WHERE  nr.user_id = @userId`,
    parameters: [
      {
        name: "@userId",
        value: userId
      }
    ]
  };
  try {
    const {resources: result} = await container.items.query(querySpec).fetchAll();
    return {resources: result}
  } catch (error) {
    throw new Error('Error in getting data from cosmos');
  }
}

module.exports = { createNoonReel, getReels };