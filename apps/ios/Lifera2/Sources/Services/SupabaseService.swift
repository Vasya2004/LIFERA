import Foundation
import Supabase

enum SupabaseConfig {
    static let url = URL(string: "https://bhawpttoahwnjeznwsyi.supabase.co")!

    // Публичный anon-ключ проекта LIFERA2. Не секрет — доступ к данным
    // ограничивается политиками RLS на стороне базы, а не этим ключом.
    static let anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYXdwdHRvYWh3bmplem53c3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MDY4MjAsImV4cCI6MjEwNTk4MjgyMH0.MedNlfno7bWNHD6pFcdZRSj4tmhiG_qemAE8pQsbT2s"
}

let supabase = SupabaseClient(
    supabaseURL: SupabaseConfig.url,
    supabaseKey: SupabaseConfig.anonKey
)
