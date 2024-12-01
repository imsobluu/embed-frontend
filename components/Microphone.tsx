import MicIcon from '@mui/icons-material/Mic';
import CircleIcon from '@mui/icons-material/Circle';

interface MicrophoneProps {
    loudness?: number;
}

const Microphone: React.FC<MicrophoneProps> = ( { loudness = 0 }) => {
    const normalizedLoudness = loudness ? Math.min(100, (loudness / 100) * 100) : 0

    // Calculate the transition from white to green
    const greenValue = Math.round(255 - (normalizedLoudness / 100) * 51); // Green: 255 -> 204
    const blueValue = Math.round(255 - (normalizedLoudness / 100) * 255); // Blue: 255 -> 0
    const whiteToGreenColor = `rgb(${greenValue}, 255, ${blueValue})`;
    return (
        <div className='flex justify-center items-center'>
             <MicIcon
                sx={{
                    position: "absolute",
                    fontSize: 80,
                    color: `rgba(0, 0, 0, 1)`,
                    boxShadow: `0 0 ${normalizedLoudness / 2}px 0 rgba(204, 255, 0, ${normalizedLoudness / 100})`,
                    borderRadius: "50%",
                    zIndex: 1,
                }}
            />
            <CircleIcon
                sx={{
                    fontSize: 100,
                    color: whiteToGreenColor,
                    zIndex: 0,
                }}
            />
        </div>
    );
};

export default Microphone;
