import path from 'path';
import solc from 'solc';
import fs from 'fs-extra';

// Removing build folder
console.log('Removing build folder...');
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Reading Campaign contract content
console.log('Reading solidy source files...');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

// Input
const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

// Compile with solc
console.log('Compiling...');
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Campaign.sol'
];
// ensure build dir exists
fs.ensureDirSync(buildPath);

console.log('Creating contracts in json file...');
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    output[contract]
  );
}
console.log('Done');
process.exit();
