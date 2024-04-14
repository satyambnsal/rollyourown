
import { useEffect } from "react";

export const useAutoBurner = () => {

  useEffect(() => {

    if (!window.localStorage) return

    const lastSelectedChainId = window.localStorage.getItem('lastSelectedChainId')
    const lastUsedConnector = window.localStorage.getItem('lastUsedConnector')

    if (!lastSelectedChainId ) {
      window.localStorage.setItem('lastSelectedChainId', 'KATANA_SLOT_420')
    }
    if ( !lastUsedConnector) {
      window.localStorage.setItem('lastUsedConnector', 'dojoburner')
    }


  }, []);

}

