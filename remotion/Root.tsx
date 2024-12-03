import { Composition } from "remotion";
import { MultiSectionVideo } from "./MyComp/MultiSectionVideo";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // id="my-comp"
        name= "test"
        id={COMP_NAME}
        component={MultiSectionVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />

    </>
  );
};
