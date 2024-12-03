import { z } from "zod";
import {
    AbsoluteFill,
    Sequence,
    spring,
    useCurrentFrame,
    Img,
    staticFile,
    Audio,
    Series
} from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import React, { useEffect, useState } from "react";
import { Animated, Scale } from "remotion-animated";

interface VideoSectionProps {
    images?: string[];
    title?: string;
    audioUrl: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
    images = [],
    title = "Default Title",
    audioUrl
}) => {
    const [audioLength, setAudioLength] = useState(1);
    const fps = 30;

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
                        <AbsoluteFill>
                            <Animated animations={[Scale({ by: 1.1, duration: imageLength })]}>
                                <Img
                                    src={path}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Animated>
                        </AbsoluteFill>
                    </Series.Sequence>
                ))}
            </Series>
        </AbsoluteFill>
    );
};
