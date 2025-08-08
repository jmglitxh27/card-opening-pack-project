// src/app/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getTable(tableName: string) {
    return this.supabase.from(tableName).select('*');
  }

  getFromTableWithFilter(tableName: string, column: string, value: any) {
    return this.supabase.from(tableName).select('*').eq(column, value);
  }

  getPlayersByTeamId(teamId: number) {
    return this.supabase.from('players').select('*').eq('team_id', teamId);
  }

  getAllPacks() {
    return this.supabase.from('packs').select('*');
  }

  getAllPlayers() {
    return this.supabase
      .from('players')
      .select(`
        *,
        team:teams (
          logo_url
        )
      `);
  }
}