import Dependencies
import Foundation
import Observation

@MainActor
@Observable
public final class HolidayListViewModel {
    public var from: Date {
        didSet { guard from != oldValue else { return }; reloadTask() }
    }
    public var to: Date {
        didSet { guard to != oldValue else { return }; reloadTask() }
    }
    public private(set) var holidays: DataState<[Holiday], DomainError> = .idle

    @ObservationIgnored
    @Dependency(\.calendarAPIClient) private var calendarAPIClient

    @ObservationIgnored
    private var currentTask: Task<Void, Never>?

    public init() {
        let now = Date()
        let calendar = Calendar.current
        self.from = calendar.date(byAdding: .month, value: -1, to: now) ?? now
        self.to = calendar.date(byAdding: .month, value: 12, to: now) ?? now
    }

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

    private func reloadTask() {
        currentTask?.cancel()
        currentTask = Task { [weak self] in
            await self?.refresh()
        }
    }

    private func load() async {
        do {
            let value = try await calendarAPIClient.getHolidaysInRange(from, to)
            holidays = .success(value)
        } catch {
            holidays = .failure(.init(error))
        }
    }
}
