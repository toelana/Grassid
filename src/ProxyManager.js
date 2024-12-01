require('colors');
const axios = require('axios');
const fs = require('fs');

const PROXY_SOURCES = {
  'SERVER 1': 'https://s3.filebin.net/filebin/6b50b27d442ac1ba4a077687b0a23f680881727be935e9f65eb0567de83f65eb/0715903c494cd313b486599d5a32fec22afda7f883b7bc9f2047a288b90b3c00?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=7pMj6hGeoKewqmMQILjm%2F20241201%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241201T195524Z&X-Amz-Expires=60&X-Amz-SignedHeaders=host&response-cache-control=max-age%3D60&response-content-disposition=filename%3D%22proxy.txt%22&response-content-type=text%2Fplain%3B%20charset%3Dutf-8&X-Amz-Signature=9b629e673eea08e08a6c7f876748f88fe58dd97e965a6fd9ebd02108a7653d12',
  'SERVER 2': 'https://files.ramanode.top/airdrop/grass/server_2.txt',
  'SERVER 3': 'https://files.ramanode.top/airdrop/grass/server_3.txt',
  'SERVER 4': 'https://files.ramanode.top/airdrop/grass/server_4.txt',
  'SERVER 5': 'https://files.ramanode.top/airdrop/grass/server_5.txt',
  'SERVER 6': 'https://files.ramanode.top/airdrop/grass/server_6.txt',
  'SERVER 7': 'https://files.ramanode.top/airdrop/grass/server_7.txt',
  'SERVER 8': 'https://files.ramanode.top/airdrop/grass/server_8.txt',
  'SERVER 9': 'https://files.ramanode.top/airdrop/grass/server_9.txt',
  'SERVER 10': 'https://files.ramanode.top/airdrop/grass/server_10.txt',
};

async function fetchProxies(url) {
  try {
    const response = await axios.get(url);
    console.log(`\nFetched proxies from ${url}`.green);
    return response.data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Failed to fetch proxies from ${url}: ${error.message}`.red);
    return [];
  }
}

async function readLines(filename) {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    console.log(`Loaded data from ${filename}`.green);
    return data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Failed to read ${filename}: ${error.message}`.red);
    return [];
  }
}

async function selectProxySource(inquirer) {
  const choices = [...Object.keys(PROXY_SOURCES), 'CUSTOM', 'NO PROXY'];
  const { source } = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select proxy source:'.cyan,
      choices,
    },
  ]);

  if (source === 'CUSTOM') {
    const { filename } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Enter the path to your proxy.txt file:'.cyan,
        default: 'proxy.txt',
      },
    ]);
    return { type: 'file', source: filename };
  } else if (source === 'NO PROXY') {
    return { type: 'none' };
  }

  return { type: 'url', source: PROXY_SOURCES[source] };
}

module.exports = { fetchProxies, readLines, selectProxySource };
