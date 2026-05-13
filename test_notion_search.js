const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "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" });

async function run() {
  try {
    console.log("Searching for databases...");
    const response = await notion.search({
      filter: { value: "data_source", property: "object" }
    });
    
    if (response.results.length === 0) {
      console.log("No databases found. Make sure you shared a DATABASE, not just a PAGE.");
    } else {
      response.results.forEach(db => {
        console.log(`Found Database: "${db.title?.[0]?.plain_text}" | ID: ${db.id}`);
      });
    }
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
