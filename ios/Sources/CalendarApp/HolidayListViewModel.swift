import Dependencies
import Foundation
import Observation

@MainActor
@Observable
public final class HolidayListViewModel {
    public private(set) var holidays: DataState<[Holiday], DomainError> = .idle

    @ObservationIgnored
    @Dependency(\.calendarAPIClient) private var calendarAPIClient

    public init() {}

    public func onAppear() async {
        holidays = .loading
        await load()
    }

    public func refresh() async {
        if let value = holidays.value {
            holidays = .reloading(value)
        } else if let error = holidays.error {
            holidays = .retrying(error)
        } else {
            holidays = .loading
        }
        await load()
    }

    private func load() async {
        do {
            let now = Date()
            let calendar = Calendar.current
            let from = calendar.date(byAdding: .month, value: -1, to: now) ?? now
            let to = calendar.date(byAdding: .month, value: 12, to: now) ?? now
            let value = try await calendarAPIClient.getHolidaysInRange(from, to)
            holidays = .success(value)
        } catch {
            holidays = .failure(.init(error))
        }
    }
}
