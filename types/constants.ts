import { z } from "zod";
export const COMP_NAME = "MyComp";

export const videoProps = z.object({
  audioUrls: z.array(z.string()),
  imageSections: z.array(z.array(z.string())),
  titles: z.array(z.string()),
  title: z.string(),
  durationInFrames: z.number()
}).strict();

export const defaultMyCompProps = {
  audioUrls: ["https://samplelib.com/lib/preview/mp3/sample-3s.mp3"] as string[],
  imageSections: [] as string[][],
  titles: [] as string[],
  title: "multi-section-video",
  durationInFrames: 1
} as const;

export const DURATION_IN_FRAMES = 1800;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
