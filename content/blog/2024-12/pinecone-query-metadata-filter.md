---
title: "How to filter Pinecone records by metadata"
date: 2024-12-03
tags:
  - pinecone
  - snippets
url: blog/pinecone-query-metadata-filter
---

Sometime you might want to query records in [Pinecone](https://www.pinecone.io/) based on metadata.

For example, you want to retrieve all the records for a specific URL similar to how we do the SQL query.

<!--more-->

We can achieve this by using **filter** during querying. Here is how to do it

## Javascript
```js
import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Pinecone with your API key
const pineconeClient = new Pinecone({ apiKey: "YOUR_API_KEY" });

// Reference: How to target an index 👉 https://docs.pinecone.io/guides/data/target-an-index
const pineconeIndex = pineconeClient.index("INDEX_NAME", "INDEX_HOST");

// Ensure your sample vector has the same dimension as your index.
// Tip: You can copy the dimension from any record in your index.
const sampleVector = [ 0.14, 0.16, 0.87 /* Add remaining values */, , 0.14, 0.16, 0.87];
// Define the namespace within the index. You can skip this and directly query on "pineconeIndex" if you're not using custom namespace
const namespace = pineconeIndex.namespace("YOUR_NAMESPACE");

try {
  // Perform a query on the Pinecone namespace
  const queryResponse = await namespace.query({
    vector: sampleVector,
    topK: 10, // Adjust topK based on your use case (up to 10,000). Note the 4MB limit for query results.
    includeMetadata: true, // Include metadata in the results
    filter: {
      url: { $eq: "https://example.com" }, // Apply a filter condition
    },
  });

  console.log("Query Response:", queryResponse);
} catch (error) {
  console.error("Error querying Pinecone:", error);
}
```

The filtering condition is somewhat similar to MongoDB. You can refer to this [doc](https://docs.pinecone.io/guides/data/query-data#additional-filter-examples) regarding available filters


## References
[Pinecone.io Doc](https://docs.pinecone.io/guides/data/query-data#query-with-metadata-filters)
