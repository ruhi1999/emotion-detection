//
//  capture.swift
//  Emotions
//
//  Created by David Wang on 2/7/17.
//  Copyright © 2017 HCDE. All rights reserved.
//

import Foundation
import AVFoundation

class Capture {
    var session:AVCaptureSession = AVCaptureSession()
    var stillImageOutput = AVCaptureStillImageOutput()
    
    init() {
        session.sessionPreset = AVCaptureSessionPresetPhoto
        let device:AVCaptureDevice = AVCaptureDevice.defaultDevice(withMediaType: AVMediaTypeVideo)
        do {
            try session.addInput(AVCaptureDeviceInput(device: device))
        } catch let error as NSError {
            print(error.description)
        }
        stillImageOutput.outputSettings = [AVVideoCodecKey:AVVideoCodecJPEG]
        session.startRunning()
        if session.canAddOutput(stillImageOutput) {
            session.addOutput(stillImageOutput)
        }
        sleep(1)
    }
    
    deinit {
        session.stopRunning()
    }
    
    public func capture() -> Data {
        var imageData:Data?
        if let videoConnection = stillImageOutput.connection(withMediaType: AVMediaTypeVideo) {
            stillImageOutput.captureStillImageAsynchronously(from: videoConnection, completionHandler: { (imageDataSampleBuffer, error) -> Void in
                imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(imageDataSampleBuffer)
            })
            while(stillImageOutput.isCapturingStillImage) {usleep(1)}
        }
        return imageData!
    }
}
