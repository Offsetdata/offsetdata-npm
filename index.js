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
      "API key is required. Try running -->  offsetdata.dataVerify('your api key', {data object}, '0xHasheData' )"
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

module.exports = {
  version,
  nftMap,
  nftGet,
  nftAdd,
  nftDel,
  nftUpd,
  nftSearch,
  dataAdd,
  dataVerify,
  dataFind,
};
