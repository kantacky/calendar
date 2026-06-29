public enum DataState<T, E>: Sendable, Equatable where T: Sendable & Equatable, E: DomainErrorProtocol {
    case idle
    case loading
    case success(T)
    case failure(E)
    case reloading(T)
    case retrying(E)
    
    var value: T? {
        switch self {
        case .success(let value), .reloading(let value):
            return value
        default:
            return nil
        }
    }
    
    var error: E? {
        switch self {
        case .failure(let error), .retrying(let error):
            return error
        default:
            return nil
        }
    }
}
