import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Initialize Notion Client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET() {
  if (!process.env.NOTION_API_KEY || !databaseId) {
    return NextResponse.json(
      { error: "Notion API Key or Database ID is missing in environment variables." },
      { status: 500 }
    );
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
    });

    // We will parse the Notion response into a simpler format for the frontend
    // Note: The specific property names ('Status', 'Name', 'PIC', 'Level', 'Phase', 'Code WBS')
    // depend heavily on how the Notion database is structured.
    // If the names differ, we will need to adjust them.
    const tasks = response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props['Task']?.title?.[0]?.plain_text || props['Task Name']?.title?.[0]?.plain_text || props['Name']?.title?.[0]?.plain_text || 'Untitled',
        status: props['Status']?.status?.name || props['Status']?.select?.name || 'Not Started',
        person: props['Person']?.people?.map((p: any) => p.name) || 
                (props['PIC']?.rich_text?.[0]?.plain_text ? props['PIC'].rich_text[0].plain_text.split(',').map((s: string) => s.trim()) : ['Unassigned']),
        wbsCode: props['WBS Code']?.rich_text?.[0]?.plain_text || props['Code WBS']?.rich_text?.[0]?.plain_text || '-',
        phase: props['Phase']?.select?.name || '-',
        level: props['Level']?.select?.name || '-',
        progress: props['Progress']?.number || 0,
        priority: props['Priority']?.select?.name || 'Normal',
      };
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch from Notion" },
      { status: 500 }
    );
  }
}
