const {Client} = require('@notionhq/client');

/**
* Notion API wrapper.
*/
class Notion {
  /**
  * Initialize the Notion client.
  */
  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  /**
   * Fetch a database from Notion page.
   * @param {string} title The title of the database.
   * @param {string} pageID The page ID.
  */
  async databaseGetID(title, pageID) {
    let dbID = null;

    const results = await this.client.search({
      'page_id': pageID,
    });

    results.results.forEach((result) => {
      if (result.object === 'database') {
        if (result.title[0].text.content === title) {
          dbID = result.id;
        }
      }
    });

    return dbID;
  }

  /**
   * Remove all non childrens from a Notion page.
   * @param {string} databaseID The database ID.
  */
  async databaseRemoveAllPages(databaseID) {
    const options = {
      database_id: databaseID,
    };
    const query = await this.client.databases.query({
      ...options,
    });

    const results = query.results;
    // eslint-disable-next-line guard-for-in
    for (const page in results) {
      if (results[page]['object'] === 'page') {
        await this.client.pages.update({
          'page_id': results[page].id,
          'archived': true,
        });
      }
    }
  }

  /**
   * Create a page (row) inside a specified database.
   * @param {string} databaseID The database ID.
   * @param {string} properties The properties of the page.
  */
  async databaseCreatePage(databaseID, properties) {
    const options = {
      'parent': {
        'database_id': databaseID,
      },
    };
    await this.client.pages.create({
      ...options,
      properties,
    });
  }

  /**
   * Update a page title.
   * @param {string} pageID The page ID.
   * @param {string} newTitle The new title of the page.
  */
  async pageTitleUpdate(pageID, newTitle) {
    const options = {
      page_id: pageID,
    };

    await this.client.pages.update({
      ...options,
      properties: {
        'title': [
          {
            'text': {
              'content': newTitle,
            },
          },
        ],
      },
    });
  }


  /**
  * Clear all the content of a Notion page.
  * @param {string} pageID - The Notion page ID of the page to clear.
  */
  async pageClearContents(pageID) {
    const pageChilds = await this.client.blocks.children.list({
      block_id: pageID,
    });

    for (const result in pageChilds.results) {
      if (Object.prototype.hasOwnProperty.call(pageChilds.results, result)) {
        const child = pageChilds.results[result];

        if (child.type.includes('child') !== true) {
          await this.client.blocks.delete({
            page_id: pageID,
            block_id: child.id,
          });
        }
      }
    };
  }

  /**
  * Add content into a Notion page.
  * @param {string} pageID - The Notion page ID of the page to update.
  * @param {object} children - The children to add.
  */
  async pageAddContent(pageID, children) {
    await this.client.pages.update({
      'page_id': pageID,
      'paragraph': children,
    });

    await this.client.blocks.children.append({
      block_id: pageID,
      children,
    });
  }
}

module.exports = Notion;
