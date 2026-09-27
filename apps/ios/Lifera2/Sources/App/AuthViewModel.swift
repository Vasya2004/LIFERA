import Foundation
import Supabase

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var session: Session?
    @Published var isLoading = true

    private var authTask: Task<Void, Never>?

    init() {
        authTask = Task {
            for await (_, session) in supabase.auth.authStateChanges {
                self.session = session
                self.isLoading = false
            }
        }
    }

    deinit {
        authTask?.cancel()
    }

    var userId: UUID? { session?.user.id }

    func signIn(email: String, password: String) async throws {
        try await supabase.auth.signIn(email: email, password: password)
    }

    /// Возвращает true, если после регистрации сразу выдана сессия
    /// (т.е. подтверждение email отключено в настройках проекта).
    func signUp(email: String, password: String) async throws -> Bool {
        let response = try await supabase.auth.signUp(email: email, password: password)
        return response.session != nil
    }

    func signOut() async throws {
        try await supabase.auth.signOut()
    }
}
