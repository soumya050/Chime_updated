import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import AudioVideoEventAttributes from './AudioVideoEventAttributes';
import DeviceEventAttributes from './DeviceEventAttributes';
import EventController from './EventController';
import EventName from './EventName';
import MeetingHistoryState from './MeetingHistoryState';
export default class DefaultEventController implements EventController {
    private audioVideoController;
    /** @internal */
    private static readonly UNAVAILABLE;
    /** @internal */
    private parserResult;
    /** @internal */
    private browserMajorVersion;
    /** @internal */
    private meetingHistoryStates;
    /** @internal */
    private browserName;
    /** @internal */
    private browserVersion;
    /** @internal */
    private deviceName;
    constructor(audioVideoController: AudioVideoController);
    publishEvent(name: EventName, attributes?: AudioVideoEventAttributes | DeviceEventAttributes): Promise<void>;
    pushMeetingState(state: MeetingHistoryState, timestampMs?: number): Promise<void>;
    private getAttributes;
}
