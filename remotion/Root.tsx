import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import { Test } from "./MyComp/Test";
import { MultiSectionVideo } from "./MyComp/MultiSectionVideo";
import {
  COMP_NAME,
  defaultMyCompProps,
  defaultVideoProps,
  videoProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { getAudioDurationInSeconds } from "@remotion/media-utils";

import { z } from "zod";
import { parse } from "path";

const videoProps = z.object({
  audioUrls: z.array(z.string()),
  imageSections: z.array(z.array(z.string())),
  titles: z.array(z.string()),
  durationInFrames: z.number(),
  title: z.string(),
});
type VideoPropsType = z.infer<typeof videoProps>;


export const RemotionRoot: React.FC = () => {  
  let parsedProps: VideoPropsType;
  parsedProps= videoProps.parse(videoProps)

  return (
    <>
      {/* <Composition
        id="Test"
        component={Test}
        durationInFrames={videoProps.durationInFrames}
        fps={30}
        width={900}
        height={600}
        defaultProps={videoProps}
      /> */}

      <Composition
        id={COMP_NAME}
        component={MultiSectionVideo}
        durationInFrames={parsedProps.durationInFrames}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultVideoProps}
        
      />

    </>
  );
};
