import SwiftUI

struct RootView: View {
    @EnvironmentObject private var auth: AuthViewModel

    var body: some View {
        Group {
            if auth.isLoading {
                ProgressView()
            } else if auth.session != nil {
                AreasListView()
            } else {
                LoginView()
            }
        }
    }
}
