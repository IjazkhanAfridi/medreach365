import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const ZegVideoCall = () => {
  const roomID = '1';
  const divRef = useRef(null);

  useEffect(() => {
    let zp;
    async function myMeeting() {
      const appID = 144495001;
      const serverSecret = 'fe09895af88a380a0b39d0c7a919e9c7';
      const kitToken = ZegoUIKitPrebuilt?.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date?.now()?.toString(),
        'medreach'
      );
      zp = ZegoUIKitPrebuilt?.create(kitToken);
      zp?.joinRoom({
        container: divRef?.current,
        // sharedLinks: [ { name: 'Personal link', url:"http://localhost:5173" },],
        scenario: {
          mode: ZegoUIKitPrebuilt?.OneONoneCall,
        },
      });
    }

    myMeeting();
    return () => {
      if (zp) {
        zp?.destroy();
      }
    };
  }, []);

  return <div ref={divRef} style={{ width: '50vw', height: '50vh' }}></div>;
};

export default ZegVideoCall;
