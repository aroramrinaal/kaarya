import WidgetKit
import SwiftUI
import Foundation

// Shared constants
private let appGroupId = "group.aroramrinaal.kaarya"
private let sharedTasksKey = "kaarya_today_tasks"

struct WidgetTask: Codable, Identifiable {
    let id: String
    let title: String
    let completed: Bool
}

extension Color {
    init?(hex: String) {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if hexString.hasPrefix("#") { hexString.removeFirst() }
        guard hexString.count == 6, let rgb = UInt64(hexString, radix: 16) else { return nil }
        let r = Double((rgb & 0xFF0000) >> 16) / 255.0
        let g = Double((rgb & 0x00FF00) >> 8) / 255.0
        let b = Double(rgb & 0x0000FF) / 255.0
        self = Color(red: r, green: g, blue: b)
    }
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(), tasks: sampleTasks())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        let tasks = readTasks()
        return SimpleEntry(date: Date(), configuration: configuration, tasks: tasks)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let tasks = readTasks()
        let entry = SimpleEntry(date: Date(), configuration: configuration, tasks: tasks)
        return Timeline(entries: [entry], policy: .atEnd)
    }

    private func readTasks() -> [WidgetTask] {
        let defaults = UserDefaults(suiteName: appGroupId)
        // 1) Try data payload (JSON)
        if let data = defaults?.data(forKey: sharedTasksKey) {
            if let list = try? JSONDecoder().decode([WidgetTask].self, from: data) { return list }
        }
        // 2) Try string payload (JSON)
        if let json = defaults?.string(forKey: sharedTasksKey), let data = json.data(using: .utf8) {
            if let list = try? JSONDecoder().decode([WidgetTask].self, from: data) { return list }
        }
        // 3) Try plist array payload
        if let array = defaults?.array(forKey: sharedTasksKey) as? [[String: Any]] {
            let list: [WidgetTask] = array.compactMap { dict in
                guard let id = dict["id"] as? String,
                      let title = dict["title"] as? String else { return nil }
                var completedBool: Bool = false
                if let b = dict["completed"] as? Bool {
                    completedBool = b
                } else if let n = dict["completed"] as? NSNumber {
                    completedBool = n.intValue != 0
                } else if let i = dict["completed"] as? Int {
                    completedBool = i != 0
                } else if let s = dict["completed"] as? String {
                    completedBool = (s == "1" || s.lowercased() == "true")
                }
                return WidgetTask(id: id, title: title, completed: completedBool)
            }
            return list
        }
        return []
    }

    private func sampleTasks() -> [WidgetTask] {
        return [
            WidgetTask(id: "1", title: "Sample Kaarya", completed: false),
            WidgetTask(id: "2", title: "Another Kaarya", completed: true)
        ]
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let tasks: [WidgetTask]
}

struct widgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        let bg = Color(hex: "#FAEBD7") ?? .clear
        let textColor = Color(hex: "#90574D") ?? .primary
        VStack(alignment: .leading, spacing: 6) {
            Text("Kaarya Today")
                .font(.headline)
                .foregroundStyle(textColor)
            if entry.tasks.isEmpty {
                Text("No tasks yet")
                    .font(.subheadline)
                    .foregroundStyle(textColor)
            } else {
                ForEach(entry.tasks.prefix(3)) { task in
                    HStack(alignment: .center, spacing: 6) {
                        Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                            .font(.caption)
                            .foregroundStyle(textColor)
                        Text(task.title)
                            .font(.subheadline)
                            .lineLimit(1)
                            .foregroundStyle(textColor)
                    }
                }
                if entry.tasks.count > 3 {
                    Text("+\(entry.tasks.count - 3) more…")
                        .font(.caption)
                        .foregroundStyle(textColor.opacity(0.8))
                }
            }
            Spacer(minLength: 0)
        }
        .containerBackground(bg, for: .widget)
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
                .widgetURL(URL(string: "kaarya://todo"))
        }
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

//#Preview(as: .systemSmall) {
//    widget()
//} timeline: {
//    SimpleEntry(date: .now, configuration: .smiley, tasks: [])
//    SimpleEntry(date: .now, configuration: .starEyes, tasks: [])
//}
