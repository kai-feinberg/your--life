import { z } from "zod";
import {
    AbsoluteFill,
    Sequence,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img,
    staticFile,
    Audio,
    Series
} from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import React, { useEffect, useState } from "react";
import { Animated } from "remotion-animated";

interface VideoSectionProps {
    images?: string[];
    title?: string;
    audioUrl: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
    images = ["lebron1.jpg", "lebron2.jpg"],
    title = "Default Title",
    audioUrl
}) => {
    const [audioLength, setAudioLength] = useState(1);
    const { fps } = useVideoConfig();

    
    useEffect(() => {
        const getAudioDuration = async () => {
            const audioDuration = await getAudioDurationInSeconds(audioUrl);
            setAudioLength(Math.max(1, Math.round(audioDuration * fps)));
        }

        getAudioDuration();
    }, [audioUrl, fps]);

    const imageLength = Math.max(1, Math.floor(audioLength / images.length));

    return (
        <AbsoluteFill>
            <Audio src={audioUrl} />
            <Series>
                {images.map((path, index) => (
                    <Series.Sequence key={index} durationInFrames={imageLength} from={index * imageLength}>
                        <AbsoluteFill className="justify-center items-center">
                            <Img src={path} />
                        </AbsoluteFill>
                    </Series.Sequence>
                ))}
            </Series>
        </AbsoluteFill>
    );
};
