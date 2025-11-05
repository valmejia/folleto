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

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "20px",
    backgroundColor: "#eff3f8",
    marginLeft: "auto",
    width: "220px",
    transition: "all 0.3s ease",
    "&:hover": { backgroundColor: "#e8ecf2" },
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
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

const StyledInputBase = styled(InputBase)(() => ({
    color: "#000",
    paddingLeft: "calc(1em + 36px)",
    width: "100%",
    "&::placeholder": { color: "#bfc3c9" },
}));

function Navbar() {
    const [anchorCarrera, setAnchorCarrera] = useState(null);
    const [anchorTramites, setAnchorTramites] = useState(null);
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
    ];

    const tramites = [
        "Servicio Social",
        "Inglés",
        "Créditos complementarios",
        "Residencia Profesional",
    ];

    const handleClickCarrera = (event) => setAnchorCarrera(event.currentTarget);
    const handleCloseCarrera = () => setAnchorCarrera(null);

    const handleClickTramites = (event) => setAnchorTramites(event.currentTarget);
    const handleCloseTramites = () => setAnchorTramites(null);

    const handleCarreraSelect = (carrera) => {
        if (carrera === "Ingeniería en Sistemas Computacionales") {
            clearHighlights(); // limpia cualquier highlight anterior
            setTimeout(() => highlightBuildings(["A", "B", "E"]), 50); // ilumina A y B
        } else  {
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
                    src="/logo.png"
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
                            sx: {
                                mt: 1,
                                borderRadius: 2,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        {carreras.map((carrera) => (
                            <MenuItem key={carrera} onClick={() => handleCarreraSelect(carrera)}>
                                {carrera}
                            </MenuItem>
                        ))}
                    </Menu>

                    <Button sx={buttonStyle} onClick={handleClickTramites}>
                        <AssignmentIcon sx={{ fontSize: 18 }} /> Trámites
                    </Button>
                    <Menu
                        anchorEl={anchorTramites}
                        open={Boolean(anchorTramites)}
                        onClose={handleCloseTramites}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                borderRadius: 2,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        {tramites.map((tramite) => (
                            <MenuItem key={tramite} onClick={handleCloseTramites}>
                                {tramite}
                            </MenuItem>
                        ))}
                    </Menu>

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
