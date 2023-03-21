const axios = require('axios');

//Version
async function version(params) {
  const url = 'https://api.offsetdata.com/graphql';
  let fields = [];
  if (!params || params.length == 0) {
    fields = ['date', 'current', 'creator', 'company', 'status'];
  } else {
    fields = params.map((param) => `${param}\n`).join('');
  }

  const query = `query {
        version {
          ${fields}
        }
      }`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    const { version } = response.data.data;

    return version;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

//NFT Mapping
async function nftMap(apikey, chain, tokenAddress, tokenId) {
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
    mutation {
      nftMap(meta: {
        apikey: "${apikey}"
        chain: "${chain}"
        tokenAddress: "${tokenAddress}"
        tokenId: "${tokenId}"
      }) {
        status
      }
    }
  `;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    return response.data.data.nftMap;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

//NFT GET
async function nftGet(apikey, chain, tokenAddress, tokenId, params) {
  const url = 'https://api.offsetdata.com/graphql';
  // Generate the fields to include in the GraphQL query based on the input params array
  let fields = [];
  if (!params || params.length == 0) {
    fields = [
      'status',
      'chain',
      'tokenAddress',
      'tokenId',
      'title',
      'description',
      'symbol',
      'tokenType',
      'tokenUri { raw gateway }',
      'media { raw gateway thumbnail format }',
      'attributes { value trait_type }',
    ];
  } else {
    fields = params.map((param) => `${param}\n`).join('');
  }

  const query = `
            query {
              nftGet(meta: {
                apikey: "${apikey}"
                chain: "${chain}"
                tokenAddress: "${tokenAddress}"
                tokenId: "${tokenId}"
              }) {
                ${fields} 
              }
            }
          `;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    return response.data.data.nftGet;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

//NFT Add
async function nftAdd(apikey, params, attributes) {
  const url = 'https://api.offsetdata.com/graphql';
  // Generate the fields to include in the GraphQL query based on the input params array
  const attributesString = attributes
    ? `[${attributes
        .map(
          (attr) => `{
      value: "${attr.value}",
      trait_type: "${attr.trait_type}"
    }`
        )
        .join(', ')}]`
    : '[]';

  const query = `
  mutation {
    nftAdd(meta: {
        apikey: "${apikey}"
        chain: "${params.chain}"
        tokenAddress: "${params.tokenAddress}"
        tokenId: "${params.tokenId}"
        title: "${params.title}"
        description: "${params.description}"
        symbol: "${params.symbol}"
        tokenType: "ERC721"
        tokenUri: {
          raw: "${params.tokenUri.raw}",
          gateway:"${params.tokenUri.gateway}",
        }
        media: {
                raw: "${params.media.raw}",
                gateway: "${params.media.gateway}",
                thumbnail: "${params.media.thumbnail}",
                format: "${params.media.format}"
        }
        attributes: ${attributesString}
    }) {
     status
    }
  }
        `;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    return response.data.data.nftAdd;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

//NFT Delete
async function nftDel(apikey, chain, tokenAddress, tokenId) {
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
      mutation {
        nftDel(meta: {
          apikey: "${apikey}"
          chain: "${chain}"
          tokenAddress: "${tokenAddress}"
          tokenId: "${tokenId}"
        }) {
          status
        }
      }
    `;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    return response.data.data.nftDel;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

//NFT UPDATE
async function nftUpd(apikey, params, attributes) {
  const url = 'https://api.offsetdata.com/graphql';
  // Generate the fields to include in the GraphQL query based on the input params array
  const attributesString = attributes
    ? `[${attributes
        .map(
          (attr) => `{
        value: "${attr.value}",
        trait_type: "${attr.trait_type}"
      }`
        )
        .join(', ')}]`
    : '[]';

  const query = `
    mutation {
      nftUpd(meta: {
          apikey: "${apikey}"
          chain: "${params.chain}"
          tokenAddress: "${params.tokenAddress}"
          tokenId: "${params.tokenId}"
          title: "${params.title}"
          description: "${params.description}"
          symbol: "${params.symbol}"
          tokenType: "ERC721"
          tokenUri: {
            raw: "${params.tokenUri.raw}",
            gateway:"${params.tokenUri.gateway}",
          }
          media: {
                  raw: "${params.media.raw}",
                  gateway: "${params.media.gateway}",
                  thumbnail: "${params.media.thumbnail}",
                  format: "${params.media.format}"
          }
          attributes: ${attributesString}
      }) {
       status
      }
    }
          `;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    return response.data.data.nftUpd;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

//NFT SEARCH
async function nftSearch(apikey, searchQuery, returnedResults) {
  const { tokenId, title, description, symbol, tokenAddress, attributes } =
    searchQuery;
  let attributesQuery = '';
  if (attributes) {
    attributesQuery = `attributes: ${attributes
      .map(
        (attr) =>
          `{${Object.entries(attr)
            .map(([key, value]) => `${key}: "${value}"`)
            .join(', ')}}`
      )
      .join(', ')}`;
  }
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
    query {
      nftSearch(meta: {

        apikey : "${apikey}"
        ${tokenAddress ? `tokenAddress: "${tokenAddress}"` : ''}
        ${tokenId ? `tokenId: "${tokenId}"` : ''}
        ${title ? `title: "${title}"` : ''}
        ${description ? `description: "${description}"` : ''}
        ${symbol ? `symbol: "${symbol}"` : ''}
        ${attributesQuery}
      }) {
        ${
          returnedResults && returnedResults.length > 0
            ? returnedResults.join('\n')
            : 'status'
        }
   
      }
    }
  `;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    return response.data.data.nftSearch;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      let errorMessage = error.response.data.errors[0].message;
      if (error.response.data.errors.length > 1) {
        error.response.data.errors.forEach((error, index) => {
          if (index > 0) {
            errorMessage += ` & ` + error.message;
          }
        });
      }
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

module.exports = {
  version,
  nftMap,
  nftGet,
  nftAdd,
  nftDel,
  nftUpd,
  nftSearch,
};
