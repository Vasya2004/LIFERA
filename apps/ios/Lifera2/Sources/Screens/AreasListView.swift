import SwiftUI

@MainActor
final class AreasViewModel: ObservableObject {
    @Published var areas: [LifeArea] = []
    @Published var errorMessage: String?

    func load() async {
        do {
            areas = try await supabase
                .from("life_areas")
                .select()
                .order("sort_order")
                .order("created_at")
                .execute()
                .value
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func createArea(name: String, userId: UUID) async {
        do {
            try await supabase
                .from("life_areas")
                .insert(NewLifeArea(name: name, userId: userId))
                .execute()
            await load()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

struct AreasListView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @StateObject private var viewModel = AreasViewModel()
    @State private var newAreaName = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                HStack {
                    TextField("Новая область, например «Здоровье»", text: $newAreaName)
                        .textFieldStyle(.roundedBorder)
                    Button("Добавить") {
                        Task { await addArea() }
                    }
                    .disabled(newAreaName.trimmingCharacters(in: .whitespaces).isEmpty)
                }
                .padding()

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .font(.footnote)
                        .foregroundStyle(.red)
                        .padding(.horizontal)
                }

                if viewModel.areas.isEmpty {
                    Spacer()
                    Text("Областей пока нет — добавь свою первую выше.")
                        .foregroundStyle(.secondary)
                    Spacer()
                } else {
                    List(viewModel.areas) { area in
                        NavigationLink(area.name) {
                            AreaDetailView(area: area)
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Мои области жизни")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Выйти") {
                        Task { try? await auth.signOut() }
                    }
                }
            }
            .task {
                await viewModel.load()
            }
        }
    }

    private func addArea() async {
        guard let userId = auth.userId else { return }
        let name = newAreaName.trimmingCharacters(in: .whitespaces)
        newAreaName = ""
        await viewModel.createArea(name: name, userId: userId)
    }
}
