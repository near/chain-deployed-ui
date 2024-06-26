// Find all our documentation at https://docs.near.org
import {
  StorageBalance,
  StorageBalanceBounds,
  StorageManagement,
} from 'near-contract-standards/lib';
import {
  AccountId,
  Balance,
  IntoStorageKey,
  LookupMap,
  NearBindgen,
  NearPromise,
  StorageUsage,
  call,
  near,
  view,
} from 'near-sdk-js';

type Option<T> = T | null;

@NearBindgen({})
class UserStorage implements StorageManagement {
  accounts: LookupMap<Balance>;
  account_storage_usage: StorageUsage;
  constructor() {
    this.accounts = new LookupMap('');
    this.account_storage_usage = 0n;
  }

  init(prefix: IntoStorageKey) {
    const storage_prefix = prefix.into_storage_key();
    this.accounts = new LookupMap<Balance>(storage_prefix);
    this.account_storage_usage = 0n;
    return this;
  }

  @call({ payableFunction: true })
  storage_deposit({ account_id }: { account_id: string }): StorageBalance {
    const amount: Balance = near.attachedDeposit();
    account_id = account_id ?? near.predecessorAccountId();
    if (this.accounts.containsKey(account_id)) {
      near.log!('The account is already registered, refunding the deposit');
      if (amount > 0) {
        NearPromise.new(near.predecessorAccountId()).transfer(amount);
      }
    } else {
      let min_balance: Balance = this.storage_balance_bounds().min;
      if (amount < min_balance) {
        throw Error(
          'The attached deposit is less than the minimum storage balance',
        );
      }

      this.internal_register_account(account_id);
      let refund: Balance = amount - min_balance;
      if (refund > 0) {
        NearPromise.new(near.predecessorAccountId()).transfer(refund);
      }
    }
    return this.internal_storage_balance_of(account_id);
  }
  storage_withdraw({ amount }: { amount?: bigint }): StorageBalance {
    throw new Error('Method not implemented.');
  }
  @view({})
  storage_unregister({ force }: { force: boolean }): boolean {
    throw new Error('Method not implemented.');
  }
  storage_balance_bounds(): StorageBalanceBounds {
    let required_storage_balance: Balance =
      this.account_storage_usage * near.storageByteCost();
    return new StorageBalanceBounds(
      required_storage_balance,
      required_storage_balance,
    );
  }
  storage_balance_of({ account_id }: { account_id: string }): StorageBalance {
    throw new Error('Method not implemented.');
  }

  @view({})
  test() {
    return this.accounts;
  }

  internal_storage_balance_of(account_id: AccountId): Option<StorageBalance> {
    if (this.accounts.containsKey(account_id)) {
      return new StorageBalance(this.storage_balance_bounds().min, 0n);
    } else {
      return null;
    }
  }

  internal_register_account(account_id: AccountId) {
    if (this.accounts.containsKey(account_id)) {
      throw Error('The account is already registered');
    }
    this.accounts.set(account_id, 0n);
  }
}
