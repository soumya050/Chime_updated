"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoMeetingApp = void 0;
require("../../style.scss");
require("bootstrap");
const index_1 = require("../../../../src/index");
const { v4: uuidv4 } = require('uuid');
class DemoMeetingApp {
    constructor() {
        this.cameraDeviceIds = [];
        this.microphoneDeviceIds = [];
        this.meeting = null;
        this.name = null;
        this.region = null;
        this.meetingSession = null;
        this.audioVideo = null;
        this.meetingReadinessChecker = null;
        this.canStartLocalVideo = true;
        this.canHear = null;
        // feature flags
        this.enableWebAudio = false;
        this.enableUnifiedPlanForChromiumBasedBrowsers = false;
        this.enableSimulcast = false;
        this.markdown = require('markdown-it')({ linkify: true });
        this.lastMessageSender = null;
        this.lastReceivedMessageTimestamp = 0;
        this.getAudioInputDevice = () => __awaiter(this, void 0, void 0, function* () {
            const audioInputDevices = yield this.deviceController.listAudioInputDevices();
            const dropdownList = document.getElementById('audio-input');
            return this.getDevice(audioInputDevices, dropdownList);
        });
        this.getAudioOutputDevice = () => __awaiter(this, void 0, void 0, function* () {
            const audioOutputDevices = yield this.deviceController.listAudioOutputDevices();
            const dropdownList = document.getElementById('audio-output');
            return this.getDevice(audioOutputDevices, dropdownList);
        });
        this.getVideoInputDevice = () => __awaiter(this, void 0, void 0, function* () {
            const videoInputDevices = yield this.deviceController.listVideoInputDevices();
            const dropdownList = document.getElementById('video-input');
            return this.getDevice(videoInputDevices, dropdownList);
        });
        this.getDevice = (deviceList, dropdownList) => __awaiter(this, void 0, void 0, function* () {
            let device = deviceList[0];
            for (let i = 0; i < deviceList.length; i++) {
                if (deviceList[i].deviceId === dropdownList.value) {
                    device = deviceList[i];
                }
            }
            return device;
        });
        this.audioTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('speaker-test', 'spinner-border');
            const audioOutput = yield this.getAudioOutputDevice();
            let speakerUserFeedbackHtml = document.getElementById('speaker-user-feedback');
            let audioElement = document.getElementById('speaker-test-audio-element');
            speakerUserFeedbackHtml.style.display = 'inline-block';
            const audioOutputResp = yield this.meetingReadinessChecker.checkAudioOutput(audioOutput, () => {
                return new Promise(resolve => {
                    const scheduler = new index_1.IntervalScheduler(1000);
                    scheduler.start(() => {
                        if (this.canHear !== null) {
                            scheduler.stop();
                            resolve(this.canHear);
                        }
                    });
                });
            }, audioElement);
            let textToDisplay = index_1.CheckAudioOutputFeedback[audioOutputResp];
            this.createReadinessHtml('speaker-test', textToDisplay);
            speakerUserFeedbackHtml.style.display = 'none';
            return audioOutputResp;
        });
        this.micTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('mic-test', 'spinner-border');
            const audioInput = yield this.getAudioInputDevice();
            const audioInputResp = yield this.meetingReadinessChecker.checkAudioInput(audioInput);
            this.createReadinessHtml('mic-test', index_1.CheckAudioInputFeedback[audioInputResp]);
            return audioInputResp;
        });
        this.videoTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('video-test', 'spinner-border');
            const videoInput = yield this.getVideoInputDevice();
            const videoInputResp = yield this.meetingReadinessChecker.checkVideoInput(videoInput);
            let textToDisplay = index_1.CheckVideoInputFeedback[videoInputResp];
            this.createReadinessHtml('video-test', textToDisplay);
            return videoInputResp;
        });
        this.cameraTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('camera-test2', 'spinner-border');
            const videoInput = yield this.getVideoInputDevice();
            const cameraResolutionResp1 = yield this.meetingReadinessChecker.checkCameraResolution(videoInput, 640, 480);
            const cameraResolutionResp2 = yield this.meetingReadinessChecker.checkCameraResolution(videoInput, 1280, 720);
            const cameraResolutionResp3 = yield this.meetingReadinessChecker.checkCameraResolution(videoInput, 1920, 1080);
            let textToDisplay = `${index_1.CheckCameraResolutionFeedback[cameraResolutionResp1]}@640x480p`;
            this.createReadinessHtml('camera-test1', textToDisplay);
            textToDisplay = `${index_1.CheckCameraResolutionFeedback[cameraResolutionResp2]}@1280x720p`;
            this.createReadinessHtml('camera-test2', textToDisplay);
            textToDisplay = `${index_1.CheckCameraResolutionFeedback[cameraResolutionResp3]}@1920x1080p`;
            this.createReadinessHtml('camera-test3', textToDisplay);
            return;
        });
        this.contentShareTest = () => __awaiter(this, void 0, void 0, function* () {
            const button = document.getElementById('contentshare-button');
            button.disabled = false;
        });
        this.audioConnectivityTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('audioconnectivity-test', 'spinner-border');
            const audioInput = yield this.getAudioInputDevice();
            const audioConnectivityResp = yield this.meetingReadinessChecker.checkAudioConnectivity(audioInput);
            this.createReadinessHtml('audioconnectivity-test', index_1.CheckAudioConnectivityFeedback[audioConnectivityResp]);
            return audioConnectivityResp;
        });
        this.videoConnectivityTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('videoconnectivity-test', 'spinner-border');
            let videoInput = yield this.getVideoInputDevice();
            let videoConnectivityResp = yield this.meetingReadinessChecker.checkVideoConnectivity(videoInput);
            this.createReadinessHtml('videoconnectivity-test', index_1.CheckVideoConnectivityFeedback[videoConnectivityResp]);
            return videoConnectivityResp;
        });
        this.networkTcpTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('networktcp-test', 'spinner-border');
            let networkTcpResp = yield this.meetingReadinessChecker.checkNetworkTCPConnectivity();
            this.createReadinessHtml('networktcp-test', index_1.CheckNetworkTCPConnectivityFeedback[networkTcpResp]);
            return networkTcpResp;
        });
        this.networkUdpTest = () => __awaiter(this, void 0, void 0, function* () {
            this.createReadinessHtml('networkudp-test', 'spinner-border');
            let networkUdpResp = yield this.meetingReadinessChecker.checkNetworkUDPConnectivity();
            this.createReadinessHtml('networkudp-test', index_1.CheckNetworkUDPConnectivityFeedback[networkUdpResp]);
            return networkUdpResp;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.app = this;
        document.getElementById('sdk-version-readiness').innerText =
            'amazon-chime-sdk-js@' + index_1.Versioning.sdkVersion;
        this.initEventListeners();
        this.initParameters();
        this.setMediaRegion();
        this.switchToFlow('flow-authenticate');
    }
    switchToFlow(flow) {
        this.analyserNodeCallback = () => { };
        Array.from(document.getElementsByClassName('flow')).map(e => (e.style.display = 'none'));
        document.getElementById(flow).style.display = 'block';
    }
    initParameters() {
        this.defaultBrowserBehaviour = new index_1.DefaultBrowserBehavior();
        // Initialize logger and device controller to populate device list
        new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
            yield this.initializeLoggerAndDeviceController();
            const button = document.getElementById("authenticate");
            button.disabled = false;
        }));
    }
    startMeetingAndInitializeMeetingReadinessChecker() {
        return __awaiter(this, void 0, void 0, function* () {
            //start meeting
            let chimeMeetingId = '';
            this.meeting = `READINESS_CHECKER-${uuidv4()}`;
            this.name = `READINESS_CHECKER${uuidv4()}`;
            try {
                this.region = document.getElementById('inputRegion').value;
                chimeMeetingId = yield this.authenticate();
                this.log(`chimeMeetingId: ${chimeMeetingId}`);
                return chimeMeetingId;
            }
            catch (error) {
                const httpErrorMessage = 'UserMedia is not allowed in HTTP sites. Either use HTTPS or enable media capture on insecure sites.';
                document.getElementById('failed-meeting').innerText = `Meeting ID: ${this.meeting}`;
                document.getElementById('failed-meeting-error').innerText =
                    window.location.protocol === 'http:' ? httpErrorMessage : error.message;
                this.switchToFlow('flow-failed-meeting');
                return null;
            }
        });
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            let joinInfo = (yield this.joinMeeting()).JoinInfo;
            const configuration = new index_1.MeetingSessionConfiguration(joinInfo.Meeting, joinInfo.Attendee);
            yield this.initializeMeetingSession(configuration);
            return configuration.meetingId;
        });
    }
    createLogStream(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                meetingId: configuration.meetingId,
                attendeeId: configuration.credentials.attendeeId,
            });
            try {
                const response = yield fetch(`${DemoMeetingApp.BASE_URL}create_log_stream`, {
                    method: 'POST',
                    body
                });
                if (response.status === 200) {
                    console.log('Log stream created');
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    createReadinessHtml(id, textToDisplay) {
        const readinessElement = document.getElementById(id);
        readinessElement.innerHTML = '';
        readinessElement.innerText = textToDisplay;
        if (id === 'readiness-header') {
            return;
        }
        else if (textToDisplay === 'spinner-border') {
            readinessElement.innerHTML = '';
            readinessElement.className = '';
            readinessElement.className = 'spinner-border';
        }
        else if (textToDisplay.includes('Succeeded')) {
            readinessElement.className = '';
            readinessElement.className = 'badge badge-success';
        }
        else {
            readinessElement.className = 'badge badge-warning';
        }
    }
    initEventListeners() {
        //event listener for user feedback for speaker output
        document.getElementById('speaker-yes').addEventListener('input', e => {
            e.preventDefault();
            this.canHear = true;
        });
        document.getElementById('speaker-no').addEventListener('input', e => {
            e.preventDefault();
            this.canHear = false;
        });
        const contentShareButton = document.getElementById('contentshare-button');
        contentShareButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            contentShareButton.style.display = 'none';
            const contentShareResult = document.getElementById('contentshare-test');
            contentShareResult.style.display = 'inline-block';
            this.createReadinessHtml('contentshare-test', 'spinner-border');
            const contentShareResp = yield this.meetingReadinessChecker.checkContentShareConnectivity();
            this.createReadinessHtml('contentshare-test', index_1.CheckContentShareConnectivityFeedback[contentShareResp]);
            contentShareButton.disabled = true;
        }));
        document.getElementById('form-authenticate').addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (!!(yield this.startMeetingAndInitializeMeetingReadinessChecker())) {
                this.switchToFlow('flow-readinesstest');
                //create new HTML header
                document.getElementById('sdk-version').innerText =
                    'amazon-chime-sdk-js@' + index_1.Versioning.sdkVersion;
                this.createReadinessHtml('readiness-header', 'Readiness tests underway...');
                yield this.audioTest();
                yield this.micTest();
                yield this.videoTest();
                yield this.cameraTest();
                yield this.networkUdpTest();
                yield this.networkTcpTest();
                yield this.audioConnectivityTest();
                yield this.videoConnectivityTest();
                yield this.contentShareTest();
                this.createReadinessHtml('readiness-header', 'Readiness tests complete!');
            }
        }));
    }
    initializeLoggerAndDeviceController(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger;
            const logLevel = index_1.LogLevel.INFO;
            const consoleLogger = (logger = new index_1.ConsoleLogger('SDK', logLevel));
            if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') || configuration == null) {
                this.logger = consoleLogger;
            }
            else {
                yield this.createLogStream(configuration);
                this.logger = new index_1.MultiLogger(consoleLogger, new index_1.MeetingSessionPOSTLogger('SDK', configuration, DemoMeetingApp.LOGGER_BATCH_SIZE, DemoMeetingApp.LOGGER_INTERVAL_MS, `${DemoMeetingApp.BASE_URL}logs`, logLevel));
            }
            this.deviceController = new index_1.DefaultDeviceController(logger, { enableWebAudio: this.enableWebAudio });
            yield this.populateAllDeviceLists();
        });
    }
    initializeMeetingSession(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeLoggerAndDeviceController(configuration);
            configuration.enableUnifiedPlanForChromiumBasedBrowsers = this.enableUnifiedPlanForChromiumBasedBrowsers;
            configuration.attendeePresenceTimeoutMs = 15000;
            configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = this.enableSimulcast;
            this.meetingSession = new index_1.DefaultMeetingSession(configuration, this.logger, this.deviceController);
            this.audioVideo = this.meetingSession.audioVideo;
            this.meetingReadinessChecker = new index_1.DefaultMeetingReadinessChecker(this.logger, this.meetingSession);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            global.meetingReadinessChecker = this.meetingReadinessChecker;
            this.setupDeviceLabelTrigger();
        });
    }
    setupDeviceLabelTrigger() {
        // Note that device labels are privileged since they add to the
        // fingerprinting surface area of the browser session. In Chrome private
        // tabs and in all Firefox tabs, the labels can only be read once a
        // MediaStream is active. How to deal with this restriction depends on the
        // desired UX. The device controller includes an injectable device label
        // trigger which allows you to perform custom behavior in case there are no
        // labels, such as creating a temporary audio/video stream to unlock the
        // device names, which is the default behavior. Here we override the
        // trigger to also show an alert to let the user know that we are asking for
        // mic/camera permission.
        //
        // Also note that Firefox has its own device picker, which may be useful
        // for the first device selection. Subsequent device selections could use
        // a custom UX with a specific device id.
        this.audioVideo.setDeviceLabelTrigger(() => __awaiter(this, void 0, void 0, function* () {
            const stream = yield navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            return stream;
        }));
    }
    populateAllDeviceLists() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.populateAudioInputList();
            yield this.populateVideoInputList();
            yield this.populateAudioOutputList();
        });
    }
    populateAudioInputList() {
        return __awaiter(this, void 0, void 0, function* () {
            const genericName = 'Microphone';
            const additionalDevices = ['None'];
            this.populateDeviceList('audio-input', genericName, yield this.deviceController.listAudioInputDevices(), additionalDevices);
        });
    }
    populateVideoInputList() {
        return __awaiter(this, void 0, void 0, function* () {
            const genericName = 'Camera';
            const additionalDevices = ['None'];
            this.populateDeviceList('video-input', genericName, yield this.deviceController.listVideoInputDevices(), additionalDevices);
            const cameras = yield this.deviceController.listVideoInputDevices();
            this.cameraDeviceIds = cameras.map(deviceInfo => {
                return deviceInfo.deviceId;
            });
        });
    }
    populateAudioOutputList() {
        return __awaiter(this, void 0, void 0, function* () {
            const genericName = 'Speaker';
            const additionalDevices = [];
            this.populateDeviceList('audio-output', genericName, yield this.deviceController.listAudioOutputDevices(), additionalDevices);
        });
    }
    populateDeviceList(elementId, genericName, devices, additionalOptions) {
        const list = document.getElementById(elementId);
        while (list.firstElementChild) {
            list.removeChild(list.firstElementChild);
        }
        for (let i = 0; i < devices.length; i++) {
            const option = document.createElement('option');
            list.appendChild(option);
            option.text = devices[i].label || `${genericName} ${i + 1}`;
            option.value = devices[i].deviceId;
        }
        if (additionalOptions.length > 0) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.text = '──────────';
            list.appendChild(separator);
            for (const additionalOption of additionalOptions) {
                const option = document.createElement('option');
                list.appendChild(option);
                option.text = additionalOption;
                option.value = additionalOption;
            }
        }
        if (!list.firstElementChild) {
            const option = document.createElement('option');
            option.text = 'Device selection unavailable';
            list.appendChild(option);
        }
    }
    join() {
        return __awaiter(this, void 0, void 0, function* () {
            window.addEventListener('unhandledrejection', (event) => {
                this.log(event.reason);
            });
            this.audioVideo.start();
        });
    }
    // eslint-disable-next-line
    joinMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${DemoMeetingApp.BASE_URL}join?title=${encodeURIComponent(this.meeting)}&name=${encodeURIComponent(this.name)}&region=${encodeURIComponent(this.region)}`, {
                method: 'POST',
            });
            const json = yield response.json();
            if (json.error) {
                throw new Error(`Server error: ${json.error}`);
            }
            return json;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    endMeeting() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${DemoMeetingApp.BASE_URL}end?title=${encodeURIComponent(this.meeting)}`, {
                method: 'POST',
            });
        });
    }
    getSupportedMediaRegions() {
        const supportedMediaRegions = [];
        const mediaRegion = document.getElementById('inputRegion');
        for (let i = 0; i < mediaRegion.length; i++) {
            supportedMediaRegions.push(mediaRegion.value);
        }
        return supportedMediaRegions;
    }
    getNearestMediaRegion() {
        return __awaiter(this, void 0, void 0, function* () {
            const nearestMediaRegionResponse = yield fetch(`https://nearest-media-region.l.chime.aws`, {
                method: 'GET',
            });
            const nearestMediaRegionJSON = yield nearestMediaRegionResponse.json();
            const nearestMediaRegion = nearestMediaRegionJSON.region;
            return nearestMediaRegion;
        });
    }
    setMediaRegion() {
        new index_1.AsyncScheduler().start(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const nearestMediaRegion = yield this.getNearestMediaRegion();
                if (nearestMediaRegion === '' || nearestMediaRegion === null) {
                    throw new Error('Nearest Media Region cannot be null or empty');
                }
                const supportedMediaRegions = this.getSupportedMediaRegions();
                if (supportedMediaRegions.indexOf(nearestMediaRegion) === -1) {
                    supportedMediaRegions.push(nearestMediaRegion);
                    const mediaRegionElement = document.getElementById('inputRegion');
                    const newMediaRegionOption = document.createElement('option');
                    newMediaRegionOption.value = nearestMediaRegion;
                    newMediaRegionOption.text = nearestMediaRegion + ' (' + nearestMediaRegion + ')';
                    mediaRegionElement.add(newMediaRegionOption, null);
                }
                document.getElementById('inputRegion').value = nearestMediaRegion;
            }
            catch (error) {
                this.log('Default media region selected: ' + error.message);
            }
        }));
    }
    log(str) {
        console.log(`[Meeting Readiness Checker] ${str}`);
    }
}
exports.DemoMeetingApp = DemoMeetingApp;
DemoMeetingApp.BASE_URL = [
    location.protocol,
    '//',
    location.host,
    location.pathname.replace(/\/*$/, '/'),
].join('');
DemoMeetingApp.LOGGER_BATCH_SIZE = 85;
DemoMeetingApp.LOGGER_INTERVAL_MS = 2000;
window.addEventListener('load', () => {
    new DemoMeetingApp();
});
//# sourceMappingURL=meetingReadinessChecker.js.map