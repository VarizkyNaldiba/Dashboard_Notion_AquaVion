const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "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" });

async function run() {
  try {
    const res = await notion.databases.query({ database_id: "243b3b0c47e24a7d9f41416a774fcab1" });
    console.log("SUCCESS:", res.results.length, "items found");
    if(res.results.length > 0) {
      console.log("First item properties:", JSON.stringify(res.results[0].properties, null, 2));
    }
  } catch (err) {
    console.error("ERROR:", err.body || err.message);
  }
}
run();
