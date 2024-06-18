import { Account } from '@near-js/accounts';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import { JsonRpcProvider } from '@near-js/providers';
import { InMemorySigner } from '@near-js/signers';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import BOSConfig from './bos.json' assert { type: 'json' };

const { environments } = BOSConfig

async function deployAssets() {
  const [,, network] = process.argv;
  const { rpcUrl, fileContract, deployerAccount } = environments[network || 'testnet'];

  const provider = new JsonRpcProvider({ url: rpcUrl });
  const signer = new InMemorySigner(new UnencryptedFileSystemKeyStore(path.resolve(os.homedir(), '.near-credentials')));
  const deployer = new Account(
    { networkId: 'testnet', provider, signer },
    deployerAccount
  );

  const filePaths = fs.readdirSync('./dist/assets', { recursive: true })
    .filter((e) => e.endsWith('.js') || e.endsWith('.css')) // TODO why isn't dirent.isFile() working here?
    .map((p) => p.replace('dist/assets/', ''))

  await Promise.all(filePaths
    .map((filename) => {
      deployer.functionCall({
        contractId: fileContract,
        methodName: 'upload_file',
        args: {
          account_id: deployerAccount,
          filename,
          bytes: fs.readFileSync(`./dist/assets/${filename}`).toString('utf-8').trim(),
        },
        gas: BigInt('300000000000000'),
      })
    }));
}

deployAssets().catch((e) => console.error(e));
