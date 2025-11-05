import { createContext, useState } from "react";

export const MapContext = createContext();

export function MapProvider({ children }) {
    const [highlightedBuilding, setHighlightedBuilding] = useState(null);

    return (
        <MapContext.Provider value={{ highlightedBuilding, setHighlightedBuilding }}>
            {children}
        </MapContext.Provider>
    );
}
