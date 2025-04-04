import { IUser } from "@/lib/types";
import { Participant } from "@/providers/meetingProvider";
import { Peer } from "peerjs";
import { createContext } from "react";

interface MeetingContextType {
  joinRoom: (roomId: string) => void;
  me: Peer | undefined;
  getMediaDevices: () => Promise<void>;
  stream: MediaStream | null;
  camEnabled: boolean;
  micEnabled: boolean;
  toggleCamera: (roomId: string, mode: 'room' | 'setup') => Promise<void>;
  toggleMicrophone: (roomId: string, mode: 'room' | 'setup') => Promise<void>;
  microphoneDevices: MediaDeviceInfo[];
  cameraDevices: MediaDeviceInfo[];
  // getDevices: () => Promise<void>;
  activeCamera: MediaStreamTrack | undefined;
  activeMicrophone: MediaStreamTrack | undefined;
  changeActiveDevice: (deviceId: string, deviceType: "cam" | "mic") => Promise<void>;
  // remoteParticipants: Record<string, Participant>;
  remoteParticipants: Participant[];
  getUsers: (participants: IUser[]) => void;
  removeParticipant: (userId: string) => void;
  addParticipant: (participant: Participant) => void;
  addParticipantStream: (userId: string, stream: MediaStream) => void;
  updateParticipantCamera: (userId: string, enabled: boolean) => void;
  updateParticipantMicrophone: (userId: string, enabled: boolean) => void;
  // removeParticipantStream: (userId: string) => void;
}

export const MeetingContext = createContext<MeetingContextType | null>(null)