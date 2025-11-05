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

// 🔍 Barra de búsqueda
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "20px",
    backgroundColor: "#eff3f8",
    marginLeft: "auto",
    width: "220px",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "#e8ecf2",
    },
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
    "&::placeholder": {
        color: "#bfc3c9",
    },
}));

function Navbar() {
    const [anchorCarrera, setAnchorCarrera] = useState(null);
    const [anchorTramites, setAnchorTramites] = useState(null);

    const { isLoggedIn, logOutUser } = useContext(AuthContext);

    const carreras = [
        "Gastronomía",
        "Contaduría Pública",
        "Ingeniería en Sistemas Computacionales",
        "Ingeniería Ambiental",
        "Ingeniería en Energías Renovables",
        "Ingeniería en Administración",
        "Ingeniería en Sistemas Automotrices",
        "Ingeniería en TIC",
    ];

    const tramites = [
        "Servicio Social",
        "Inglés",
        "Créditos complementarios",
        "Residencia Profesional",
    ];

    // 🎓 Carreras
    const handleClickCarrera = (event) => {
        setAnchorCarrera(event.currentTarget);
    };
    const handleCloseCarrera = () => {
        setAnchorCarrera(null);
    };

    // 🧾 Trámites
    const handleClickTramites = (event) => {
        setAnchorTramites(event.currentTarget);
    };
    const handleCloseTramites = () => {
        setAnchorTramites(null);
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

    const fullWidthMenuProps = {
        PaperProps: {
            sx: {
                width: "100vw",
                maxWidth: "100vw",
                borderRadius: 0,
                background: "#fafafa",
            },
        },
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
        transformOrigin: { vertical: "top", horizontal: "left" },
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                width: "90%",               // ancho menor para centrar
                maxWidth: 1000,
                mx: "auto",                 // centrado horizontal
                mt: 2,                      // margen superior
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 50,          // navbar más pequeña
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,                  // padding horizontal
                }}
            >
                {/* Contenido de la Navbar */}
                <Box
                    component="img"
                    src="/logo.png"
                    alt="Logo"
                    sx={{ height: 32, mr: 2 }} // logo más pequeño
                />

                {/* Botones y menús */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button sx={buttonStyle} component={Link} to="/">
                        <MapIcon sx={{ fontSize: 18 }} /> Mapa
                    </Button>

                    <Button sx={buttonStyle} onClick={handleClickCarrera}>
                        <SchoolIcon sx={{ fontSize: 18 }} /> Carreras
                    </Button>

                    <Button sx={buttonStyle} onClick={handleClickTramites}>
                        <AssignmentIcon sx={{ fontSize: 18 }} /> Trámites
                    </Button>

                    <Button sx={buttonStyle} component={Link} to="/menuDeCafeteria">
                        <LocalCafeIcon sx={{ fontSize: 18 }} /> Cafetería
                    </Button>
                </Box>

                {/* Barra de búsqueda */}
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ fontSize: 18 }} />
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Buscar…" inputProps={{ "aria-label": "search" }} />
                </Search>

                {/* Cerrar sesión */}
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
