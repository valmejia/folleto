import React, { useState } from "react";
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Card,
    CardContent,
    CardMedia,
    Grid,
    InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const platillos = [
    {
        id: 1,
        nombre: "Pastel de Chocolate",
        descripcion: "Pastel esponjoso con cobertura de chocolate.",
        costo: "$80",
        categoria: "Dulces",
        imagen:
            "https://images.unsplash.com/photo-1608198093002-ad4e005484a6?w=500",
    },
    {
        id: 2,
        nombre: "Tacos al Pastor",
        descripcion: "Tortillas de maíz con carne al pastor y piña.",
        costo: "$50",
        categoria: "Comidas",
        imagen:
            "https://images.unsplash.com/photo-1617196039897-1d5dcf5f9a68?w=500",
    },
    {
        id: 3,
        nombre: "Agua de Horchata",
        descripcion: "Refrescante bebida de arroz con canela.",
        costo: "$25",
        categoria: "Bebidas",
        imagen:
            "https://images.unsplash.com/photo-1623689040400-d3db59bd4cb4?w=500",
    },
    {
        id: 4,
        nombre: "Gelatina de Fresa",
        descripcion: "Postre frío de fresa con leche condensada.",
        costo: "$20",
        categoria: "Snacks",
        imagen:
            "https://images.unsplash.com/photo-1626075644240-6c0e2c9a89c1?w=500",
    },
];

const categorias = ["Desayunos", "Comidas", "Bebidas", "Snacks"];

export default function MenuDeCafeteria() {
    const [filtro, setFiltro] = useState("");

    const handleChange = (event) => {
        setFiltro(event.target.value);
    };

    const platillosFiltrados =
        filtro === "" ? platillos : platillos.filter((p) => p.categoria === filtro);

    return (
        <Box sx={{ p: 3 }}>
            {/* Título */}
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold" }}
            >
                Menú de la cafetería del TESOEM
            </Typography>

            {/* Filtro a la derecha */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <FormControl
                    sx={{
                        minWidth: 180,
                        backgroundColor: "#eff3f8",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                >
                    <Select
                        displayEmpty
                        value={filtro}
                        onChange={handleChange}
                        renderValue={(selected) => (selected === "" ? "Filtros" : selected)}
                        IconComponent={() => null} // ❌ quita la flecha
                        endAdornment={
                            <InputAdornment position="end">
                                <MenuIcon sx={{ color: "#bfc3c9" }} />
                            </InputAdornment>
                        }
                        sx={{
                            color: "#bfc3c9",
                            fontWeight: "bold",
                        }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {categorias.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Grid de tarjetas */}
            <Grid container spacing={3}>
                {platillosFiltrados.map((platillo) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={platillo.id}>
                        <Card sx={{ height: "100%" }}>
                            <CardMedia
                                component="img"
                                height="160"
                                image={platillo.imagen}
                                alt={platillo.nombre}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {platillo.nombre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {platillo.descripcion}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                                    {platillo.costo}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
