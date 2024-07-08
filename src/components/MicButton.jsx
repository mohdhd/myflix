// MicButton.js
import React, { useEffect, useState, useCallback } from "react";
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import Lottie from 'react-lottie';
import OpenAI from "../services/OpenAI";

import speakingAnimation from '../assets/animations/speaking.json';
import recordingAnimation from '../assets/animations/recording.json';
import loadingAnimation from '../assets/animations/loading.json';

const MicButton = () => {
    const apiKey = localStorage.getItem("openAiKey");

    const { recording, transcribing, transcript, response, startRecording, stopRecording, mode, audioRef } = OpenAI(apiKey);

    const handleClick = useCallback(() => {
        if (mode === "speaking") {
            // Stop the audio and start recording
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            startRecording();
          } else if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [mode, recording, startRecording, stopRecording, audioRef]);

    const getButtonColor = () => {
        switch (mode) {
            case "recording":
                return "#4caf50";
            case "transcribing":
                return "#ff9800";
            case "speaking":
                return "#3f51b5";
            default:
                return "#3f51b5";
        }
    };

    const [animationData, setAnimationData] = useState(speakingAnimation);

    useEffect(() => {
        switch (mode) {
            case "recording":
                setAnimationData(recordingAnimation);
                break;
            case "transcribing":
                setAnimationData(loadingAnimation);
                break;
            case "speaking":
                setAnimationData(speakingAnimation);
                break;
            default:
                setAnimationData(speakingAnimation);
                break;
        }
    }, [mode]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                handleClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleClick]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div>
            <IconButton
                onClick={handleClick}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: getButtonColor(),
                    zIndex: 1000,
                    height: '70px',
                    width: '70px',
                    padding: 0,
                }}
            >
                {
                  mode === 'inactive' ? (<MicIcon style={{ color: 'white', fontSize: 30 }} />) :    
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={50}
                />
                }
             
            </IconButton>
        </div>
    );
};

export default MicButton;
