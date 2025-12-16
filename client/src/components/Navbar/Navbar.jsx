import React, { useState, useContext } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Menu,
    MenuItem,
    Box,
    InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { MapContext } from "../../context/map.context";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ComputerIcon from '@mui/icons-material/Computer';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import {FactoryIcon} from "lucide-react";


const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.2)",   // transparente como la navbar
    backdropFilter: "blur(10px)",             // blur como la navbar
    WebkitBackdropFilter: "blur(10px)",      // para Safari
    marginLeft: "auto",
    width: "220px",
    transition: "all 0.3s ease",
    "&:hover": {
        background: "rgba(255, 255, 255, 0.25)", // hover más visible
    },
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",    // sombra suave
}));

const StyledInputBase = styled(InputBase)(() => ({
    color: "#111",                               // igual que los botones de navbar
    paddingLeft: "calc(1em + 36px)",
    width: "100%",
    "&::placeholder": {
        color: "#bfc3c9",                        // placeholder gris suave
    },
    "& .MuiInputBase-input": {
        transition: "all 0.3s ease",
    },
}));


const SearchIconWrapper = styled("div")(() => ({
    padding: "0 14px",
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#bfc3c9",
}));


function Navbar() {
    const [anchorCarrera, setAnchorCarrera] = useState(null);
    const { isLoggedIn, logOutUser } = useContext(AuthContext);
    const { highlightBuildings, clearHighlights } = useContext(MapContext);

    const carreras = [
        "Gastronomía",
        "Contaduría Pública",
        "Ingeniería en Sistemas Computacionales",
        "Ingeniería Ambiental",
        "Ingeniería en Energías Renovables",
        "Ingeniería en Administración",
        "Ingeniería en Sistemas Automotrices",
        "Ingeniería en TIC'S",
        "Ingeniería Industrial",
    ]

    const carreraIcons = {
        "Gastronomía": <RestaurantMenuIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Contaduría Pública": <AttachMoneyIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería en Sistemas Computacionales": <ComputerIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería Ambiental": <NaturePeopleIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería en Energías Renovables": <SolarPowerIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería en Administración": <BusinessIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería en Sistemas Automotrices": <DirectionsCarIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería en TIC'S": <DeviceHubIcon sx={{ mr: 1, fontSize: 18 }} />,
        "Ingeniería Industrial": <FactoryIcon sx={{ mr: 1, fontSize: 18 }} />
    };

    const handleClickCarrera = (event) => setAnchorCarrera(event.currentTarget);
    const handleCloseCarrera = () => setAnchorCarrera(null);

    const handleCarreraSelect = (carrera) => {
        if (carrera === "Ingeniería en Sistemas Computacionales") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings(["A", "B"]), 50); // ilumina A y B
        } else if (carrera === "Gastronomía") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings(["C", "B", "D", ]), 50);
        }else if (carrera === "Ingeniería en TIC'S") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings(["E"]), 50);
        } else if (carrera === "Ingeniería en Sistemas Automotrices") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings(["D", "E"]), 50);
        } else if (carrera === "Ingeniería en Administración") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings(["D", "I"]), 50);
        } else if (carrera === "Contaduría Pública") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings([ "D"]), 50);
        }
        else if (carrera === "Ingeniería Ambiental") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings([ "AUDITORIO"]), 50);
        }
        else if (carrera === "Ingeniería Industrial") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings([ "F"]), 50);
        }
        else  {
            clearHighlights(); // apaga si no es esa carrera
        }
        setAnchorCarrera(null);
    };


    const buttonStyle = {
        color: "#111",
        mx: 1.5,
        fontWeight: 500,
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "0.3s",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.05)",
            transform: "translateY(-2px)",
        },
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                width: "90%",
                maxWidth: 1000,
                mx: "auto",
                mt: 2,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                }}
            >
                <Box
                    component="img"
                    src="./img/logo.png"
                    alt="Logo"
                    sx={{ height: 32, mr: 2 }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button sx={buttonStyle} component={Link} to="/">
                        <MapIcon sx={{ fontSize: 18 }} /> Mapa
                    </Button>

                    <Button sx={buttonStyle} onClick={handleClickCarrera}>
                        <SchoolIcon sx={{ fontSize: 18 }} /> Carreras
                    </Button>
                    <Menu
                        anchorEl={anchorCarrera}
                        open={Boolean(anchorCarrera)}
                        onClose={handleCloseCarrera}
                        PaperProps={{
                            sx: { mt: 1, borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
                        }}
                    >
                        {carreras.map((carrera) => (
                            <MenuItem key={carrera} onClick={() => handleCarreraSelect(carrera)}>
                                {carreraIcons[carrera]}
                                {carrera}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Botón directo a la página de trámites */}
                    <Button
                        sx={buttonStyle}
                        component={Link}
                        to="/tramites"
                    >
                        <AssignmentIcon sx={{ fontSize: 18 }} /> Trámites
                    </Button>

                    <Button sx={buttonStyle} component={Link} to="/menuDeCafeteria">
                        <LocalCafeIcon sx={{ fontSize: 18 }} /> Cafetería
                    </Button>
                </Box>

                <Search>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ fontSize: 18 }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Buscar…"
                        inputProps={{ "aria-label": "search" }}
                    />
                </Search>

                {isLoggedIn && (
                    <Button onClick={logOutUser} sx={{ ml: 1, ...buttonStyle }}>
                        <LogoutIcon sx={{ fontSize: 18 }} /> Cerrar sesión
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;