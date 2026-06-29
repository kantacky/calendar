import SwiftUI

struct RootView: View {
    var body: some View {
        TabView {
            Tab("Holidays", systemImage: "calendar.badge.exclamationmark") {
                HolidayListView()
            }
        }
    }
}

#Preview {
    RootView()
}
