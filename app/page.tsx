//page.tsx
"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState, useEffect, use } from "react";
import { Prompt } from "@/components/Prompt";
import { MultiSectionVideo } from "../remotion/MyComp/MultiSectionVideo";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { z } from "zod";
import { RenderControls } from "../components/RenderControls";
import { Tips } from "../components/Tips";
import { Spacing } from "../components/Spacing";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [audioUrls, setAudioUrls] = useState<string[]>([]); // Change this from mp3Files to audioUrls
  const [imageSections, setImageSections] = useState<string[][]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean>(false);

  const inputProps = useMemo(() => {
    return {
      audioUrls, // Change this from mp3Files to audioUrls
      imageSections,
      titles: imageSections.map((_, index) => `Section ${index + 1}`),
      title: "test",
    };
  }, [text, audioUrls, imageSections]);

  const handleScriptGenerated = (generatedScript: string, newAudioUrls: string[], newImageSections: string[][]) => {
    setText(generatedScript);
    setAudioUrls(newAudioUrls); // Change this from setMp3Files to setAudioUrls
    setImageSections(newImageSections);
  };

  useEffect(() => {
    if (audioUrls.length > 0 && imageSections.length > 0){
      setIsDataReady(true);
    }
  }, [audioUrls, imageSections]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div>
          <Prompt onScriptGenerated={handleScriptGenerated} />

          {isDataReady && (
            <>
              <Player
                component={MultiSectionVideo}
                inputProps={inputProps}
                durationInFrames={DURATION_IN_FRAMES}
                fps={VIDEO_FPS}
                compositionHeight={VIDEO_HEIGHT}
                compositionWidth={VIDEO_WIDTH}
                style={{
                  width: "100%",
                }}
                controls
                autoPlay
                loop
              />
              <RenderControls
                text={text}
                setText={setText}
                inputProps={inputProps}
              />
              <Spacing />
              <Spacing />
              <Spacing />
              <Spacing />
              {/* <Tips /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
