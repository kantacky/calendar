import Foundation

public struct Holiday: Identifiable, Hashable, Sendable {
    public let date: String
    public let name: String

    public var id: String { "\(date)-\(name)" }

    public init(date: String, name: String) {
        self.date = date
        self.name = name
    }
}
