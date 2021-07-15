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

module.exports = { createNoonReel };