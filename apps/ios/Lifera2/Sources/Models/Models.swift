import Foundation

// Модели повторяют схему supabase/migrations/0001_lifera2_foundation.sql

struct LifeArea: Codable, Identifiable, Hashable {
    let id: UUID
    let name: String
    let icon: String?
    let color: String?
    let kind: String?
    let sortOrder: Int
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, name, icon, color, kind
        case sortOrder = "sort_order"
        case createdAt = "created_at"
    }
}

struct NewLifeArea: Encodable {
    let name: String
    let userId: UUID

    enum CodingKeys: String, CodingKey {
        case name
        case userId = "user_id"
    }
}

struct Item: Codable, Identifiable, Hashable {
    let id: UUID
    let title: String
    let description: String?
    let status: String
    let dueDate: Date?
    let priority: String?

    enum CodingKeys: String, CodingKey {
        case id, title, description, status, priority
        case dueDate = "due_date"
    }
}

struct NewItem: Encodable {
    let title: String
    let lifeAreaId: UUID

    enum CodingKeys: String, CodingKey {
        case title
        case lifeAreaId = "life_area_id"
    }
}

struct CustomField: Codable, Identifiable, Hashable {
    let id: UUID
    let name: String
    let type: String
    let options: [String]?
}
