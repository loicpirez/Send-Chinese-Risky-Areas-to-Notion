# Send Chinese Risky Areas to Notion
> Fetch Chinese Medium/High risks areas and send them to Notion.

## Introduction

![Main page](https://raw.github.com/loicpirez/Send-Chinese-Risky-Areas-to-Notion/main/screenshots/main.png)

This script does:
- Parse the content from the [notice of the XJLTU university website](https://www.xjtlu.edu.cn/en/novel-coronavirus-pneumonia/government-notices/notification-of-domestic-medium-high-risk-areas) (thanks a lot to them!)
- Parse it and extract informations including specifics areas and number of cases
- Send it to Notion.

Please find the Notion template [here](https://loicpirez.notion.site/Chinese-medium-high-risks-areas-a5f7bc821ab643f4a6350cfba94e06c4)

## Common setup

Clone the repo and install the dependencies.
NodeJS and Python3 (with pip) must be installed.

```bash
git clone git@github.com:loicpirez/Send-Chinese-Risky-Areas-to-Notion.git
```

```bash
npm install
```

## Environment

Environment must contain those variables.
You can add them in the `.env` files. (see `.env.sample`)

| Name  | Description |
| ------------- | ------------- |
| NOTION_TOKEN  | API token of your Notion integration. |
| NOTION_PAGE_TITLE  | Title of your Notion page. |
| NOTION_PAGE_ID  | ID of your Notion page.  |

## Running

```bash
npm run start
```