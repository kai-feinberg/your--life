import { VideoSection } from "./VideoSection";
import { Series, AbsoluteFill, staticFile } from "remotion";


export const Test: React.FC = () => {

    const audioUrl = staticFile("30s-audio.mp3");
    const imageSections = [
        staticFile("lebron1.jpg"), staticFile("lebron2.jpg")
    ];
    const titles = ["LeBron James"];

    return (
        <AbsoluteFill>
            <Series>
                <Series.Sequence durationInFrames={900}>
                    <VideoSection audioUrl={audioUrl} images={imageSections} title={titles[0]} />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
    
};