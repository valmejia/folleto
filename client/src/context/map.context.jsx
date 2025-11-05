import { createContext, useState } from "react";

export const MapContext = createContext();

export function MapProvider(props) {
    const [highlightedBuildings, setHighlightedBuildings] = useState([]);
    const [trigger, setTrigger] = useState(0);

    const highlightBuildings = (ids) => {
        setHighlightedBuildings(ids);
        setTrigger((t) => t + 1); // fuerza actualización
    };

    const clearHighlights = () => {
        setHighlightedBuildings([]);
        setTrigger((t) => t + 1);
    };

    return (
        <MapContext.Provider
            value={{
                highlightedBuildings,
                highlightBuildings,
                clearHighlights,
                trigger,
            }}
        >
            {props.children}
        </MapContext.Provider>
    );
}
