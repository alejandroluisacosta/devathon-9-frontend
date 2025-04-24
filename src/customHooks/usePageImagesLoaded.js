import { useEffect, useState } from 'react';

function waitFor(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


export function usePageReady(minWaitTime = 3000, backgroundUrl = null) {
    const [ready, setReady] = useState(false);
  
    useEffect(() => {
      async function checkEverything() {
  
        const waitForBackground = backgroundUrl
          ? new Promise((resolve) => {
              const bgImg = new Image();
              bgImg.src = backgroundUrl;
              bgImg.onload = resolve;
              bgImg.onerror = resolve;
            })
          : Promise.resolve();
  
        await Promise.all([
          waitForBackground,
          waitFor(minWaitTime)
        ]);
  
        setReady(true);
      }
  
      checkEverything();
    }, [minWaitTime, backgroundUrl]);
  
    return ready;
  }