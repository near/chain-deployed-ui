import { Account } from '@near-js/accounts';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import { JsonRpcProvider } from '@near-js/providers';
import { InMemorySigner } from '@near-js/signers';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const PARTITION_SIZE = 100_000;

export async function deployFiles() {
  const [,, basePath, network, fileContract, deployerAccount, isLiveRun = true] = process.argv;
  let rpcUrl;
  switch (network || 'testnet') {
    case 'testnet':
      rpcUrl = 'https://rpc.testnet.near.org';
      break;
    case 'mainnet':
      rpcUrl = 'https://rpc.near.org';
      break;
    default:
      throw new Error('undefined environment')
  }

  const provider = new JsonRpcProvider({ url: rpcUrl });
  const signer = new InMemorySigner(new UnencryptedFileSystemKeyStore(path.resolve(os.homedir(), '.near-credentials')));
  const deployer = new Account(
    // @ts-ignore
    { networkId: network || 'testnet', provider, signer },
    deployerAccount
  );

  const distPath = path.resolve(process.env.PWD as string, basePath);
  const filePaths = fs.readdirSync(distPath, { recursive: true })
    .map((f) => f.toString())
    .filter((e) => (e.endsWith('.gz') || e.endsWith('.html')) && !e.endsWith('.html.gz'))

  for (let filename of filePaths) {
    // @ts-ignore
    const bundleBinary = fs.readFileSync(path.resolve(distPath, filename)).toString('base64');
    // @ts-ignore
    filename = filename.replace(/\.gz$/, '');

    let i = 0;
    const partitions = Math.ceil(bundleBinary.length / PARTITION_SIZE);
    console.log(`[${filename}] uploading in ${partitions} parts...`)
    while (i < partitions) {
      const bytes = bundleBinary.slice(i * PARTITION_SIZE, (i * PARTITION_SIZE) + PARTITION_SIZE);
      console.log(`[${filename}] ${i+1}/${partitions} (${bytes.length})...`)
      if (isLiveRun === true) {
        await deployer.functionCall({
          contractId: fileContract,
          methodName: 'upload_file',
          args: {
            filename,
            bytes,
            part: i,
            totalParts: partitions,
          },
          gas: BigInt('300000000000000'),
        });
      }
      i++;
    }
    console.log(`[${filename}] uploaded ${i}/${partitions}`)
  }
}

deployFiles().catch((e) => console.error(e));
