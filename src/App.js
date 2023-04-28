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

  const DYTE_KEY = process.env.REACT_APP_DYTE_KEY;
  const DEEPAR_KEY = process.env.REACT_APP_DEEPAR_KEY;

  useEffect(() => {
    initMeeting({
      authToken: DYTE_KEY,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, [DYTE_KEY, initMeeting]);

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
        licenseKey: DEEPAR_KEY,
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