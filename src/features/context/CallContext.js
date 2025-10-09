import React, { createContext, useRef, useContext } from "react";
import WebRTCService from "../../lib/WebRTCService";
import { useSelector } from "react-redux";

export const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  // Create single instance of WebRTCService
  const webRTCServiceRef = useRef(null);
  if (!webRTCServiceRef.current) {
    webRTCServiceRef.current = new WebRTCService();
  }

  // Access Redux call state (optional)
  const callState = useSelector((state) => state.call);

  return (
    <CallContext.Provider
      value={{
        webRTCService: webRTCServiceRef.current,
        callState, // provide call state to screens if needed
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

// Optional custom hook for easier access
export const useCall = () => useContext(CallContext);
