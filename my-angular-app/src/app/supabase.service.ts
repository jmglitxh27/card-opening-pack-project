// src/app/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xijvfhtljgfifbzlveee.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanZmaHRsamdmaWZiemx2ZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDMzMDAsImV4cCI6MjA2OTgxOTMwMH0.wGjwR9WgNwZXGqbKb0NUDLwhSOcsZPt67UfjviPm9eQ';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
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

  // ✅ New Method
  getAllPlayers() {
    return this.supabase.from('players').select('*');
  }
}
