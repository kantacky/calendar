import CalendarAPI
import Connect
import Dependencies
import DependenciesMacros
import Foundation

@DependencyClient
public struct CalendarAPIClient: Sendable {
    public var getHolidaysInRange: @Sendable (_ from: Date, _ to: Date) async throws -> [Holiday]
}

extension CalendarAPIClient: DependencyKey {
    public static var liveValue: CalendarAPIClient {
        let protocolClient = ProtocolClient(
            httpClient: URLSessionHTTPClient(),
            config: ProtocolClientConfig(
                host: "https://api.calendar.kantacky.com",
                networkProtocol: .connect,
                codec: ProtoCodec()
            )
        )
        let service = Holiday_V1_HolidaysServiceClient(client: protocolClient)
        ISO8601DateFormatter.shared.formatOptions = [.withFullDate]

        return CalendarAPIClient(
            getHolidaysInRange: { from, to in
                var request = Holiday_V1_GetHolidaysInRangeRequest()
                request.from = ISO8601DateFormatter.shared.string(from: from)
                request.to = ISO8601DateFormatter.shared.string(from: to)
                let response = await service.getHolidaysInRange(request: request)
                if let error = response.error {
                    throw error
                }
                let events = response.message?.events ?? []
                return events.map { Holiday(date: $0.date, name: $0.name) }
            }
        )
    }
}

extension CalendarAPIClient: TestDependencyKey {
    public static let testValue = CalendarAPIClient()
}

extension DependencyValues {
    public var calendarAPIClient: CalendarAPIClient {
        get { self[CalendarAPIClient.self] }
        set { self[CalendarAPIClient.self] = newValue }
    }
}
