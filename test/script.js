const offsetdata = require('offsetdata');

// *** test Version

//   offsetdata.version(["date", "current", "creator", "company", "status"])
//   .then(object => {
//     console.log(object);
//   })
//   .catch(error => {
//     console.error(error);
//   });  

// *** test NFT MAP

// offsetdata.nftMap("KEY", "eth", "0xb334a4eb0a2d6cc24fd451e779c002b9b33228c3", "2650")
//   .then(object => {
//     console.log(object);
//   })
//   .catch(error => {
//     console.error(error);
//   });

// *** test NFT GET

// offsetdata.nftGet("KEY", "eth", "0xb334a4eb0a2d6cc24fd451e779c002b9b33228c3", "2650", [
//     "status",
//     "chain",
//     "tokenAddress",
//     "tokenId",
//     "title",
//     "description",
//     "symbol",
//     "tokenType",
//     "tokenUri { raw gateway }",
//     "media { raw gateway thumbnail format }",
//     "attributes { value trait_type }"
// ])
//   .then(object => {
//     console.log(object);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// test NFT ADD

// offsetdata.nftAdd("KEY", {
//     chain: "eth",
//     tokenAddress: "0x152f04b930f9902471ddcba278c28bd51448fd11",
//     tokenId: "9",
//     title: "Justin Token",
//     description: "This token is for asdakd adjadjk",
//     symbol: "JST",
//     tokenType: "ERC721",
//     tokenUri: {
//       raw: "token raw link",
//       gateway:"token uri gatway link"
//     },
//     media: {
// 			raw: "rawString",
//   		gateway: "gatewayString",
//       thumbnail: "thumbnailString",
//       format: "formatString"
//     }
// }, 	[
//     {
//       value: "value1",
//       trait_type: "trait1"
//     },
//     {
//       value: "value2",
//       trait_type: "trait2"
//     },
//     {
//         value: "value3",
//         trait_type: "trait3"
//       },
//   ])
//   .then(object => {
//     console.log(object);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// *** test NFT DELETE

// offsetdata.nftDel("KEY", "eth", "0xb334a4eb0a2d6cc24fd451e779c002b9b33228c3", "2650")
//   .then(object => {
//     console.log(object);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// test NFT ADD

offsetdata.nftUpd("KEY", {
    chain: "eth",
    tokenAddress: "0x152f04b930f9902471ddcba278c28bd51448fd11",
    tokenId: "9",
    title: "Justin Token",
    description: "This token is for asdakd adjadjk",
    symbol: "JST",
    tokenType: "ERC721",
    tokenUri: {
      raw: "token raw link",
      gateway:"token uri gatway link"
    },
    media: {
			raw: "rawString",
  		gateway: "gatewayString",
      thumbnail: "thumbnailString",
      format: "formatString"
    }
}, 	[
    {
      value: "value1",
      trait_type: "trait1"
    },
    {
      value: "value2",
      trait_type: "trait2"
    },
    {
        value: "value3",
        trait_type: "trait3"
      },
  ])
  .then(object => {
    console.log(object);
  })
  .catch(error => {
    console.error(error);
  });
