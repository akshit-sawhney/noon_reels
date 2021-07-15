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

module.exports = { createHashTagEntry };