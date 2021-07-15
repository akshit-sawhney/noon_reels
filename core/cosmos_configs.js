const config = {
    endpoint: process.env.AZURE_COSMOS_ENDPOINT,
    key: process.env.AZURE_COSMOS_PRIMARY_KEY,
    databaseId: process.env.AZURE_COSMOS_DATABASE_ID,
    containerId: process.env.AZURE_COSMOS_CONTAINER_ID,
    partitionKey: { kind: "Hash", paths: [process.env.AZURE_COSMOS_PARTITION_KEY] }
  };
  
  module.exports = config;