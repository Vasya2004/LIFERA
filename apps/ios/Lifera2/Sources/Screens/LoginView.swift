import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage: String?
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Text("Вход в LIFERA 2.0")
                    .font(.title2.bold())

                TextField("Email", text: $email)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .textFieldStyle(.roundedBorder)

                SecureField("Пароль", text: $password)
                    .textFieldStyle(.roundedBorder)

                if let errorMessage {
                    Text(errorMessage)
                        .font(.footnote)
                        .foregroundStyle(.red)
                }

                Button {
                    Task { await signIn() }
                } label: {
                    if isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("Войти")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(email.isEmpty || password.isEmpty || isLoading)

                NavigationLink("Нет аккаунта? Зарегистрироваться") {
                    RegisterView()
                }
                .font(.footnote)

                Spacer()
            }
            .padding()
        }
    }

    private func signIn() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }
        do {
            try await auth.signIn(email: email, password: password)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
