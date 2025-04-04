import { Participant } from "@/providers/meetingProvider";

export const participantsReducer = (state: Participant[], action: { type: 'ADD_PARTICIPANT' | 'ADD_PARTICIPANT_STREAM' | 'UPDATE_PARTICIPANT_CAMERA' | 'UPDATE_PARTICIPANT_MIC' | 'REMOVE_PARTICIPANT_STREAM' | 'REMOVE_PARTICIPANT' | 'UPDATE_PARTICIPANT'; payload: {participants?: Participant[], userId?: string, stream?: MediaStream | null, enabled?: boolean} }) => {
  switch (action.type) {
    case 'UPDATE_PARTICIPANT':
      return action.payload?.participants || state
    case 'ADD_PARTICIPANT_STREAM': {
      return state.map(participant => {
        if (participant.user.id === action.payload.userId) {
          return { ...participant, stream: action.payload.stream ?? null }
        }
        return participant
      })
    }
    case 'UPDATE_PARTICIPANT_CAMERA':
      return updateParticipantTrack(state, { payload: { enabled: action.payload.enabled!, userId: action.payload.userId! } }, 'video');
    case 'UPDATE_PARTICIPANT_MIC':
      return updateParticipantTrack(state, { payload: { enabled: action.payload.enabled!, userId: action.payload.userId! } }, 'audio');
    // case 'UPDATE_PARTICIPANT_CAMERA': {
    //   return state.map(participant => {
    //     if (participant.user.id === action.payload.userId) {
    //       {
    //         const stream = new MediaStream()
    //         {console.log(participant.stream?.getTracks(), 'cam tracks')}
    //         participant.stream?.getTracks().forEach(track => {
    //           if(track.kind === 'video'){
    //             track.enabled = action.payload.enabled!
    //           }
    //           stream.addTrack(track)
    //         })
    //         return { ...participant, stream }
    //       }
    //     }
    //     return participant
    //   })
    // }
    // case 'UPDATE_PARTICIPANT_MIC': {
    //   return state.map(participant => {
    //     if (participant.user.id === action.payload.userId) {
    //       {
    //         const stream = new MediaStream()
    //         {console.log(participant.stream?.getTracks(), 'mic tracks')}
    //         participant.stream?.getTracks().forEach(track => {
    //           if(track.kind === 'audio'){
    //             track.enabled = action.payload.enabled!
    //           }
    //           stream.addTrack(track)
    //         })
    //         return { ...participant, stream }
    //       }
    //     }
    //     return participant
    //   })
    // }
    case 'REMOVE_PARTICIPANT_STREAM': {
      return state.map(participant => {
        if (participant.user.id === action.payload.userId) {
          return { ...participant, stream: null }
        }
        return participant
      })
    }
    case 'ADD_PARTICIPANT':
      return []
    case 'REMOVE_PARTICIPANT':
      return state.filter(participant => participant.user.id !== action.payload.userId)
    default:
      return []
  }
}

const updateParticipantTrack = (state: Participant[], action: { payload: { userId: string, enabled: boolean } }, trackKind: 'audio' | 'video') => {
  return state.map((participant: Participant) => {
    if (participant.user.id === action.payload.userId) {
      const stream = new MediaStream();
      console.log(participant.stream?.getTracks(), `${trackKind} tracks`);

      participant.stream?.getTracks().forEach(track => {
        if (track.kind === trackKind) {
          track.enabled = action.payload.enabled; // Use action.payload.enabled directly
        }
        stream.addTrack(track);
      });

      return { ...participant, stream };
    }
    return participant;
  });
};
