import { useEffect } from 'react';
import { useDyteClient, DyteProvider } from '@dytesdk/react-web-core';
import { 
  DyteParticipantsAudio,
  DyteNotifications,
  DyteGrid,
  DyteControlbarButton,
  DyteMicToggle,
  DyteCameraToggle,
  DyteSettingsToggle,
  DyteHeader,
 } from '@dytesdk/react-ui-kit';

import './App.css';

export default function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    initMeeting({
      authToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImRkZjU3YzBmLTFkM2UtNDdmZS1iNmE1LWEwNmM3NDIwMTVhMCIsIm1lZXRpbmdJZCI6ImJiYmJmZTNlLWEyYjYtNGMzNy05ZTIzLWNmYzkzMWM1Y2E3OSIsInBhcnRpY2lwYW50SWQiOiJhYWFlNWY5Mi1mZmYwLTQ2MzItOTdiNy0xOWQ2ZDVmOTE1NTgiLCJwcmVzZXRJZCI6IjM4NzI3NWEwLTBmZTgtNDAyOC05ZDkwLTNhNWYxOTc1M2ZiZCIsImlhdCI6MTY4MDY0MzIwMSwiZXhwIjoxNjg5MjgzMjAxfQ.mmspLJ64kpmKnJGLKKQmQsYBV1r0PdjKRwwUM0UgirkODlqPp2hDb3Ip3MHf7Uy_OdUqeaxbBAwiUzHJZvJ54M2i9RrGqCdaWploG1BbKUiM_A0SHC7OjmO_rrU9M529gAaQla7o9HWP-EBFQfLybO_5Ml6Y9oAcj6P4p-CZtKHnUGynyeV8UKzrR0tIouIDNzoiaEXrkVEz4ryL9BhklZ4Y3CQ701PC-PREF_MrcXSNjep934aXGD-sZ706T5GaW9N21IrslFqSdq8rasJ4CJsClQsaPMpqf6uToV-V2H1EM9Q0hN_WinNc6P_1H3jq5WBBqxGwrruvwGGGqxvhrg',
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, [initMeeting]);

  async function RetroTheme() {
    let lastProcessedImage  = null;
    const intermediatoryCanvas = document.createElement('canvas');
    intermediatoryCanvas.width = 640;
    intermediatoryCanvas.height = 480;
    const  intermediatoryCanvasCtx = intermediatoryCanvas.getContext('2d');

    const deepARCanvas = document.createElement('canvas');
    deepARCanvas.width = 680;
    deepARCanvas.height = 480;

    // eslint-disable-next-line no-undef
    const deepAR = await deepar.initialize({
        licenseKey: 'cfe8c995cf58103fea634172b30c6ab70ab94fb2b9c7104b748946906ee8f7b41164886170cc00f7',
        canvas: deepARCanvas,
        effect: 'https://cdn.jsdelivr.net/npm/deepar/effects/aviators',
        additionalOptions: {
            cameraConfig: {
                disableDefaultCamera: true
            }
        }
    });

    return async (canvas, ctx) => {
        intermediatoryCanvasCtx.drawImage(canvas, 0, 0);
        if(lastProcessedImage){
            ctx.drawImage(lastProcessedImage, 0, 0, lastProcessedImage.width, lastProcessedImage.height, 0, 0, canvas.width, canvas.height);
        }
        await deepAR.processImage(intermediatoryCanvas);
        await deepAR.processImage(intermediatoryCanvas);
        await deepAR.processImage(intermediatoryCanvas);
        const image = new Image();
        image.id = "pic";
        image.src = await deepAR.takeScreenshot();
        lastProcessedImage = image;
    }
}

  var count = 0;

  const filters = async () => {        
  
      count++;
  
      if(count % 2 === 0){
  
        meeting.self.removeVideoMiddleware(RetroTheme);
        console.log(count);
  
      } else {
        
        meeting.self.addVideoMiddleware(RetroTheme)

        console.log(count);
  
      }
  } 

  return (
    <div className="dyte-meeting">
      <DyteProvider value={meeting}>
          <DyteParticipantsAudio meeting={meeting} />
          <DyteNotifications
            meeting={meeting}
            config={{
              config: {
                notifications: ['chat', 'participant_joined', 'participant_left'],
                notification_sounds: ['chat', 'participant_joined', 'participant_left'],
                participant_joined_sound_notification_limit: 10,
                participant_chat_message_sound_notification_limit: 10,
              },
            }}
          />
          <DyteHeader meeting={meeting} />
          <div className="grid-container">
            <DyteGrid meeting={meeting} style={{ height: '100%' }} />
          </div>
          <div class="controlbar">
            <DyteMicToggle meeting={meeting} />
            <DyteCameraToggle meeting={meeting} />
            <DyteSettingsToggle meeting={meeting} />
            <DyteControlbarButton
              label="+/- AR Filter"
              icon="😎"
              id="btn"
              onClick={filters}
              size="lg"
            />
          </div>
      </DyteProvider>
      <script src="https://cdn.jsdelivr.net/npm/deepar/js/deepar.js"> </script>
  </div>
  )
}