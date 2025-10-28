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
    // Bebidas frías
    { id: 1, nombre: "Agua de Limón", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a08d15b3-e4f5-4f0e-ab75-16cee001e551/Derivates/78b86750-345f-4699-9566-b6980c7fb7df.jpg" },
    { id: 2, nombre: "Agua de Jamaica", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://www.infobae.com/new-resizer/uG1_j7rxuCS3kHhMu-ThO0rrDEo=/arc-anglerfish-arc2-prod-infobae/public/IDNEPYYXRJBFHBLLZZ5BO5OJDY.jpg" },
    { id: 3, nombre: "Agua de Horchata", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://images.aws.nestle.recipes/original/8eaf50148ed521383df5d9793cba995f_whatsapp_image_2022-04-28_at_1.00.26_pm_(2).jpeg" },
    { id: 4, nombre: "Agua de Frutas", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://www.cocinavital.mx/wp-content/uploads/2018/07/agua-de-frutas-e1562606943568.jpg" },
    { id: 5, nombre: "Agua de Piña Colada", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://images.aws.nestle.recipes/resized/2020_05_11T08_48_56_mrs_ImageRecipes_122175lrg_1080_850.jpg" },
    { id: 6, nombre: "Agua de Café", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/e5f68050bea3b5d8c9cd7269d88f65a5.jpg" },
    { id: 7, nombre: "Agua de Limón Chia", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://cdn.blogsthermomix.es/media/Galleries/attachments/1e858bbfd6ea0cb6b242876a210afcd7.png" },
    { id: 8, nombre: "Agua de Rompope", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://www.cocinavital.mx/wp-content/uploads/2022/03/agua-de-rompope-estilo-la-michoacana-1.jpg" },
    { id: 9, nombre: "Agua de Guayaba", descripcion: "", costo: "$25", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://images.aws.nestle.recipes/original/81b4ce585b0019c9a7b5b7ebcbacb7c8_agua_de_guayaba_-_carnation_polvo.jpg" },

    // Agua simple
    { id: 10, nombre: "Agua simple 1lt", descripcion: "", costo: "$15", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00075810410042L4.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF" },
    { id: 11, nombre: "Agua simple 1.5lt", descripcion: "", costo: "$20", categoria: "Bebidas", tipoBebida: "Fría", imagen: "https://d1zc67o3u1epb0.cloudfront.net/media/catalog/product/4/5/45_1_2__2.jpg?width=265&height=390&store=default&image-type=image" },

    // Bebidas calientes
    { id: 12, nombre: "Café de olla", descripcion: "Chico $10 / Grande $15", costo: "", categoria: "Bebidas", tipoBebida: "Caliente", imagen: "https://villacocina.com/wp-content/uploads/2023/01/Cafe-de-olla-4-scaled.jpg" },
    { id: 13, nombre: "Café con leche", descripcion: "Chico $15 / 1/2 $20", costo: "", categoria: "Bebidas", tipoBebida: "Caliente", imagen: "https://cdn7.kiwilimon.com/recetaimagen/15262/960x640/7456.jpg.jpg" },
    { id: 14, nombre: "Capuccino", descripcion: "", costo: "$20", categoria: "Bebidas", tipoBebida: "Caliente", imagen: "https://lamafia.es/wp-content/uploads/2019/07/capuccino-italiano.png" },
    { id: 15, nombre: "Té", descripcion: "Chico $10 / 1/2 $20", costo: "", categoria: "Bebidas", tipoBebida: "Caliente", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6e61krKMDX3eMCv626q25pZauJK_f3U9MQQ&s" },

    { id: 16, nombre: "Desayuno de huevo con jamón", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$50", categoria: "Desayunos", imagen: "https://inmamamaggieskitchen.com/wp-content/uploads/2020/05/Jamon-con-Heuvos.jpg" },
    { id: 17, nombre: "Desayuno de huevo con salchicha", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$50", categoria: "Desayunos", imagen: "https://cocina-casera.com/mx/wp-content/uploads/2017/12/huevos-revueltos-con-salchicha.jpg" },
    { id: 18, nombre: "Desayuno de huevo a la mexicana", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$50", categoria: "Desayunos", imagen: "https://conave.org/wp-content/uploads/2020/03/huevos-mexicana.jpg" },
    { id: 19, nombre: "Desayuno de huevo con salsa verde", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$50", categoria: "Desayunos", imagen: "https://www.isabeleats.com/wp-content/uploads/2021/02/huevos-con-chile-verde-small-4.jpg" },
    { id: 20, nombre: "Desayuno de huevo con salsa roja", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$50", categoria: "Desayunos", imagen: "https://cdn7.kiwilimon.com/brightcove/11027/640x640/11027.jpg.webp" },

    // Desayunos variados
    { id: 21, nombre: "Desayuno de milanesa de pollo", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://images.ctfassets.net/uu4q7lk7kqth/1s0q9wfjWxUdjjSvIgSQZw/34d8ad0c0b8bf7bfbf84433754c72f1b/milanesa-de-pollo-con-papa-fritas.jpg" },
    { id: 22, nombre: "Chilaquiles verdes", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://patijinich.com/es/wp-content/uploads/sites/3/2017/07/207-chilaquiles-verdes.jpg" },
    { id: 23, nombre: "Chilaquiles rojos", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://cdn0.recetasgratis.net/es/posts/6/9/0/chilaquiles_rojos_con_pollo_75096_orig.jpg" },
    { id: 24, nombre: "Enchiladas verdes", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://editorialtelevisa.brightspotcdn.com/wp-content/uploads/2019/05/enchiladas-verdes.png" },
    { id: 25, nombre: "Enchiladas rojas", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://images.aws.nestle.recipes/original/54d78382e6f59c5c03953121d080e25f_enchiladas_rojas_baja.jpg" },
    { id: 26, nombre: "Enmoladas", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://sabrosano.com/wp-content/uploads/2020/05/enmoladas-principal.jpg" },
    { id: 27, nombre: "Enfrijoladas", descripcion: "Incluye fruta, café de olla, pan blanco y frijoles.", costo: "$60", categoria: "Desayunos", imagen: "https://img-global.cpcdn.com/steps/6982b8f4aaff4701/400x400cq80/photo.jpg" },


    // Comidas
    { id: 28, nombre: "Tacos dorados de pollo", descripcion: "4 tacos con crema, queso y lechuga", costo: "$25", categoria: "Comidas", imagen: "https://cdn0.recetasgratis.net/es/posts/2/9/4/tacos_dorados_de_jamon_y_queso_55492_orig.jpg" },
    { id: 29, nombre: "Quesadillas de papa", descripcion: "4 quesadillas con crema, queso y lechuga", costo: "$25", categoria: "Comidas", imagen: "https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/91990b510362fdc32d64ed0a56d5bd4a.jpg" },
    { id: 30, nombre: "Chilaquiles rojos o verdes", descripcion: "Con pollo o suadero, crema, queso y bolillo", costo: "$50", categoria: "Comidas", imagen: "https://i.redd.it/44koory6f7991.jpg" },
];

const categorias = ["Desayunos", "Comidas", "Bebidas"];

export default function MenuDeCafeteria() {
    const [filtro, setFiltro] = useState("Todos");

    const handleChange = (event) => setFiltro(event.target.value);

    // Bebidas separadas
    const bebidasFrias = platillos.filter(p => p.categoria === "Bebidas" && p.tipoBebida === "Fría");
    const bebidasCalientes = platillos.filter(p => p.categoria === "Bebidas" && p.tipoBebida === "Caliente");

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                Menú de la cafetería del TESOEM
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <FormControl sx={{ minWidth: 180, backgroundColor: "#eff3f8", borderRadius: 2, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}>
                    <Select
                        value={filtro}
                        onChange={handleChange}
                        renderValue={(selected) => selected}
                        IconComponent={() => null}
                        endAdornment={<InputAdornment position="end"><MenuIcon sx={{ color: "#bfc3c9" }} /></InputAdornment>}
                        sx={{ color: "#bfc3c9", fontWeight: "bold" }}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
                        {categorias.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            {/* Mostrar bebidas */}
            {(filtro === "Todos" || filtro === "Bebidas") && (
                <>
                    {bebidasFrias.length > 0 && (
                        <>
                            <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>Bebidas frías</Typography>
                            <Grid container spacing={3}>
                                {bebidasFrias.map((platillo) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={platillo.id}>
                                        <Card sx={{ height: "100%" }}>
                                            <CardMedia component="img" height="160" image={platillo.imagen} alt={platillo.nombre} />
                                            <CardContent>
                                                <Typography variant="h6">{platillo.nombre}</Typography>
                                                <Typography variant="body2" color="text.secondary">{platillo.descripcion}</Typography>
                                                {platillo.costo && <Typography variant="subtitle1" fontWeight="bold">{platillo.costo}</Typography>}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    {bebidasCalientes.length > 0 && (
                        <>
                            <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>Bebidas calientes</Typography>
                            <Grid container spacing={3}>
                                {bebidasCalientes.map((platillo) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={platillo.id}>
                                        <Card sx={{ height: "100%" }}>
                                            <CardMedia component="img" height="160" image={platillo.imagen} alt={platillo.nombre} />
                                            <CardContent>
                                                <Typography variant="h6">{platillo.nombre}</Typography>
                                                <Typography variant="body2" color="text.secondary">{platillo.descripcion}</Typography>
                                                {platillo.costo && <Typography variant="subtitle1" fontWeight="bold">{platillo.costo}</Typography>}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>
            )}

            {/* Mostrar desayunos */}
            {(filtro === "Todos" || filtro === "Desayunos") && (
                <>
                    <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>Desayunos</Typography>
                    <Grid container spacing={3}>
                        {platillos.filter(p => p.categoria === "Desayunos").map((platillo) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={platillo.id}>
                                <Card sx={{ height: "100%" }}>
                                    <CardMedia component="img" height="160" image={platillo.imagen} alt={platillo.nombre} />
                                    <CardContent>
                                        <Typography variant="h6">{platillo.nombre}</Typography>
                                        <Typography variant="body2" color="text.secondary">{platillo.descripcion}</Typography>
                                        {platillo.costo && <Typography variant="subtitle1" fontWeight="bold">{platillo.costo}</Typography>}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {/* Mostrar comidas */}
            {(filtro === "Todos" || filtro === "Comidas") && (
                <>
                    <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>Comidas</Typography>
                    <Grid container spacing={3}>
                        {platillos.filter(p => p.categoria === "Comidas").map((platillo) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={platillo.id}>
                                <Card sx={{ height: "100%" }}>
                                    <CardMedia component="img" height="160" image={platillo.imagen} alt={platillo.nombre} />
                                    <CardContent>
                                        <Typography variant="h6">{platillo.nombre}</Typography>
                                        <Typography variant="body2" color="text.secondary">{platillo.descripcion}</Typography>
                                        {platillo.costo && <Typography variant="subtitle1" fontWeight="bold">{platillo.costo}</Typography>}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
}
