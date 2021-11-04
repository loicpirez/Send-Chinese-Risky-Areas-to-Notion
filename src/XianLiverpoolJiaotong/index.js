const axios = require('../axios');
const parser = require('node-html-parser');
const {NodeHtmlMarkdown} = require('node-html-markdown');

// const utils = require('../utils');

/**
 * High risk areas module.
 */
class XianLiverpoolJiaotong {
  /**
    * Get the Medium/High risk areas
    */
  async getHighRiskAreas() {
    const fetchedResult = await axios.get(`https://www.xjtlu.edu.cn/en/novel-coronavirus-pneumonia/government-notices/notification-of-domestic-medium-high-risk-areas`);
    let md = '';

    parser.parse(
        fetchedResult,
    ).querySelectorAll('.main-body-txt').forEach((element) => {
      md = NodeHtmlMarkdown.translate(element.innerHTML);
    });

    return md;
  }
}

module.exports = XianLiverpoolJiaotong;
