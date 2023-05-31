const axios = require('axios');

//VERSION
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

//NFT MAPPING
async function nftMap(apikey, chain, tokenAddress, tokenId) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftMap('your api key', 'chain', 'tokenAddress', 'tokenId')"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

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
    if (response.data.data.nftMap.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftMap;
    }
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

//NFT BALANCE
async function nftBalance(apikey, walletAddress, results) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftBalance('your api key', 'walletAddress', 'results')"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  const returnParams = [
    `status 
    ethereum {
      total
      tokens {
        tokenAddress
        tokenId
        balance
      }
    }
        polygon {
      total
      tokens {
        tokenAddress
        tokenId
        balance
      }
    }`,
  ];

  const url = 'https://api.offsetdata.com/graphql';
  const query = `
  query {
    nftBalance(meta: {
      apikey: "${apikey}"
      walletAddress: "${walletAddress}"
    }) 
   {
    ${results && results.length !== 0 ? results : returnParams}
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
    if (response.data.data.nftBalance.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftBalance;
    }
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
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftGet('your api key', 'chain', 'tokenAddress', 'tokenId', {params})"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }
  const url = 'https://api.offsetdata.com/graphql';
  // Generate the fields to include in the GraphQL query based on the input params array
  let fields = [];
  if (!params || params.length == 0) {
    fields = [
      'status',
      'chain',
      'tokenAddress',
      'tokenId',
      'name',
      'image',
      'description',
      'symbol',
      'tokenType',
      'tokenUri { raw gateway }',
      'media { raw gateway thumbnail format }',
      'attributes { value trait_type display_type key max_value link }',
      'layer1 { name description symbol tokenUri { raw gateway } media { image_data background_image image_url background_color animation_url external_url youtube_url raw gateway thumbnail format mimeType }  attributes { value trait_type display_type key max_value link }       properties { points status type owner price ipfs location license edition date gender id is_normalized version last_request_date } audio { artist title duration losslessAudio bpm credits lyrics genre isrc key artwork } virtual { asset3d tpose model pfp experience interactivity}} ',
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
    if (response.data.data.nftGet.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftGet;
    }
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

//NFT ADD
async function nftAdd(apikey, params, attributes) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftAdd('your api key', {params}, [attributes])"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }
  const url = 'https://api.offsetdata.com/graphql';
  // Generate the fields to include in the GraphQL query based on the input params array
  const attributesString = attributes
    ? `[${attributes
        .map(
          (attr) => `{
      value: "${attr.value ? attr.value : null}",
      trait_type: "${attr.trait_type ? attr.trait_type : null}"
      display_type: "${attr.display_type ? attr.display_type : null}"
      key: "${attr.key ? attr.key : null}"
      max_value: "${attr.max_value ? attr.max_value : null}"
      link: "${attr.link ? attr.link : null}"
    
    }`
        )
        .join(', ')}]`
    : '[]';
  let propertiesString = null;
  let mediaString = null;
  let tokenUriString = null;
  let audioString = null;
  let virtualString = null;
  if (params.media) {
    mediaString = `{ ${Object.entries(params.media)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ')} }`;
  }
  if (params.tokenUri) {
    tokenUriString = `{ ${Object.entries(params.tokenUri)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ')} }`;
  }
  if (params.audio) {
    audioString = `{ ${Object.entries(params.audio)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ')} }`;
  }
  if (params.virtual) {
    virtualString = `{ ${Object.entries(params.virtual)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ')} }`;
  }
  if (params.properties) {
    propertiesString = `{ ${Object.entries(params.properties)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ')} }`;
  }

  const query = `
  mutation {
    nftAdd(meta: {
        apikey: "${apikey}"
        chain: "${params.chain}"
        tokenAddress: "${params.tokenAddress}"
        tokenId: "${params.tokenId}"
        name: "${params.name}"
        image: "${params.image}"
        description: "${params.description}"
        symbol: "${params.symbol}"
        tokenType: "${params.tokenType}"
        tokenUri: ${tokenUriString}
        media: ${mediaString}
        properties: ${propertiesString}
        audio: ${audioString}
        virtual: ${virtualString}
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

    if (response.data.data.nftAdd.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftAdd;
    }
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

//NFT DELETE
async function nftDel(apikey, chain, tokenAddress, tokenId) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftDel('your api key', 'chain', 'tokenAddress', 'tokenId')"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

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

    if (response.data.data.nftDel.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftDel;
    }
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
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftUpd('your api key', {params}, '[attributes]})"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }
  const url = 'https://api.offsetdata.com/graphql';
  // Generate the fields to include in the GraphQL query based on the input params array
  let attributesString = attributes
    ? `[${attributes
        .map(
          (attr) => `{
        value: ${attr.value !== undefined ? `"${attr.value}"` : null},
        trait_type: ${
          attr.trait_type !== undefined ? `"${attr.trait_type}"` : null
        },
        display_type: ${
          attr.display_type !== undefined ? `"${attr.display_type}"` : null
        },
        key: ${attr.key !== undefined ? `"${attr.key}"` : null},
        max_value: ${
          attr.max_value !== undefined ? `"${attr.max_value}"` : null
        },
        link: ${attr.link !== undefined ? `"${attr.link}"` : null}
      }`
        )
        .join(', ')}]`
    : null;
  if (attributesString === '[]') {
    attributesString = null;
  }
  const query = `
    mutation {
      nftUpd(meta: {
          apikey: "${apikey}"
          chain: "${params.chain}"
          tokenAddress: "${params.tokenAddress}"
          tokenId: "${params.tokenId}"
          layer1: {
            name: ${params.name ? `"${params.name}"` : null}
            image: ${params.image ? `"${params.image}"` : null}
            description: ${
              params.description ? `"${params.description}"` : null
            }
            symbol: ${params.symbol ? `"${params.symbol}"` : null}

            tokenUri: ${
              params.tokenUri
                ? `{
                raw: ${params.tokenUri.raw ? `"${params.tokenUri.raw}"` : null},
                gateway: ${
                  params.tokenUri.gateway
                    ? `"${params.tokenUri.gateway}"`
                    : null
                },
            }`
                : null
            }
            media: ${
              params.media
                ? `{
                image_data: ${
                  params.media.image_data
                    ? `"${params.media.image_data}"`
                    : null
                },
                background_image: ${
                  params.media.background_image
                    ? `"${params.media.background_image}"`
                    : null
                },
                image_url: ${
                  params.media.image_url ? `"${params.media.image_url}"` : null
                },
                background_color: ${
                  params.media.background_color
                    ? `"${params.media.background_color}"`
                    : null
                },
                animation_url: ${
                  params.media.animation_url
                    ? `"${params.media.animation_url}"`
                    : null
                },
                external_url: ${
                  params.media.external_url
                    ? `"${params.media.external_url}"`
                    : null
                },
                youtube_url: ${
                  params.media.youtube_url
                    ? `"${params.media.youtube_url}"`
                    : null
                },
                raw: ${params.media.raw ? `"${params.media.raw}"` : null},
                gateway: ${
                  params.media.gateway ? `"${params.media.gateway}"` : null
                },
                thumbnail: ${
                  params.media.thumbnail ? `"${params.media.thumbnail}"` : null
                },
                format: ${
                  params.media.format ? `"${params.media.format}"` : null
                },
                mimeType: ${
                  params.media.mimeType ? `"${params.media.mimeType}"` : null
                },
      }`
                : null
            }
            properties : ${
              params.properties
                ? `{
                points: ${
                  params.properties.points
                    ? `"${params.properties.points}"`
                    : null
                },
                status: ${
                  params.properties.status
                    ? `"${params.properties.status}"`
                    : null
                },
                type:   ${
                  params.properties.type ? `"${params.properties.type}"` : null
                },
                owner: ${
                  params.properties.owner
                    ? `"${params.properties.owner}"`
                    : null
                },
                price: ${
                  params.properties.price
                    ? `"${params.properties.price}"`
                    : null
                },
                ipfs: ${
                  params.properties.ipfs ? `"${params.properties.ipfs}"` : null
                },
                location: ${
                  params.properties.location
                    ? `"${params.properties.location}"`
                    : null
                },
                license: ${
                  params.properties.license
                    ? `"${params.properties.license}"`
                    : null
                },
                edition: ${
                  params.properties.edition
                    ? `"${params.properties.edition}"`
                    : null
                },
                date: ${
                  params.properties.date ? `"${params.properties.date}"` : null
                },
                gender:  ${
                  params.properties.gender
                    ? `"${params.properties.gender}"`
                    : null
                },
                id: ${
                  params.properties.id ? `"${params.properties.id}"` : null
                },
                is_normalized: ${
                  params.properties.is_normalized
                    ? `"${params.properties.is_normalized}"`
                    : null
                },
                version: ${
                  params.properties.version
                    ? `"${params.properties.version}"`
                    : null
                },
                last_request_date: ${
                  params.properties.last_request_date
                    ? `"${params.properties.last_request_date}"`
                    : null
                },
            }`
                : null
            }
            audio: ${
              params.audio
                ? `{
                artist: ${
                  params.audio.artist ? `"${params.audio.artist}"` : null
                },
                title: ${params.audio.title ? `"${params.audio.title}"` : null},
                duration: ${
                  params.audio.duration ? `"${params.audio.duration}"` : null
                },
                losslessAudio: ${
                  params.audio.losslessAudio
                    ? `"${params.audio.losslessAudio}"`
                    : null
                },
                bpm: ${params.audio.bpm ? `"${params.audio.bpm}"` : null},
                artwork: ${
                  params.audio.artwork ? `"${params.audio.artwork}"` : null
                },
                credits: ${
                  params.audio.credits ? `"${params.audio.credits}"` : null
                },
                lyrics: ${
                  params.audio.lyrics ? `"${params.audio.lyrics}"` : null
                },
                genre: ${params.audio.genre ? `"${params.audio.genre}"` : null},
                isrc: ${params.audio.isrc ? `"${params.audio.isrc}"` : null},
                key: ${params.audio.key ? `"${params.audio.key}"` : null},
            }`
                : null
            }
            virtual: ${
              params.virtual
                ? `{
                asset3d: ${
                  params.virtual.asset3d ? `"${params.virtual.asset3d}"` : null
                },
                tpose: ${
                  params.virtual.tpose ? `"${params.virtual.tpose}"` : null
                },
                model: ${
                  params.virtual.model ? `"${params.virtual.model}"` : null
                },
                pfp: ${params.virtual.pfp ? `"${params.virtual.pfp}"` : null},
                experience: ${
                  params.virtual.experience
                    ? `"${params.virtual.experience}"`
                    : null
                },
                interactivity:  ${
                  params.virtual.interactivity
                    ? `"${params.virtual.interactivity}"`
                    : null
                },
            }`
                : null
            }
            attributes: ${attributesString}

          }
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

    if (response.data.data.nftUpd.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftUpd;
    }
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
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftSearch('your api key', {searchQuery}, {returnedResults})"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  const { tokenId, name, description, symbol, tokenAddress, attributes } =
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
        ${name ? `name: "${name}"` : ''}
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

    if (response.data.data.nftSearch.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftSearch;
    }
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

//NFT MAPP ALL
async function nftMapAll(
  apikey,
  chain,
  tokenAddress,
  numberOfTokens,
  rangeFromTo
) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.nftMapAll('your api key', 'chain', 'tokenAddress', 'numberOfTokens', 'rangeFromTo')"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  let tempRangeFrom = '';
  let tempRangeTo = '';
  let tempNumberOfTokens = '';

  if (Array.isArray(numberOfTokens)) {
    if (numberOfTokens.length === 2) {
      tempRangeFrom = numberOfTokens[0];
      tempRangeTo = numberOfTokens[1];
    } else {
    }
  } else {
    if (!rangeFromTo) {
      tempNumberOfTokens = numberOfTokens;
      tempRangeFrom = '';
      tempRangeTo = '';
    } else {
      tempNumberOfTokens = '';
      tempRangeFrom = rangeFromTo[0];
      tempRangeTo = rangeFromTo[1];
    }
  }
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
    mutation {
      nftMapAll(meta: {
        apikey: "${apikey}"
        chain: "${chain}"
        tokenAddress: "${tokenAddress}"
           numberOfTokens: "${tempNumberOfTokens}"
            rangeFrom: "${tempRangeFrom}"
            rangeTo: "${tempRangeTo}"
 
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
    if (response.data.data.nftMapAll.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.nftMapAll;
    }
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

//DATA ADD
async function dataAdd(apikey, dataObject) {
  // checking if api key provided
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.dataAdd('your api key', {data object} )"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  // checking if data object provided
  if (!dataObject || typeof dataObject !== 'object') {
    throw new Error(
      "Data object is required. Try running -->  offsetdata.dataAdd('your api key', {data object} )"
    );
  }
  // checking if data object is empty
  if (Object.keys(dataObject).length < 1) {
    throw new Error('At least one data object parameter is required');
  }

  //check if dataObject.submitter is email

  if (
    dataObject.submitter.includes('@') &&
    dataObject.submitter.includes('.')
  ) {
  } else {
    throw new Error(
      'Invalid Submitter provided, enter your offsetdata user email address'
    );
  }

  // checking visibility
  if (
    dataObject.visibility === 'private' ||
    dataObject.visibility === 'public'
  ) {
  } else {
    throw new Error('Visibility can only be "public" or "private"');
  }

  const url = 'https://api.offsetdata.com/graphql';
  let formType = 'simple';
  const requiredFields = [
    'chain',
    'submitter',
    'formId',
    'reference',
    'record',
    'notes',
    'visibility',
  ];
  for (const field of requiredFields) {
    if (!dataObject[field]) {
      throw new Error(`"${field}" <--  field can not be empty`);
    }
  }

  if (dataObject.fields || dataObject.customFields) {
    formType = 'advanced';
  }
  let query = `
  mutation {
    dataAdd(data: {
      apikey: "${apikey}"
      chain: "${dataObject.chain}"
      submitter: "${dataObject.submitter}"
      formType: "${formType}"
    formId: ${dataObject.formId}
      reference: ${dataObject.reference}
      record: "${dataObject.record}"
      notes: "${dataObject.notes}"
      visibility: "${dataObject.visibility}"
    }) {
      status
      txHash
    }
  }
  `;
  if (dataObject.formType === 'advanced') {
    if (!dataObject.fields) {
      throw new Error('"Fields" are required for advanced form type.');
    }
    if (typeof dataObject.fields !== 'object') {
      throw new Error('"Fields" must be an object.');
    }
    if (Object.keys(dataObject.fields).length < 1) {
      throw new Error('At least one field is required for advanced form type.');
    }
    if (!dataObject.customFields) {
      throw new Error(
        '"custoFields" Array is required for advanced form type.'
      );
    }
    if (!Array.isArray(dataObject.customFields)) {
      throw new Error('"custoFields" must be an Array of objects.');
    }
    if (dataObject.customFields.length < 1) {
      throw new Error(
        'At least one "customField" is required for advanced form type.'
      );
    }

    const modifiedFields = Object.keys(dataObject.fields).reduce((acc, key) => {
      acc[key.replace(/"/g, '')] = dataObject.fields[key];
      return acc;
    }, {});

    const modifiedCustomFields = dataObject.customFields.map((customField) => {
      return Object.keys(customField).reduce((acc, key) => {
        acc[key.replace(/"/g, '')] = customField[key];
        return acc;
      }, {});
    });
    const customFieldsString = JSON.stringify(modifiedCustomFields).replace(
      /"([^"]+)":/g,
      '$1:'
    );

    const fieldsString = JSON.stringify(modifiedFields).replace(
      /"([^"]+)":/g,
      '$1:'
    );

    query = `mutation {
  dataAdd(data: {
    apikey: "${apikey}"
    chain: "${dataObject.chain}"
    submitter: "${dataObject.submitter}"
    formType: "${formType}"
    formId: ${dataObject.formId}
    reference: ${dataObject.reference}
    record: "${dataObject.record}"
    notes: "${dataObject.notes}"
    visibility: "${dataObject.visibility}"
    fields: ${fieldsString}
    customFields: ${customFieldsString}
  }) {
    status
    txHash
  }
  }`;
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    if (response.data.data.dataAdd.status === 'Chain not supported') {
      throw new Error(`"${dataObject.chain}" <-- Chain not supported`);
    } else if (response.data.data.dataAdd.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.dataAdd;
    }
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

//DATA VERIFY
async function dataVerify(apikey, dataObject, hashedData) {
  // checking if api key provided
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.dataVerify('your api key', {data object}, '0xHasheData' )"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  // checking if data object provided
  if (!dataObject || typeof dataObject !== 'object') {
    throw new Error(
      "Data object is required. Try running -->  offsetdata.dataVerify('your api key', {data object}, '0xHasheData' )"
    );
  }
  // checking if data object is empty
  if (Object.keys(dataObject).length < 1) {
    throw new Error('At least one data object parameter is required');
  }

  if (
    dataObject.submitter.includes('@') &&
    dataObject.submitter.includes('.')
  ) {
  } else {
    throw new Error(
      'Invalid Submitter provided, enter your offsetdata user email address'
    );
  }

  if (!hashedData || typeof hashedData !== 'string') {
    throw new Error(
      "Hashed data String is required. Try running -->  offsetdata.dataVerify('your api key', {data object}, '0xHasheData' )"
    );
  }
  const url = 'https://api.offsetdata.com/graphql';
  const requiredFields = [
    'chain',
    'submitter',
    'formId',
    'reference',
    'record',
    'notes',
  ];
  for (const field of requiredFields) {
    if (!dataObject[field]) {
      throw new Error(`"${field}" <--  field can not be empty`);
    }
  }

  if (dataObject.fields || dataObject.customFields) {
    formType = 'advanced';
  }
  let query = `
  query {
    dataVerify(data: {
      apikey: "${apikey}"
      chain: "${dataObject.chain}"
      submitter: "${dataObject.submitter}"
    formId: ${dataObject.formId}
      reference: ${dataObject.reference}
      record: "${dataObject.record}"
      notes: "${dataObject.notes}"
      hashedData: "${hashedData}"
    }) {
      status
      txHash
    }
  }
  `;
  if (dataObject.fields || dataObject.customFields) {
    if (!dataObject.fields) {
      throw new Error('"Fields" are required for advanced form type.');
    }
    if (typeof dataObject.fields !== 'object') {
      throw new Error('"Fields" must be an object.');
    }
    if (Object.keys(dataObject.fields).length < 1) {
      throw new Error('At least one field is required for advanced form type.');
    }
    if (!dataObject.customFields) {
      throw new Error(
        '"custoFields" Array is required for advanced form type.'
      );
    }
    if (!Array.isArray(dataObject.customFields)) {
      throw new Error('"custoFields" must be an Array of objects.');
    }
    if (dataObject.customFields.length < 1) {
      throw new Error(
        'At least one "customField" is required for advanced form type.'
      );
    }

    const modifiedFields = Object.keys(dataObject.fields).reduce((acc, key) => {
      acc[key.replace(/"/g, '')] = dataObject.fields[key];
      return acc;
    }, {});

    const modifiedCustomFields = dataObject.customFields.map((customField) => {
      return Object.keys(customField).reduce((acc, key) => {
        acc[key.replace(/"/g, '')] = customField[key];
        return acc;
      }, {});
    });
    const customFieldsString = JSON.stringify(modifiedCustomFields).replace(
      /"([^"]+)":/g,
      '$1:'
    );

    const fieldsString = JSON.stringify(modifiedFields).replace(
      /"([^"]+)":/g,
      '$1:'
    );

    query = `query {
  dataVerify(data: {
    apikey: "${apikey}"
    chain: "${dataObject.chain}"
    submitter: "${dataObject.submitter}"
    formId: ${dataObject.formId}
    reference: ${dataObject.reference}
    record: "${dataObject.record}"
    notes: "${dataObject.notes}"
    fields: ${fieldsString}
    customFields: ${customFieldsString}
    hashedData: "0x3dbf14558872e7b86016a8eb5e1db5f370462bd2f548855817a4bda7e1601753"
  }) {
    status
    txHash
  }
  }`;
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    if (response.data.data.dataVerify.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.dataVerify;
    }
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

//DATA FIND
async function dataFind(apikey, submissionHash, searchParams) {
  // checking if api key provided
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.dataFind('your api key', '0xSubmissionHash', {search params}  )"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }
  // checking if submission hash provided
  if (typeof submissionHash !== 'string') {
    throw new Error(
      "Submission hash is required. Try running -->  offsetdata.dataFind('your api key', '0xSubmissionHash', {search params} )"
    );
  }
  if (submissionHash.length !== 66) {
    throw new Error(
      'Invalid submission hash format. Check your submission hash at app.offsetdata.com'
    );
  }
  // checking if search params provided
  if (typeof searchParams !== 'object') {
    throw new Error(
      "Search params is required. Try running -->  offsetdata.dataFind('your api key', '0xSubmissionHash', {search params} )"
    );
  }
  if (Object.keys(searchParams).length < 1) {
    throw new Error(
      "At least one search param is required. Try running -->  offsetdata.dataFind('your api key', '0xSubmissionHash', {search params} )"
    );
  }
  const url = 'https://api.offsetdata.com/graphql';
  let query = `

  query {
    dataFind(data: {
      apikey: "${apikey}"
       hash: "${submissionHash}"
    }) {
      ${searchParams}
    }
  }  `;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await axios.post(url, { query }, config);
    if (response.data.data.dataFind.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.dataFind;
    }
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

//TX GET
async function txGet(apikey, params, results) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.txGet('your api key', 'chain', 'walletAddress', 'transactionType', 'tokenType')"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  let tokenOrEth = null;
  if (params.tokenType.toLowerCase() === 'erc20') {
    tokenOrEth = 'ERC20';
  } else if (params.tokenType.toLowerCase() === 'erc721') {
    tokenOrEth = 'ERC721';
  } else if (params.tokenType.toLowerCase() === 'erc1155') {
    tokenOrEth = 'ERC1155';
  } else if (params.tokenType.toLowerCase() === 'eth') {
    tokenOrEth = null;
  }
  const returnParams = [
    'blockNum',
    'hash',
    'from',
    'to',
    'value',
    'erc721TokenId',
    'erc1155Metadata',
    'tokenId',
    'asset',
  ];
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
    query {
      txGet(tx: {
        apikey: "${apikey}"
        chain: "${params.chain}"
        walletAddress: "${params.walletAddress}"
        transactionType: "${params.transactionType}"
        tokenType: ${tokenOrEth ? `"${tokenOrEth}"` : null}
    
      }) {
        status
        txArray {
    ${results && results.length !== 0 ? results : returnParams.join(' ')}
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
    if (response.data.data.txGet.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.txGet;
    }
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

//DATA ALL
async function dataAll(apikey, searchParams) {
  // checking if api key provided
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.dataAll('your api key', [search params] )"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  // checking if search params provided
  if (typeof searchParams !== 'object') {
    throw new Error(
      "Search params is required. Try running -->  offsetdata.dataAll('your api key', [search params] )"
    );
  }
  if (Object.keys(searchParams).length < 1) {
    throw new Error(
      "At least one search param is required. Try running -->  offsetdata.dataAll('your api key', [search params])"
    );
  }
  const url = 'https://api.offsetdata.com/graphql';
  let query = `
  {
    dataAll(data: {
    apikey: "${apikey}"
    }) {
      records {
        ${searchParams}
      }
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
    if (response.data.data.dataAll.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.dataAll;
    }
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

//USER USAGE
async function userUsage(apikey, range, results) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.userUsage('your api key', 'range', [results])"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  // const returnParams = {'range', 'usage', 'cost'}
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
  query {
    userUsage(user: {
      apikey: "${apikey}"
      range: "${range}"
    }) {
      status
      usage {
        ${results}
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
    if (response.data.data.userUsage.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.userUsage;
    }
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

//TOKEN PRICE GET
async function priceGet(apikey, token, results) {
  if (typeof apikey !== 'string') {
    throw new Error(
      "API key is required. Try running -->  offsetdata.priceGet('your api key', 'token')"
    );
  }
  if (apikey.length !== 46) {
    throw new Error(
      'Invalid API key format. Check your api keys at app.offsetdata.com/apikeys'
    );
  }

  const resultFiller = ['status', 'priceUSD', 'lastUpdated'];
  const url = 'https://api.offsetdata.com/graphql';
  const query = `
  query {
    priceGet(price: {
      apikey: "${apikey}"
      token: "${token}"
    }) {
      ${results && results.length !== 0 ? results : resultFiller}
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
    if (response.data.data.priceGet.status === 'Invalid Key') {
      throw new Error('API key provided is invalid');
    } else {
      return response.data.data.priceGet;
    }
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
  nftMapAll,
  nftBalance,
  dataAdd,
  dataVerify,
  dataFind,
  dataAll,
  txGet,
  userUsage,
  priceGet,
};
