const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../core/cosmos_configs");
const dbContext = require("../model/cosmos/core");
const uuid = require('uuid');
const moment = require('moment');

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

async function createNoonReel(item) {
  return new Promise((resolve, reject) => {
    container.items.create(item)
      .then(res => {
       resolve(res);
      })
      .catch(err => {
        reject(err);
      });
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


async function updateLikesByReelId(reelId, likesValue) {
  const currentTimeStamp = moment().valueOf();
  const querySpec = {
    query: `SELECT * FROM ${process.env.AZURE_COSMOS_CONTAINER_ID} nr WHERE  nr.id = @reelId`,
    parameters: [
      {
        name: "@reelId",
        value: reelId
      }
    ]
  };
  try {
    const response = await container.items.query(querySpec).fetchAll();
    if (response.resources && response.resources.length) {
      const currentRow = Object.assign({}, response.resources[0]);
      const { id, user_id } = currentRow;
      currentRow.likes = likesValue;
      currentRow.updated_at = currentTimeStamp;
      const { resource: updatedItem } = await container
        .item(id, user_id)
        .replace(currentRow);
        return { resource: updatedItem };
    }
  } catch (error) {
    console.log('error; ', error);
    throw new Error('Error in getting data from cosmos');
  }
}

async function updateViewsByReelId(reelId, viewsValue) {
  const currentTimeStamp = moment().valueOf();
  const querySpec = {
    query: `SELECT * FROM ${process.env.AZURE_COSMOS_CONTAINER_ID} nr WHERE  nr.id = @reelId`,
    parameters: [
      {
        name: "@reelId",
        value: reelId
      }
    ]
  };
  try {
    const response = await container.items.query(querySpec).fetchAll();
    if (response.resources && response.resources.length) {
      const currentRow = Object.assign({}, response.resources[0]);
      const { id, user_id } = currentRow;
      currentRow.views = viewsValue;
      currentRow.updated_at = currentTimeStamp;
      const { resource: updatedItem } = await container
        .item(id, user_id)
        .replace(currentRow);
        return { resource: updatedItem };
    }
  } catch (error) {
    console.log('error; ', error);
    throw new Error('Error in getting data from cosmos');
  }
}

async function getReelsByIds(idList) {
  console.log('here: ', JSON.stringify(idList));
  const idsListString = JSON.stringify(idList);
  s3 = idsListString.substring(1,idsListString.length-1);
  const querySpec = {
    query: `SELECT * FROM ${process.env.AZURE_COSMOS_CONTAINER_ID} nr WHERE  nr.id IN (${s3})`,
    parameters: [
      {
        name: "@s3",
        value: s3
      }
    ]
  };
  try {
    const {resources: result} = await container.items.query(querySpec).fetchAll();
    return {resources: result}
  } catch (error) {
    console.log('error; ', error);
    throw new Error('Error in getting data from cosmos');
  }
}

module.exports = { createNoonReel, getReels, getReelsByIds, updateLikesByReelId, updateViewsByReelId };