import { Observable } from '@nativescript/core';
import { Account } from '../../models/account.model';
import { DatabaseService } from '../../services/database.service';

export class AccountsListViewModel extends Observable {
  private _accounts: Account[] = [];
  private _searchQuery: string = '';
  private databaseService: DatabaseService;

  constructor() {
    super();
    this.databaseService = new DatabaseService();
  }

  async loadAccounts() {
    await this.databaseService.init();
    this._accounts = await this.databaseService.getAccounts();
    this.notifyPropertyChange('accounts', this._accounts);
  }

  get accounts(): Account[] {
    if (!this._searchQuery) {
      return this._accounts;
    }
    return this._accounts.filter(account => 
      account.businessName.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
      account.contactName.toLowerCase().includes(this._searchQuery.toLowerCase())
    );
  }

  set searchQuery(value: string) {
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.notifyPropertyChange('accounts', this.accounts);
    }
  }

  get searchQuery(): string {
    return this._searchQuery;
  }
}