import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Close as CloseIcon,
    Email as EmailIcon,
    Business as BusinessIcon
} from '@mui/icons-material';

const Contacto = ({ open, onClose, edificioData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Si no hay datos específicos del edificio, no mostrar nada
    if (!edificioData) return null;

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: isMobile ? '100%' : 400,
                    maxWidth: '90vw',
                    boxSizing: 'border-box',
                },
            }}
        >
            {/* Header del popup */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                }}
            >
                <Typography variant="h6" component="h2">
                    Contacto - {edificioData.nombre}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ color: theme.palette.primary.contrastText }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Contenido del popup */}
            <Box sx={{ p: 2, overflow: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
                <Box sx={{ mb: 3 }}>
                    {/* Header del edificio */}
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.primary.main,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <BusinessIcon fontSize="small" />
                        {edificioData.nombre}
                    </Typography>

                    {/* Lista de contactos */}
                    <List dense>
                        {edificioData.contactos.map((contacto, contactIndex) => (
                            <React.Fragment key={contactIndex}>
                                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {contacto.nombre}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {contacto.puesto}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mt: 0.5
                                                    }}
                                                >
                                                    <EmailIcon fontSize="small" color="primary" />
                                                    <Typography
                                                        variant="body2"
                                                        component="a"
                                                        href={`mailto:${contacto.correo}`}
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            textDecoration: 'none',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                    >
                                                        {contacto.correo}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {contactIndex < edificioData.contactos.length - 1 && (
                                    <Divider sx={{ my: 1 }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Contacto;