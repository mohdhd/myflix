// services/Whisper.js
import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useSelector, useStore, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { setMessages } from "../features/message";

const useCustomWhisper = (apiKey) => {
    const [recording, setRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [mode, setMode] = useState("inactive");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);

    const location = useLocation();
    const store = useStore();
    const dispatch = useDispatch();
    const history = useHistory();

    const startRecording = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                setTranscribing(true);
                setMode("transcribing");
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                audioChunksRef.current = [];
                const transcription = await transcribeAudio(audioBlob, apiKey);
                if (transcription) {
                    await handleTranscriptionResponse(transcription);
                }
                setTranscribing(false);
                setMode("inactive");
            };

            mediaRecorder.start();
            setRecording(true);
            setMode("recording");
        });
    }, [apiKey]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    }, []);

    const transcribeAudio = useCallback(async (audioBlob, apiKey) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.wav");
        formData.append("model", "whisper-1");
        formData.append("language", "en");
        formData.append("temperature", "0.2");
        formData.append("prompt", "You're transcribing audio about movies");

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/audio/transcriptions",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const text = response.data.text;
            setTranscript(text);
            return text;
        } catch (error) {
            console.error("Transcription error:", error);
            setTranscript("Transcription failed");
            return null;
        }
    }, [apiKey]);

    const getContextData = () => {
        const currentState = store.getState();
        const currentMovies = currentState.movies.movies || [];
        const currentMovieDetails = currentState.movies.movieDetails || {};

        let contextData = {};

        if (location.pathname === "/") {
            contextData = {
                movies: currentMovies,
                prompt: "You are on the home page. Here is the list of movies available:",
            };
        } else if (location.pathname.startsWith("/movie/")) {
            const movieId = location.pathname.split("/")[2];
            contextData = {
                movie: currentMovieDetails[movieId],
                prompt: `You are on the movie detail page for the movie with ID ${movieId}. Here are the details:`,
            };
        }

        return contextData;
    };

    const handleTranscriptionResponse = useCallback(async (transcription) => {
        let contextData = getContextData();

        const messages = store.getState().messages.messages;

        let updatedMessages = [
            ...messages,
            { role: "user", content: `${transcription} currentPageView:${JSON.stringify(contextData.movies || contextData.movie)}` },
        ].slice(-7); // Keep only the last 30 messages


        const llmResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                response_format: { type: "json_object" },
                model: "gpt-4o",
                messages: [
                    { role: "system", content: `You're a movie recommendations AI voice copilot. Your job is to help the user navigate the platform and find a movie that they like. Here's your response should look like make sure it's always json:
                    {
                        text: "llm_response"
                        action:{
                        type: "action type", //go_movie either by name or id, go genre
                        name: "name of movie, search query, genre" //name of movie or genre (only one genre at a time)
                        id: "id of the movie in case you have it from the movies list"
                        }
                    }
                        1- llm_response: the response that you want to send to the user
                        2- type: the action that you want to take based on the response like navigate to a certain movie page so that user will see the details while you explain either using the movie name or id in case you have it
                        3- id: the id of the movie in case you have it from the movies list

                        **If no action is needed just send the response with action: null**
                        **Don't Mention Any of the movies in the current view unless the user asks for it**

                        This is the list of genres available:
                        Action
                        Adventure
                        Animation
                        Comedy
                        Crime
                        Documentary
                        Drama
                        Family
                        Fantasy
                        History
                        Horror
                        Music
                        Mystery
                        Romance
                        Science Fiction
                        TV Movie
                        Thriller
                        War
                        Western
                    ` },
                    ...updatedMessages,
                    // { role: "user", content: `${transcription} currentPageView:${JSON.stringify(contextData.movies || contextData.movie)}` },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const llmMessage = llmResponse.data.choices[0].message.content;
        const parsedResponse = JSON.parse(llmMessage);

        updatedMessages = [
            ...updatedMessages,
            { role: "assistant", content: llmMessage },
        ].slice(-10);

        dispatch(setMessages(updatedMessages));

        setResponse(parsedResponse.text);

        if (parsedResponse.action) {
            const { type, name, id } = parsedResponse.action;

            if (type === "go_movie") {
                if (id) {
                    history.push(`/movie/${id}`);
                } else {
                    history.push(`/?q=${name}`);
                }
            }

            if (type === "go_genre") {
                const genres = store.getState().movies.genres;
                const genre = genres.find((genre) => genre.name.toLowerCase() === name.toLowerCase());
                history.push(`/?g=${genre.id}`);
            }
        }

        await convertTextToSpeech(parsedResponse.text, apiKey);
    }, [apiKey]);

    const convertTextToSpeech = async (text, apiKey) => {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/audio/speech",
                {
                    model: "tts-1",
                    input: text,
                    voice: "nova",
                    response_format: "mp3",
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    responseType: "arraybuffer",
                }
            );

            const audioBlob = new Blob([response.data], { type: "audio/mp3" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onloadeddata = () => {
                setMode("speaking");
                audio.play();
            };

            audio.onended = () => setMode("inactive");
        } catch (error) {
            console.error("TTS conversion error:", error);
            setMode("inactive");
        }
    };

    return {
        recording,
        transcribing,
        transcript,
        response,
        startRecording,
        stopRecording,
        mode,
        audioRef,
    };
};

export default useCustomWhisper;
