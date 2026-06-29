public protocol DomainErrorProtocol: Error, Equatable, Sendable {
    init (_ error: Error)
    
    var title: LocalizedStringKey { get }
    
    var message: LocalizedStringKey { get }
}

public enum DomainError: DomainErrorProtocol {
    case unknown(Error)
    
    public init (_ error: Error) {
        if let error = error as? DomainError {
            self = error
            return
        }
        self = .unknown(error)
    }
    
    public var title: LocalizedStringKey {
        switch self {
        case .unknown:
            "Unknown Error"
        }
    }
    
    public var message: LocalizedStringKey {
        switch self {
        case .unknown(let error):
            LocalizedStringKey(error.localizedDescription)
        }
    }

    public static func == (lhs: DomainError, rhs: DomainError) -> Bool {
        switch (lhs, rhs) {
        case (.unknown, .unknown):
            return true
        @unknown default:
            return false
        }
    }
}
