import { z } from "zod";
import {
    AbsoluteFill,
    Sequence,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img,
    staticFile,
    Audio
} from "remotion";
import {getAudioDurationInSeconds} from "@remotion/media-utils";
import React, { useEffect, useState } from "react";
import { Animated } from "remotion-animated";


export const Test = ({ images=["lebron1.jpg", "lebron2.jpg"] , title = "Default Title", mp3File= "30s-audio.mp3" }: { images?: string[]; title?: string; mp3File?: string }) => {
    //check length of provided mp3
    const [audioLength, setAudioLength] = useState(1); // audio length in frames

    useEffect(() => {
        const getAudioDuration = async () => {
            const audioLength = await getAudioDurationInSeconds(staticFile(mp3File))
            setAudioLength(parseInt((audioLength*30).toString()));
        }

        getAudioDuration();
    }, []);

    console.log(parseInt((audioLength*30).toString()));

    const imageLength = audioLength/images.length;

    //divide by number of images for the section and convert to frames
    return (
        <AbsoluteFill>
            <Audio src={staticFile(mp3File)} />
            {images.map((path, index) => (
                <Sequence key={index} durationInFrames={imageLength} from={index * imageLength}>
                    <AbsoluteFill className="justify-center items-center">

                        <Img src={staticFile(path)} />
                    </AbsoluteFill>
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
