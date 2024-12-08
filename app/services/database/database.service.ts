import { Injectable } from '@nativescript/core';
import { Sqlite } from '@nativescript-community/sqlite';
import { Account, AccountFilters } from '../../models/account.model';
import { Appointment, AppointmentFilters } from '../../models/appointment.model';
import { AccountQueries } from './queries/account.queries';
import { AppointmentQueries } from './queries/appointment.queries';

@Injectable()
export class DatabaseService {
  private database: Sqlite;
  private accountQueries: AccountQueries;
  private appointmentQueries: AppointmentQueries;

  constructor() {
    this.accountQueries = new AccountQueries();
    this.appointmentQueries = new AppointmentQueries();
  }

  async init(): Promise<void> {
    this.database = await new Sqlite('southern_glazer.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    await this.database.execSQL(this.accountQueries.createTableQuery);
    await this.database.execSQL(this.appointmentQueries.createTableQuery);
  }

  // Account Methods
  async addAccount(account: Account): Promise<number> {
    const result = await this.database.execSQL(
      this.accountQueries.insertQuery,
      this.accountQueries.getInsertParams(account)
    );
    return result.insertId;
  }

  async getAccounts(filters?: AccountFilters): Promise<Account[]> {
    let query = this.accountQueries.selectAllQuery;
    const params: any[] = [];

    if (filters?.accountType) {
      query = this.accountQueries.selectByTypeQuery;
      params.push(filters.accountType);
    }

    const results = await this.database.all(query, params);
    return results.map(this.accountQueries.mapResultToAccount);
  }

  async getAccountsNeedingContact(): Promise<Account[]> {
    const results = await this.database.all(this.accountQueries.selectNeedsContactQuery);
    return results.map(this.accountQueries.mapResultToAccount);
  }

  // Appointment Methods
  async addAppointment(appointment: Appointment): Promise<number> {
    const result = await this.database.execSQL(
      this.appointmentQueries.insertQuery,
      this.appointmentQueries.getInsertParams(appointment)
    );
    return result.insertId;
  }

  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    let query = this.appointmentQueries.selectAllQuery;
    const params: any[] = [];

    if (filters?.startDate && filters?.endDate) {
      query = this.appointmentQueries.selectByDateRangeQuery;
      params.push(filters.startDate.toISOString(), filters.endDate.toISOString());
    }

    const results = await this.database.all(query, params);
    return results.map(this.appointmentQueries.mapResultToAppointment);
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const results = await this.database.all(this.appointmentQueries.selectUpcomingQuery);
    return results.map(this.appointmentQueries.mapResultToAppointment);
  }
}