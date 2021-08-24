import '../../style.scss';
import 'bootstrap';
import { AudioVideoFacade, CheckAudioConnectivityFeedback, CheckAudioInputFeedback, CheckAudioOutputFeedback, CheckNetworkTCPConnectivityFeedback, CheckNetworkUDPConnectivityFeedback, CheckVideoConnectivityFeedback, CheckVideoInputFeedback, DefaultBrowserBehavior, DefaultDeviceController, Logger, MeetingReadinessChecker, MeetingSession, MeetingSessionConfiguration } from '../../../../src/index';
export declare class DemoMeetingApp {
    static readonly BASE_URL: string;
    static readonly LOGGER_BATCH_SIZE: number;
    static readonly LOGGER_INTERVAL_MS: number;
    cameraDeviceIds: string[];
    microphoneDeviceIds: string[];
    meeting: string | null;
    name: string | null;
    region: string | null;
    meetingSession: MeetingSession | null;
    audioVideo: AudioVideoFacade | null;
    logger: Logger;
    deviceController: DefaultDeviceController;
    meetingReadinessChecker: MeetingReadinessChecker | null;
    canStartLocalVideo: boolean;
    defaultBrowserBehaviour: DefaultBrowserBehavior;
    canHear: boolean | null;
    enableWebAudio: boolean;
    enableUnifiedPlanForChromiumBasedBrowsers: boolean;
    enableSimulcast: boolean;
    markdown: any;
    lastMessageSender: string | null;
    lastReceivedMessageTimestamp: number;
    analyserNodeCallback: () => void;
    constructor();
    switchToFlow(flow: string): void;
    initParameters(): void;
    startMeetingAndInitializeMeetingReadinessChecker(): Promise<string>;
    authenticate(): Promise<string>;
    createLogStream(configuration: MeetingSessionConfiguration): Promise<void>;
    getAudioInputDevice: () => Promise<MediaDeviceInfo>;
    getAudioOutputDevice: () => Promise<MediaDeviceInfo>;
    getVideoInputDevice: () => Promise<MediaDeviceInfo>;
    getDevice: (deviceList: MediaDeviceInfo[], dropdownList: HTMLSelectElement) => Promise<MediaDeviceInfo>;
    audioTest: () => Promise<CheckAudioOutputFeedback>;
    micTest: () => Promise<CheckAudioInputFeedback>;
    videoTest: () => Promise<CheckVideoInputFeedback>;
    cameraTest: () => Promise<void>;
    contentShareTest: () => Promise<void>;
    audioConnectivityTest: () => Promise<CheckAudioConnectivityFeedback>;
    videoConnectivityTest: () => Promise<CheckVideoConnectivityFeedback>;
    networkTcpTest: () => Promise<CheckNetworkTCPConnectivityFeedback>;
    networkUdpTest: () => Promise<CheckNetworkUDPConnectivityFeedback>;
    createReadinessHtml(id: string, textToDisplay: string): void;
    initEventListeners(): void;
    initializeLoggerAndDeviceController(configuration?: MeetingSessionConfiguration): Promise<void>;
    initializeMeetingSession(configuration: MeetingSessionConfiguration): Promise<void>;
    setupDeviceLabelTrigger(): void;
    populateAllDeviceLists(): Promise<void>;
    populateAudioInputList(): Promise<void>;
    populateVideoInputList(): Promise<void>;
    populateAudioOutputList(): Promise<void>;
    populateDeviceList(elementId: string, genericName: string, devices: MediaDeviceInfo[], additionalOptions: string[]): void;
    join(): Promise<void>;
    joinMeeting(): Promise<any>;
    endMeeting(): Promise<any>;
    getSupportedMediaRegions(): string[];
    getNearestMediaRegion(): Promise<string>;
    setMediaRegion(): void;
    log(str: string): void;
}