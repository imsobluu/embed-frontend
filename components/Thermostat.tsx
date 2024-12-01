import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CircleIcon from '@mui/icons-material/Circle';

interface ThermostatProps {
    temperature?: number;
}

const normalizeNegativeTemperature = (value: number) => {
    const min = -55;
    const max = 0;
    const newMin = 0;
    const newMax = 100;
  
    // Apply the normalization formula
    const normalizedValue = ((value - min) / (max - min)) * (newMax - newMin) + newMin;
  
    return 100 - normalizedValue;
}

const normalizePositiveTemperature = (value: number) => {
    const min = 0;
    const max = 150;
    const newMin = 0;
    const newMax = 100;
  
    // Apply the normalization formula
    const normalizedValue = ((value - min) / (max - min)) * (newMax - newMin) + newMin;
  
    return normalizedValue;
}

const Thermostat: React.FC<ThermostatProps> = ( { temperature = 0 }) => {
    let normalizedTemperature = 0;
    if (temperature < 0) {
        normalizedTemperature = normalizeNegativeTemperature(temperature);
    } else {
        normalizedTemperature = normalizePositiveTemperature(temperature);
    }
    
    let redValue = 255;
    let greenValue = 255;
    let blueValue = 255;

    if (temperature < 0) {
        // Transition from white to blue (for temperatures below 0)
        redValue = Math.max(0, 255 + Math.round((temperature / 55) * 255)); // Decrease red
        greenValue = Math.max(0, 255 + Math.round((temperature / 55) * 255)); // Decrease green
    } else {
        // Transition from white to red (for temperatures above 0)
        blueValue = Math.max(0, 255 - Math.round((temperature / 150) * 255)); // Decrease blue
        greenValue = Math.max(0, 255 - Math.round((temperature / 150) * 255)); // Decrease green
    }

    const color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;

    return (
        <div className='flex justify-center items-center'>
             <DeviceThermostatIcon
                sx={{
                    position: "absolute",
                    fontSize: 80,
                    color: `rgba(0, 0, 0, 1)`,
                    boxShadow: `0 0 ${normalizedTemperature / 2}px 0 rgba(${redValue}, ${greenValue}, ${blueValue}, ${normalizedTemperature / 100})`,
                    borderRadius: "50%",
                    zIndex: 1,
                }}
            />
            <CircleIcon
                sx={{
                    fontSize: 100,
                    color: color,
                    zIndex: 0,
                }}
            />
        </div>
    );
};

export default Thermostat;
