import { z } from "zod";
import {
    AbsoluteFill,
    Sequence,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img,
    staticFile
} from "remotion";
import { CompositionProps } from "../../types/constants";
import React from "react";

import { Animated } from "remotion-animated";



export const Test = ({ title }: z.infer<typeof CompositionProps>) => {

    return (
        <AbsoluteFill>
            <Sequence durationInFrames={900}>
                <AbsoluteFill className="justify-center items-center">
                    <Img src={staticFile("lebron1.jpg")} />
                </AbsoluteFill>
            </Sequence>
            <Sequence from={900}>
                <Img src={staticFile("lebron1.jpg")} />
            </Sequence>
        </AbsoluteFill>
    );
};
