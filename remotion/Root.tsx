import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import { Test } from "./MyComp/Test";
import {
  COMP_NAME,
  defaultMyCompProps,
  videoProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { getAudioDurationInSeconds } from "@remotion/media-utils";

export const RemotionRoot: React.FC = () => {  
  return (
    <>
      <Composition
        id="Test"
        component={Test}
        durationInFrames={videoProps.durationInFrames}
        fps={30}
        width={900}
        height={600}
        defaultProps={videoProps}
      />
    </>
  );
};
