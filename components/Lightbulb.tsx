import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';

interface LightbulbProps {
    brightness?: number;
}

const Lightbulb: React.FC<LightbulbProps> = ( { brightness = 0 }) => {
    const normalizedBrightness = brightness ? Math.min(100, (brightness / 1000) * 100) : 0;

    // Calculate the transition from white to yellow
    const greenValue = Math.round(255 - (normalizedBrightness / 100) * 51); // Green: 255 -> 204
    const blueValue = Math.round(255 - (normalizedBrightness / 100) * 255); // Blue: 255 -> 0
    const whiteToYellowColor = `rgb(255, ${greenValue}, ${blueValue})`;
    return (
        <div className='flex justify-center items-center'>
             <LightbulbCircleIcon
                sx={{
                    position: "absolute",
                    fontSize: 80,
                    color: `rgba(0, 0, 0, 1)`,
                    boxShadow: `0 0 ${normalizedBrightness / 2}px 0 rgba(255, 204, 0, ${normalizedBrightness / 100})`,
                    borderRadius: "50%",
                    zIndex: 0,
                }}
            />
            <LightbulbCircleIcon
                sx={{
                    fontSize: 100,
                    color: whiteToYellowColor,
                    zIndex: 1,
                }}
            />
        </div>
    );
};

export default Lightbulb;
