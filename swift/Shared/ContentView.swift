//
//  ContentView.swift
//  Shared
//
//  Created by 黃孟遠 on 2021/12/4.
//

import SwiftUI
import RMQClient

struct ContentView: View {
    @ObservedObject var receiver = Receiver()
    
    var body: some View {
        Text(receiver.text)
            .padding()
            .frame(width: 400, height: 400, alignment: .center)
            .onAppear(perform: {
                receiver.receive()
            })
            .onDisappear(perform: {
                receiver.conn.close()
            })
    }
}

class Receiver: ObservableObject {
    @Published var text: String
    
    init() {
        text = "Waiting ..."
    }
    
    lazy var tlsOptions = RMQTLSOptions(peerName: "swift", verifyPeer: false, pkcs12: nil, pkcs12Password: nil)
    lazy var conn = RMQConnection(
        uri: "amqps://guest:guest@localhost:8081",
        tlsOptions: tlsOptions,
        delegate: RMQConnectionDelegateLogger()
    )
    
    func receive() {
        conn.start()
        let ch = conn.createChannel()
        _ = ch.basicConsume("tasks", options: .noAck) { message in
            if let data = message.body, let decoded = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    self.text = decoded
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
