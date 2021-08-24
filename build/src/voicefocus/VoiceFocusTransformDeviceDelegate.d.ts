import type { VoiceFocusDelegate } from '../../libs/voicefocus/types';
import VoiceFocusTransformDevice from './VoiceFocusTransformDevice';
import VoiceFocusTransformDeviceObserver from './VoiceFocusTransformDeviceObserver';
/** @internal */
export default class VoiceFocusTransformDeviceDelegate implements VoiceFocusDelegate {
    private observers;
    addObserver(observer: VoiceFocusTransformDeviceObserver): void;
    removeObserver(observer: VoiceFocusTransformDeviceObserver): void;
    /** @internal */
    onFallback(device: VoiceFocusTransformDevice, e: Error): void;
    onCPUWarning(): void;
}
