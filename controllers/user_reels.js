const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../core/cosmos_configs");
const moment = require('moment');
const { createNotebook } = require('./notebooks');

const { endpoint, key, databaseId, userReelsContainerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(userReelsContainerId);

async function createUserReel(request) {
    const currentTimeStamp = moment().valueOf();
    if (request.notebook_id) {
        const createItem = {
            notebook_id: request.notebook_id,
            post_id: request.post_id,
            created_at: currentTimeStamp,
            updated_at: currentTimeStamp
        }
        const creationResponse = await container.items.create(createItem)
        return creationResponse;
    } else {
        const creationData = {
            "user_id": request.user_id,
            "notebook_name": request.notebook_name
        }
        const notebookCreationResponse = await createNotebook(creationData);
        console.log('here is the response: ', notebookCreationResponse.resource.id);
        const createItem = {
            notebook_id: notebookCreationResponse.resource.id,
            post_id: request.post_id,
            created_at: currentTimeStamp,
            updated_at: currentTimeStamp
        } 
        const creationResponse = await container.items.create(createItem)
        return creationResponse;
    }
}

async function getReelsByNotebookId(notebookId) {

    const querySpec = {
      query: `SELECT * FROM ${process.env.AZURE_COSMOS_USER_NOTES_CONTAINER_ID} ur WHERE  ur.notebook_id = @notebookId`,
      parameters: [
        {
          name: "@notebookId",
          value: notebookId
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

module.exports = { createUserReel, getReelsByNotebookId };