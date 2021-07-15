const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../core/cosmos_configs");
const moment = require('moment');

const { endpoint, key, databaseId, notebooksContainerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(notebooksContainerId);

async function createNotebook(request) {
    const currentTimeStamp = moment().valueOf();
    const createItem = {
        notebook_name: request.notebook_name,
        user_id: request.user_id,
        created_at: currentTimeStamp,
        updated_at: currentTimeStamp
    }
    const creationResponse = await container.items.create(createItem)
    return creationResponse;
}

module.exports = { createNotebook };