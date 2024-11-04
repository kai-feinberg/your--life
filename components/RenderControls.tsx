import { z } from "zod";
import { useRendering } from "../helpers/use-rendering";
import { videoProps, COMP_NAME } from "../types/constants";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";
import { useMemo, useState } from "react";

type VideoPropsType = z.infer<typeof videoProps>;

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputProps: VideoPropsType;
}> = ({ text, setText, inputProps }) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const { renderMedia, state, undo } = useRendering(
    COMP_NAME,
    // Ensure all required properties are present
    {
      ...inputProps,
      audioUrls: inputProps.audioUrls || [],
      imageSections: inputProps.imageSections || [],
      titles: inputProps.titles || [],
      title: inputProps.title || "",
      durationInFrames: inputProps.durationInFrames || 1,
    }
  );

  const handleRender = async () => {
    try {
      // Validate props before rendering
      videoProps.parse(inputProps);
      setValidationError(null);
      await renderMedia();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors.map(e => e.message).join(", "));
      } else {
        setValidationError("An unexpected error occurred");
      }
    }
  };

  return (
    <InputContainer>
      {validationError && <ErrorComp message={validationError} />}
      
      {(state.status === "init" || state.status === "invoking" || state.status === "error") && (
        <>
          <Spacing />
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={handleRender}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" && (
            <ErrorComp message={state.error.message} />
          )}
        </>
      )}
      
      {(state.status === "rendering" || state.status === "done") && (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing />
          <AlignEnd>
            <DownloadButton undo={undo} state={state} />
          </AlignEnd>
        </>
      )}
    </InputContainer>
  );
};
