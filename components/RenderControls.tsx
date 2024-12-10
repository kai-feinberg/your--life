import { useRendering } from "../helpers/use-rendering";
import { COMP_NAME } from "../types/constants";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";
import { useMemo, useState } from "react";

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputProps: any;
}> = ({ text, setText, inputProps }) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  // const mergedInputProps = useMemo(() => ({
  //   ...inputProps,
  //   audioUrls: inputProps.audioUrls || [],
  //   imageSections: inputProps.imageSections || [],
  //   titles: inputProps.titles || [],
  //   title: inputProps.title || "",
  //   durationInFrames: inputProps.durationInFrames || 1,
  // }), [inputProps]);

  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  const handleRender = async () => {
    try {
      setValidationError(null);
      await renderMedia();
    } catch (error) {
      setValidationError("An unexpected error occurred");
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
          {state.status === "error" && state.error && (
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
