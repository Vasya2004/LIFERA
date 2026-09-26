import SwiftUI

@MainActor
final class AreaDetailViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var errorMessage: String?

    let area: LifeArea

    init(area: LifeArea) {
        self.area = area
    }

    func load() async {
        do {
            items = try await supabase
                .from("items")
                .select()
                .eq("life_area_id", value: area.id)
                .order("sort_order")
                .order("created_at")
                .execute()
                .value
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func createItem(title: String) async {
        do {
            try await supabase
                .from("items")
                .insert(NewItem(title: title, lifeAreaId: area.id))
                .execute()
            await load()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

// Кастомные поля (custom_fields/item_field_values) в iOS-заготовке пока
// не отображаются — см. реализацию в веб-версии (apps/web/src/app/areas/[id]/page.tsx)
// как образец для портирования.
struct AreaDetailView: View {
    @StateObject private var viewModel: AreaDetailViewModel
    @State private var newItemTitle = ""

    init(area: LifeArea) {
        _viewModel = StateObject(wrappedValue: AreaDetailViewModel(area: area))
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                TextField("Новая запись", text: $newItemTitle)
                    .textFieldStyle(.roundedBorder)
                Button("Добавить") {
                    Task { await addItem() }
                }
                .disabled(newItemTitle.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding()

            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .font(.footnote)
                    .foregroundStyle(.red)
                    .padding(.horizontal)
            }

            if viewModel.items.isEmpty {
                Spacer()
                Text("Записей пока нет.")
                    .foregroundStyle(.secondary)
                Spacer()
            } else {
                List(viewModel.items) { item in
                    HStack {
                        Text(item.title)
                        Spacer()
                        Text(item.status)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                .listStyle(.plain)
            }
        }
        .navigationTitle(viewModel.area.name)
        .task {
            await viewModel.load()
        }
    }

    private func addItem() async {
        let title = newItemTitle.trimmingCharacters(in: .whitespaces)
        newItemTitle = ""
        await viewModel.createItem(title: title)
    }
}
