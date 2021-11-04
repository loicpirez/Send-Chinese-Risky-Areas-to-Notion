#!/usr/bin/env nodejs
const Notion = require('./Notion');
const logger = require('./logger');
const XianLiverpoolJiaotong = require('./XianLiverpoolJiaotong');
const {markdownToBlocks} = require('@instantish/martian');

require('dotenv').config();

const getCasesAmount = (riskyAreas, area) => {
  const line = riskyAreas.substring(
      riskyAreas.indexOf(area),
      riskyAreas.length + 1,
  ).split('\n')[0];

  return parseInt(line.substring(area.length + 1, line.length)) || 0;
};

const addRiskArea = async (notion, dbID, riskyAreas, data) => {
  logger.info(`Adding ${data.cityName} to database...`);
  await notion.databaseCreatePage(
      dbID,
      {
        'City / district name':
      {
        'title': [
          {
            'text': {
              'content': data.cityName,
            },
          },
        ],
      },
        'Is a risk area': {
          'multi_select': [
            {
              'name': data.isRiskArea ? 'Yes' : 'No',
              'color': data.isRiskArea ? 'red' : 'green',
            },
          ],
        },
        'Cases': {
          'number': getCasesAmount(riskyAreas, data.cityName),
        },
      },
  );
};

const checkAreas = async (notion, databaseID, riskyAreas) => {
  const areasVerification = [
    'Shanghai City',
    'Chongqing City',
    'Beijing City',
  ];

  for (const area in areasVerification) {
    if (Object.prototype.hasOwnProperty.call(areasVerification, area)) {
      await addRiskArea(
          notion,
          databaseID,
          riskyAreas,
          {
            cityName: areasVerification[area],
            isRiskArea: riskyAreas.includes(areasVerification[area]),
          },
      );
    }
  }
};

const main = async () => {
  logger.info('Starting...');
  logger.info('Initializing XianLiverpoolJiaotong module');
  const xljt = new XianLiverpoolJiaotong();
  logger.info('Initializing Notion module');
  const notion = new Notion();

  await notion.pageTitleUpdate(
      process.env.NOTION_PAGE_ID,
      `${process.env.NOTION_PAGE_TITLE} (Updating)`,
  );

  try {
    logger.info('Fetching areas from XianLiverpoolJiaotong ...');
    const riskyAreas = await (xljt.getHighRiskAreas());

    logger.info(`Get database ID...`);
    const databaseID = await notion.databaseGetID(
        ' Specifics areas', // Adding a space for better rendering
        process.env.NOTION_PAGE_ID,
    );

    logger.info(`Clearing database content...`);
    await notion.databaseRemoveAllPages(databaseID);

    logger.info(`Add area checking in risk areas database...`);
    await checkAreas(notion, databaseID, riskyAreas);

    logger.info(`Convert Markdown to Notion format`);
    const children = markdownToBlocks(riskyAreas);

    logger.info(`Clearing all page content except database`);
    await notion.pageClearContents(process.env.NOTION_PAGE_ID);
    logger.info(`Adding results to page...`);
    await notion.pageAddContent(process.env.NOTION_PAGE_ID, children);

    logger.info(`Done !`);
    await notion.pageTitleUpdate(
        process.env.NOTION_PAGE_ID,
        `${process.env.NOTION_PAGE_TITLE}`,
    );
  } catch (e) {
    logger.error(
        `Error while executing application: ${JSON.stringify(e, null, 2)}`,
    );
    await notion.pageTitleUpdate(
        process.env.NOTION_PAGE_ID,
        `${process.env.NOTION_PAGE_TITLE} (Failed update)`,
    );
  }
};

main();
