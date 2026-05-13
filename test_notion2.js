const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "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" });

async function run() {
  try {
    const res = await notion.dataSources.query({ data_source_id: "243b3b0c47e24a7d9f41416a774fcab1" }).catch(() => null);
    if (res) console.log("dataSources.query with data_source_id works", Object.keys(res));
    
    const res2 = await notion.dataSources.query({ database_id: "243b3b0c47e24a7d9f41416a774fcab1" }).catch(e => console.error(e.message));
    if (res2) console.log("dataSources.query with database_id works", Object.keys(res2));
    
    const res3 = await notion.search({
      query: '',
      filter: {
        value: 'database',
        property: 'object'
      }
    }).catch(() => null);
    if(res3) console.log("search works", res3.results);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
