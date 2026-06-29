import SwiftUI

struct HolidayListView: View {
    @State private var viewModel = HolidayListViewModel()

    var body: some View {
        NavigationSplitView {
            List {
                switch viewModel.holidays {
                case .idle:
                    EmptyView()
                    
                case .loading:
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .listRowSeparator(.hidden)
                    
                case .success(let value), .reloading(let value):
                    ForEach(value) { holiday in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(holiday.name)
                                .font(.headline)
                            Text(holiday.date)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    
                case .failure(let error), .retrying(let error):
                    ContentUnavailableView(
                        error.title,
                        systemImage: "exclamationmark.triangle",
                        description: Text(error.message)
                    )
                    .listRowSeparator(.hidden)
                }
            }
            .refreshable { await viewModel.refresh() }
            .task { await viewModel.onAppear() }
            .navigationTitle("Holidays")
        } detail: {
        }
    }
}

#Preview {
    HolidayListView()
}
