import SwiftUI

struct RegisterView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage: String?
    @State private var isLoading = false
    @State private var pendingConfirmation = false

    var body: some View {
        VStack(spacing: 16) {
            if pendingConfirmation {
                Text("Проверьте почту")
                    .font(.title2.bold())
                Text(
                    "Мы отправили письмо со ссылкой для подтверждения на \(email). "
                        + "Перейдите по ссылке из письма, чтобы завершить регистрацию."
                )
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
            } else {
                Text("Регистрация в LIFERA")
                    .font(.title2.bold())

                TextField("Email", text: $email)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .textFieldStyle(.roundedBorder)

                SecureField("Пароль (минимум 6 символов)", text: $password)
                    .textFieldStyle(.roundedBorder)

                if let errorMessage {
                    Text(errorMessage)
                        .font(.footnote)
                        .foregroundStyle(.red)
                }

                Button {
                    Task { await register() }
                } label: {
                    if isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("Зарегистрироваться")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(email.isEmpty || password.count < 6 || isLoading)
            }

            Spacer()
        }
        .padding()
        .navigationTitle("Регистрация")
    }

    private func register() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }
        do {
            let hasSession = try await auth.signUp(email: email, password: password)
            if !hasSession {
                pendingConfirmation = true
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
