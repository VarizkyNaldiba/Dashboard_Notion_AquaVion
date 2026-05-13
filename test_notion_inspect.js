const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "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" });

async function run() {
  try {
    const res = await notion.dataSources.query({ data_source_id: "24f5e049-bad1-4c99-8b28-d3ae190fe923" });
    if(res.results.length > 0) {
      console.log("PROPERTIES AVAILABLE:");
      console.log(Object.keys(res.results[0].properties));
      console.log(JSON.stringify(res.results[0].properties, null, 2));
    }
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
