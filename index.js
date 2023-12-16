const axios = require('axios');

const url = 'https://api.offsetdata.com/graphql'

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const checkApiKey = (apiKey, errorMessage = "") => {
  if (!apiKey) {
    throw new Error("API key is required. Make sure to pass API key while creating offsetdata instance. " + errorMessage )
  }
  if (typeof apiKey !== "string") {
    throw new Error("API key should be a string.")
  }
  if (apiKey.length !== 46) {
    throw new Error("Invalid API key format. Check your api keys at app.offsetdata.com/apikeys")
  }
}

const makeRequest = async (query, functionName) => {
  const response = await axios.post(url, { query }, config);
  if (response.data.data[functionName].status === 'Invalid Key') {
    throw new Error('API key provided is invalid');
  } else {
    return response.data.data[functionName];
  }
}

const makeRequestWithDataObject = async (query, functionName, dataObject) => {
  const response = await axios.post(url, { query }, config);
  if (response.data.data[functionName].status === 'Chain not supported') {
    throw new Error(`"${dataObject.chain}" <-- Chain not supported`);
  } else if (response.data.data[functionName].status === 'Invalid Key') {
    throw new Error('API key provided is invalid');
  } else {
    return response.data.data[functionName];
  }
}

const handleError = (error) => {
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

class OffsetData {

  // properties required in class
  apiKey = null;
  
  constructor(apiKey) {
    checkApiKey(apiKey)
    this.apiKey = apiKey
  }

  //VERSION
  async version(params) {
    let fields = [];
    if (!Array.isArray(params) || params.length == 0) {
      fields = ['date', 'current', 'creator', 'company', 'status'];
    } else {
      fields = params.map((param) => `${param}\n`).join('');
    }

    const query = `query {
        version {
          ${fields}
        }
      }`;
    
    try {
      const response = await axios.post(url, { query }, config);
      const { version } = response.data.data;
      return version;
    } catch (error) {
      handleError(error)
    }
  }

  //NFT MAPPING
  async nftMap(chain, tokenAddress, tokenId) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftMap('chain', 'tokenAddress', 'tokenId')")

    const query = `
    mutation {
      nftMap(meta: {
        apikey: "${this.apiKey}"
        chain: "${chain}"
        tokenAddress: "${tokenAddress}"
        tokenId: "${tokenId}"
      }) {
        status
      }
    }
    `;
    
    try {
      const response = await makeRequest(query, "nftMap")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //NFT BALANCE
  async nftBalance(walletAddress, results) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftBalance('walletAddress', 'results')")

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

    const query = `
    query {
      nftBalance(meta: {
        apikey: "${this.apiKey}"
        walletAddress: "${walletAddress}"
      }) 
      {
        ${results && results.length !== 0 ? results : returnParams}
      }
    }
  `;

    try {
      const response = await makeRequest(query, "nftBalance")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //NFT GET
  async nftGet(chain, tokenAddress, tokenId, params) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftGet('chain', 'tokenAddress', 'tokenId', {params})")

    // Generate the fields to include in the GraphQL query based on the input params array
    let fields = [];
    if (!Array.isArray(params) || params.length == 0) {
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
          apikey: "${this.apiKey}"
          chain: "${chain}"
          tokenAddress: "${tokenAddress}"
          tokenId: "${tokenId}"
        }) {
          ${fields} 
        }
      }
    `;
    
    try {
      const response = await makeRequest(query, "nftGet")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //NFT ADD
  async nftAdd(params, attributes) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftAdd({params}, [attributes])")

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
            apikey: "${this.apiKey}"
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
    
    try {
      const response = await makeRequest(query, "nftAdd")
      return response
    } catch (error) {
      handleError(error)
  }
}

  //NFT DELETE
  async nftDel(chain, tokenAddress, tokenId) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftDel('chain', 'tokenAddress', 'tokenId')")

    const query = `
      mutation {
        nftDel(meta: {
          apikey: "${this.apiKey}"
          chain: "${chain}"
          tokenAddress: "${tokenAddress}"
          tokenId: "${tokenId}"
        }) {
          status
        }
      }
    `;
    
    try {
      const response  = await makeRequest(query, "nftDel")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //NFT UPDATE
  async nftUpd(params, attributes) {
  
    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftUpd({params}, '[attributes]})")

    // Generate the fields to include in the GraphQL query based on the input params array
    let attributesString = attributes
      ? `[${attributes
        .map(
          (attr) => `{
        value: ${attr.value !== undefined ? `"${attr.value}"` : null},
        trait_type: ${attr.trait_type !== undefined ? `"${attr.trait_type}"` : null
            },
        display_type: ${attr.display_type !== undefined ? `"${attr.display_type}"` : null
            },
        key: ${attr.key !== undefined ? `"${attr.key}"` : null},
        max_value: ${attr.max_value !== undefined ? `"${attr.max_value}"` : null
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
          apikey: "${this.apiKey}"
          chain: "${params.chain}"
          tokenAddress: "${params.tokenAddress}"
          tokenId: "${params.tokenId}"
          layer1: {
            name: ${params.name ? `"${params.name}"` : null}
            image: ${params.image ? `"${params.image}"` : null}
            description: ${params.description ? `"${params.description}"` : null
      }
            symbol: ${params.symbol ? `"${params.symbol}"` : null}

            tokenUri: ${params.tokenUri
        ? `{
                raw: ${params.tokenUri.raw ? `"${params.tokenUri.raw}"` : null},
                gateway: ${params.tokenUri.gateway
          ? `"${params.tokenUri.gateway}"`
          : null
        },
            }`
        : null
      }
            media: ${params.media
        ? `{
                image_data: ${params.media.image_data
          ? `"${params.media.image_data}"`
          : null
        },
                background_image: ${params.media.background_image
          ? `"${params.media.background_image}"`
          : null
        },
                image_url: ${params.media.image_url ? `"${params.media.image_url}"` : null
        },
                background_color: ${params.media.background_color
          ? `"${params.media.background_color}"`
          : null
        },
                animation_url: ${params.media.animation_url
          ? `"${params.media.animation_url}"`
          : null
        },
                external_url: ${params.media.external_url
          ? `"${params.media.external_url}"`
          : null
        },
                youtube_url: ${params.media.youtube_url
          ? `"${params.media.youtube_url}"`
          : null
        },
                raw: ${params.media.raw ? `"${params.media.raw}"` : null},
                gateway: ${params.media.gateway ? `"${params.media.gateway}"` : null
        },
                thumbnail: ${params.media.thumbnail ? `"${params.media.thumbnail}"` : null
        },
                format: ${params.media.format ? `"${params.media.format}"` : null
        },
                mimeType: ${params.media.mimeType ? `"${params.media.mimeType}"` : null
        },
      }`
        : null
      }
            properties : ${params.properties
        ? `{
                points: ${params.properties.points
          ? `"${params.properties.points}"`
          : null
        },
                status: ${params.properties.status
          ? `"${params.properties.status}"`
          : null
        },
                type:   ${params.properties.type ? `"${params.properties.type}"` : null
        },
                owner: ${params.properties.owner
          ? `"${params.properties.owner}"`
          : null
        },
                price: ${params.properties.price
          ? `"${params.properties.price}"`
          : null
        },
                ipfs: ${params.properties.ipfs ? `"${params.properties.ipfs}"` : null
        },
                location: ${params.properties.location
          ? `"${params.properties.location}"`
          : null
        },
                license: ${params.properties.license
          ? `"${params.properties.license}"`
          : null
        },
                edition: ${params.properties.edition
          ? `"${params.properties.edition}"`
          : null
        },
                date: ${params.properties.date ? `"${params.properties.date}"` : null
        },
                gender:  ${params.properties.gender
          ? `"${params.properties.gender}"`
          : null
        },
                id: ${params.properties.id ? `"${params.properties.id}"` : null
        },
                is_normalized: ${params.properties.is_normalized
          ? `"${params.properties.is_normalized}"`
          : null
        },
                version: ${params.properties.version
          ? `"${params.properties.version}"`
          : null
        },
                last_request_date: ${params.properties.last_request_date
          ? `"${params.properties.last_request_date}"`
          : null
        },
            }`
        : null
      }
            audio: ${params.audio
        ? `{
                artist: ${params.audio.artist ? `"${params.audio.artist}"` : null
        },
                title: ${params.audio.title ? `"${params.audio.title}"` : null},
                duration: ${params.audio.duration ? `"${params.audio.duration}"` : null
        },
                losslessAudio: ${params.audio.losslessAudio
          ? `"${params.audio.losslessAudio}"`
          : null
        },
                bpm: ${params.audio.bpm ? `"${params.audio.bpm}"` : null},
                artwork: ${params.audio.artwork ? `"${params.audio.artwork}"` : null
        },
                credits: ${params.audio.credits ? `"${params.audio.credits}"` : null
        },
                lyrics: ${params.audio.lyrics ? `"${params.audio.lyrics}"` : null
        },
                genre: ${params.audio.genre ? `"${params.audio.genre}"` : null},
                isrc: ${params.audio.isrc ? `"${params.audio.isrc}"` : null},
                key: ${params.audio.key ? `"${params.audio.key}"` : null},
            }`
        : null
      }
            virtual: ${params.virtual
        ? `{
                asset3d: ${params.virtual.asset3d ? `"${params.virtual.asset3d}"` : null
        },
                tpose: ${params.virtual.tpose ? `"${params.virtual.tpose}"` : null
        },
                model: ${params.virtual.model ? `"${params.virtual.model}"` : null
        },
                pfp: ${params.virtual.pfp ? `"${params.virtual.pfp}"` : null},
                experience: ${params.virtual.experience
          ? `"${params.virtual.experience}"`
          : null
        },
                interactivity:  ${params.virtual.interactivity
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
    
    try {
      const response = await makeRequest(query, "nftUpd")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //NFT SEARCH
  async nftSearch(searchQuery, returnedResults) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftSearch({searchQuery}, {returnedResults})")

    const { tokenId, name, description, symbol, tokenAddress, attributes } = searchQuery;
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

    const query = `
    query {
      nftSearch(meta: {
        apikey : "${this.apiKey}"
        ${tokenAddress ? `tokenAddress: "${tokenAddress}"` : ''}
        ${tokenId ? `tokenId: "${tokenId}"` : ''}
        ${name ? `name: "${name}"` : ''}
        ${description ? `description: "${description}"` : ''}
        ${symbol ? `symbol: "${symbol}"` : ''}
        ${attributesQuery}
      }) {
        ${returnedResults && returnedResults.length > 0
        ? returnedResults.join('\n')
        : 'status'
        }
      }
    }
  `;
   
    try {
      const response = await makeRequest(query, "nftSearch")
      return response
    } catch (error) {
      handleError(error)
    }
    
}

  //NFT MAPP ALL
  async nftMapAll(
    chain,
    tokenAddress,
    numberOfTokens,
    rangeFromTo
  ) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.nftMapAll('chain', 'tokenAddress', 'numberOfTokens', 'rangeFromTo')")

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

    const query = `
      mutation {
        nftMapAll(meta: {
          apikey: "${this.apiKey}"
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
   
    try {
      const response = await makeRequest(query, "nftMapAll")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //DATA ADD
  async dataAdd(dataObject) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.dataAdd({data object})")

    // checking if data object provided
    if (!dataObject || typeof dataObject !== 'object') {
      throw new Error(
        "Data object is required. Try running -->  offsetdata.dataAdd({data object})"
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

    let formType = 'simple';
    const requiredFields = [
      'chain',
      'submitter',
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
          apikey: "${this.apiKey}"
          chain: "${dataObject.chain}"
          submitter: "${dataObject.submitter}"
          formType: "${formType}"
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
          apikey: "${this.apiKey}"
          chain: "${dataObject.chain}"
          submitter: "${dataObject.submitter}"
          formType: "${formType}"
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
    
    try {
      const response = await makeRequestWithDataObject(query, "dataAdd", dataObject)
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //DATA VERIFY
  async dataVerify(dataObject, hashedData) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.dataVerify({data object}, '0xHasheData')")

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
          apikey: "${this.apiKey}"
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
          apikey: "${this.apiKey}"
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

    try {
      const response = await makeRequestWithDataObject(query, "dataVerify", dataObject)
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //DATA FIND
  async dataFind(submissionHash, searchParams) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.dataFind('0xSubmissionHash', {search params})")

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
    let query = `
    query {
      dataFind(data: {
        apikey: "${this.apiKey}"
        hash: "${submissionHash}"
      }) {
        ${searchParams}
      }
    }  `;

    try {
      const response = await makeRequest(query, "dataFind")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //TX GET
  async txGet(params, results) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.txGet('chain', 'walletAddress', 'transactionType', 'tokenType')")

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

    const query = `
      query {
        txGet(tx: {
          apikey: "${this.apiKey}"
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
  ` ;
   
    try {
      const response = await makeRequest(query, "txGet")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //DATA ALL
  async dataAll(searchParams) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.dataAll([search params])")

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

    let query = `
    {
      dataAll(data: {
      apikey: "${this.apiKey}"
      }) {
        records {
          ${searchParams}
        }
    status
      }
    }
    `;

    try {
      const response = await makeRequest(query, "dataAll")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //USER USAGE
  async userUsage(range, results) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.userUsage('range', [results])")

    // const returnParams = {'range', 'usage', 'cost'}

    const query = `
      query {
        userUsage(user: {
          apikey: "${this.apiKey}"
          range: "${range}"
        }) {
          status
          usage {
            ${results}
          }
        }
      }
    `;

    try {
      const response = await makeRequest(query, "userUsage")
      return response
    } catch (error) {
      handleError(error)
    }
  }

  //TOKEN PRICE GET
  async priceGet(token, results) {

    checkApiKey(this.apiKey, "Try running -->  offsetdata.priceGet('token')")

    const resultFiller = ['status', 'priceUSD', 'lastUpdated'];

    const query = `
      query {
        priceGet(price: {
          apikey: "${this.apiKey}"
          token: "${token}"
        }) {
          ${results && results.length !== 0 ? results : resultFiller}
        }
      }
    `;
    
    try {
      const response = await makeRequest(query, "priceGet")
      return response
    } catch (error) {
      handleError(error)
    }
  }


}

module.exports = OffsetData;
