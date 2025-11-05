import { createContext, useState } from "react";

export const MapContext = createContext();

export function MapProvider({ children }) {
    const [highlightedBuilding, setHighlightedBuilding] = useState(null);
    const [trigger, setTrigger] = useState(0);

    const selectBuilding = (id) => {
        setHighlightedBuilding(id);
        setTrigger((t) => t + 1); // 🔹 fuerza que el useEffect se dispare siempre
    };

    return (
        <MapContext.Provider value={{ highlightedBuilding, setHighlightedBuilding }}>
            {children}
        </MapContext.Provider>
    );
}
