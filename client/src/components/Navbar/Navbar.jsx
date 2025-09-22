// Navbar.jsx
import React, { useState, useContext } from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";

// Barra de búsqueda
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#eff3f8",
    marginLeft: "auto",
    width: "100%",
    [theme.breakpoints.up("sm")]: { width: "auto" },
}));

const SearchIconWrapper = styled("div")(() => ({
    padding: "0 16px",
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#bfc3c9",
}));

const StyledInputBase = styled(InputBase)(() => ({
    color: "#000",
    paddingLeft: "calc(1em + 32px)",
    width: "100%",
    "&::placeholder": {
        color: "#bfc3c9",
    },
}));

function Navbar() {
    const [anchorCarrera, setAnchorCarrera] = useState(null);
    const [anchorTramites, setAnchorTramites] = useState(null);

    const handleOpenCarrera = (event) => setAnchorCarrera(event.currentTarget);
    const handleCloseCarrera = () => setAnchorCarrera(null);

    const handleOpenTramites = (event) => setAnchorTramites(event.currentTarget);
    const handleCloseTramites = () => setAnchorTramites(null);

    const carreras = ["Ingeniería", "Medicina", "Arquitectura", "Derecho"];
    const tramites = ["Inscripción", "Certificados", "Pagos", "Horario"];

    const { isLoggedIn, isLoading, user, logOutUser } = useContext(AuthContext);

    const fullWidthMenuProps = {
        PaperProps: {
            sx: {
                width: "100vw",
                maxWidth: "100vw",
                borderRadius: 0,
            },
        },
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "left",
        },
    };

    const buttonStyle = { color: "#000", mx: 2 }; // margen horizontal entre botones
    const menuItemStyle = { py: 1.5, px: 3 }; // padding vertical y horizontal en menús

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            <Toolbar>
                {/* Logo */}
                <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 40, mr: 3 }} />

                {/* Links principales */}
                <Button sx={buttonStyle} component={Link} to="/">Mapa</Button>

                {/* Carreras */}
                <Button sx={buttonStyle} onClick={handleOpenCarrera}>Carrera</Button>
                <Menu
                    anchorEl={anchorCarrera}
                    open={Boolean(anchorCarrera)}
                    onClose={handleCloseCarrera}
                    {...fullWidthMenuProps}
                >
                    {carreras.map((c, i) => (
                        <MenuItem key={i} onClick={handleCloseCarrera} sx={menuItemStyle}>
                            {c}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Trámites */}
                <Button sx={buttonStyle} onClick={handleOpenTramites}>Trámites</Button>
                <Menu
                    anchorEl={anchorTramites}
                    open={Boolean(anchorTramites)}
                    onClose={handleCloseTramites}
                    {...fullWidthMenuProps}
                >
                    {tramites.map((t, i) => (
                        <MenuItem key={i} onClick={handleCloseTramites} sx={menuItemStyle}>
                            {t}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Cafetería */}
                <Button sx={buttonStyle} component={Link} to="/menuDeCafeteria">Cafetería</Button>

                {/* Barra de búsqueda */}
                <Search sx={{ marginLeft: "auto", minWidth: 200 }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Buscar…" inputProps={{ "aria-label": "search" }} />
                </Search>

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
