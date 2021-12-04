//
//  ContentView.swift
//  Shared
//
//  Created by 黃孟遠 on 2021/12/4.
//

import SwiftUI
import RMQClient

struct ContentView: View {
    @State private var text: String = "Waiting ..."
    
    var body: some View {
        Text(text)
            .padding()
            .frame(width: 400, height: 400, alignment: .center)
            .onAppear(perform: receive)
    }
    
    func receive() {
        let conn = RMQConnection(uri: "amqp://guest:guest@localhost:8081", delegate: RMQConnectionDelegateLogger())
        conn.start()
        let ch = conn.createChannel()
        _ = ch.basicConsume("tasks", options: .noAck) { message in
            if let data = message.body, let decoded = String(data: data, encoding: .utf8) {
                text = decoded
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
