//
//  main.swift
//  Emotions
//
//  Created by David Wang on 1/15/17.
//  Copyright © 2017 HCDE. All rights reserved.
//

import Foundation
import AVFoundation
import Cocoa

NSApplication.shared()

let capture = Capture()

var captureCounter = 0
var latestMessage = [String : Any]()

let socket = SocketIOClient(socketURL: URL(string:"http://127.0.0.1:3001")!, config: [.log(true)])
socket.on("connect") {(data, ack) in
    print("=====Socket connected to server=====")
}

var timer: Timer!

func createTimer() {
    timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true, block: { thisTimer in
        let imageData = capture.capture()
        var request = URLRequest(url: URL(string: "https://api.projectoxford.ai/emotion/v1.0/recognize")!)
        request.httpMethod = "POST"
        request.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        // API Key below
        request.setValue("", forHTTPHeaderField: "Ocp-Apim-Subscription-Key")
        request.httpBody = imageData
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("error=\(error)")
                return
            }
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {
                print("response = \(response)")
            }
            let responseString = String(data: data, encoding: .utf8)
            print("responseString = \(responseString!)")
            socket.emit("emote", ["response": responseString!, "reference": latestMessage["user"], "time": latestMessage["time"], "channel": latestMessage["channel"]])
        }
        task.resume()
        captureCounter -= 1
        if (captureCounter < 1) {
            thisTimer.invalidate()
        }
    })
}

socket.on("message") {data, ack in
    print("Got message \(data[0])")
    ack.with("Got message")
    latestMessage = data[0] as! [String : Any]
    captureCounter = 10
    if timer == nil {
        createTimer()
    } else {
        if !timer.isValid {
            createTimer()
        }
    }
}
socket.connect()

NSApp.run()
