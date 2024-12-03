import React, { useState, useEffect } from "react";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Series, AbsoluteFill, staticFile } from "remotion";
import { VideoSection } from "./VideoSection";

// If Series and AbsoluteFill are not exported from "remotion", you may need to import them from "@remotion/core"
// import { Series, AbsoluteFill } from "@remotion/core";

interface MultiSectionVideoProps {
  audioUrls: string[]; // Change this from mp3Files to audioUrls
  imageSections: string[][];
  titles?: string[];
}
export const MultiSectionVideo = ({
  audioUrls,
  imageSections,
  titles = [],
}: MultiSectionVideoProps) => {

  console.log("audio urls", audioUrls);
  const [audioLengths, setAudioLengths] = useState<number[]>(Array(audioUrls.length).fill(1)); // initialize it to an array of 1s

  // console.log("audio urls", audioUrls);

  useEffect(() => {
    const getAudioDurations = async () => {
      const lengths = await Promise.all(audioUrls.map(async (audioUrl) => {
        const audioDuration = await getAudioDurationInSeconds(audioUrl);
        console.log("audio length", audioDuration);
        return Math.max(1, Math.round(audioDuration * 30)); // Ensure minimum duration of 1 frame
      }));
      setAudioLengths(lengths);
    }

    getAudioDurations();
  }, [audioUrls]);
  // Ensure we have the same number of titles as sections
  const sectionTitles = titles.length === imageSections.length
    ? titles
    : imageSections.map((_, index) => `Section ${index + 1}`);

  return (
    <AbsoluteFill>
      <Series>
        {audioUrls.map((audioUrl, index) => (
          <Series.Sequence key={index} durationInFrames={audioLengths[index]} from={audioLengths.slice(0, index).reduce((a, b) => a + b, 0)}>
            <VideoSection
              audioUrl={audioUrl}
              images={imageSections[index]}
              title={sectionTitles[index]}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
