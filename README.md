## offsetdata-npm
Offsetdata NPM package for simplified Web3 data managing and storage on blockchain

# Installation
```
npm install offsetdata
```

# Usage
```
const OffsetData = require('offsetdata');
const offsetdata = new OffsetData('your-api-key');

offsetdata.version(['date', 'current', 'creator', 'company', 'status'])
  .then((result) => {
    console.log('Version:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```
