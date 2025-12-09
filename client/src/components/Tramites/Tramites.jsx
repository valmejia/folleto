
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Box,
    Paper,
    Tabs,
    Tab,
    IconButton,
    useTheme,
    useMediaQuery,
    alpha,
    createTheme,
    ThemeProvider,
    Chip,
} from '@mui/material';
import {
    School,
    Assignment,
    Description,
    Payment,
    ExitToApp,
    LocationOn,
    Phone,
    Email,
    AccessTime,
    List as ListIcon,
    Close,
    Search,
    FilterList,
    ArrowForward,
    PlayArrow,
    Download,
    Visibility,
    Group,
    Work,
    Security,
    Badge,
    AssignmentTurnedIn,
    LocalHospital,
    Handshake,
    Work as Briefcase,
    Security as ShieldCheck,
    Badge as IdCard,
    AssignmentTurnedIn as ClipboardCheck,
    LocalHospital as Activity
} from '@mui/icons-material';

// Crear tema verde personalizado
const greenTheme = createTheme({
    palette: {
        primary: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#388e3c',
            light: '#4caf50',
            dark: '#2e7d32',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
});

// Datos de los trámites COMPLETOS - Sin importancia y disponibilidad
const tramitesData = [
    {
        id: 1,
        titulo: 'Inscripción',
        descripcion: 'Proceso que regula el ingreso de alumnos para continuar con su proceso educativo a nivel superior',
        icono: <School />,
        pasos: [
            {
                titulo: 'Verificación de costos',
                descripcion: 'Consultar el costo de inscripción en el portal oficial',
                detalle: 'Visitar https://sfpya.edomexico.gob.mx/recaudacion/ para verificar costos actualizados',
                duracion: '5-10 minutos'
            },
            {
                titulo: 'Pre-inscripción en línea',
                descripcion: 'Completar el formulario de pre-inscripción',
                detalle: 'Acceder al sistema de pre-inscripción del TESOEM y llenar todos los campos requeridos',
                duracion: '15-20 minutos'
            },
            {
                titulo: 'Reunir documentación',
                descripcion: 'Preparar toda la documentación requerida',
                detalle: 'Revisar la lista completa de documentos y asegurarse de tener todo en orden',
                duracion: '1-2 días'
            },
            {
                titulo: 'Realizar pagos',
                descripcion: 'Efectuar los pagos correspondientes',
                detalle: 'Pagar en la institución bancaria indicada y guardar los comprobantes',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Entrega de documentación',
                descripcion: 'Presentar documentación en Control Escolar',
                detalle: 'Acudir al Departamento de Control Escolar con toda la documentación original y copias',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Confirmación',
                descripcion: 'Recibir confirmación de inscripción',
                detalle: 'Esperar la validación y recibir el comprobante de inscripción final',
                duracion: '3-5 días hábiles'
            }
        ],
        documentos: [
            {
                nombre: 'Solicitud de inscripción TecNM-AC-PO-001-02',
                tipo: 'Formato oficial',
                original: true,
                copias: 0,
                observaciones: 'Debe estar firmada y llenada correctamente'
            },
            {
                nombre: 'Certificado de Bachillerato',
                tipo: 'Documento académico',
                original: true,
                copias: 1,
                observaciones: 'Original para cotejo y copia para archivo'
            },
            {
                nombre: 'Constancia de terminación de estudios',
                tipo: 'Documento académico',
                original: true,
                copias: 0,
                observaciones: 'Debe indicar cumplimiento al 100% de créditos'
            },
            {
                nombre: 'Acta de nacimiento',
                tipo: 'Documento legal',
                original: true,
                copias: 1,
                observaciones: 'No mayor a 3 años de antigüedad'
            },
            {
                nombre: 'CURP',
                tipo: 'Documento de identificación',
                original: true,
                copias: 1,
                observaciones: 'Copia ampliada al 200%'
            },
            {
                nombre: 'Fotografías infantiles',
                tipo: 'Fotográfico',
                original: true,
                copias: 0,
                cantidad: 2,
                observaciones: 'Recientes, tamaño infantil'
            },
            {
                nombre: 'Identificación oficial (INE)',
                tipo: 'Identificación',
                original: false,
                copias: 1,
                observaciones: 'Copia legible por ambos lados'
            },
            {
                nombre: 'Carta Compromiso TecNM-AC-PO-001-05',
                tipo: 'Formato oficial',
                original: true,
                copias: 1,
                observaciones: 'Firmada por el estudiante'
            },
            {
                nombre: 'Comprobante de pago reinscripción',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Línea de captura pagada'
            },
            {
                nombre: 'Comprobante examen admisión',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Monto: $704.00'
            }
        ],
        costo: 'Verificar en https://sfpya.edomexico.gob.mx/recaudacion/',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 - 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 2,
        titulo: 'Reinscripción Estudiantes Regulares 2025-2',
        descripcion: 'Proceso de reinscripción para estudiantes regulares del TESOEM que continuarán sus estudios durante el semestre enero-septiembre 2025.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Generar Formato Universal de Pago (FUP)',
                descripcion: 'Obtén el formato de pago correspondiente a reinscripción e imprime el comprobante.',
                detalle: 'Ingresar a https://sfpya.edomexico.gob.mx/recaudacion → Organismos Auxiliares → Tecnológico de Estudios Superiores del Oriente del Estado de México → Tipo: Control Escolar y Titulación → Concepto: Inscripción/Reinscripción (Licenciatura/Ingeniería) y Cuota de Recuperación con descuento por aprovechamiento académico.',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Realizar el pago',
                descripcion: 'Efectuar el pago correspondiente y conservar el comprobante.',
                detalle: 'Presentar ticket o comprobante de pago en original y copia en ventanilla.',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Generar Constancia de Vigencia de Derechos IMSS',
                descripcion: 'Obtener constancia actualizada de afiliación al IMSS.',
                detalle: 'Acceder a https://www.gob.mx/afiliatealimss y seguir el paso 2 "Constancia de Vigencia de Derechos".',
                duracion: '10-20 minutos'
            },
            {
                titulo: 'Entrega de documentos',
                descripcion: 'Presentar documentación completa en ventanilla de Control Escolar.',
                detalle: 'Horario de atención: 9:30 a 16:00 hrs. Es indispensable cumplir con las fechas del calendario oficial.',
                duracion: '1-2 horas'
            }
        ],
        documentos: [
            {
                nombre: 'Formato Universal de Pago (FUP)',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 1,
                observaciones: 'Debe corresponder al concepto de reinscripción y cuota de recuperación.'
            },
            {
                nombre: 'Constancia de Vigencia de Derechos IMSS',
                tipo: 'Documento oficial',
                original: true,
                copias: 0,
                observaciones: 'Debe estar actualizada.'
            }
        ],
        costo: 'Consultar en https://sfpya.edomexico.gob.mx/recaudacion/',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 - 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 3,
        titulo: 'Reinscripción Estudiantes Irregulares 2025-2',
        descripcion: 'Trámite de reinscripción dirigido a estudiantes irregulares del TESOEM que presenten materias pendientes o recursamientos.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Generar Formato Universal de Pago (FUP)',
                descripcion: 'Descargar el formato y generar el pago correspondiente.',
                detalle: 'Ingresar a https://sfpya.edomexico.gob.mx/recaudacion → Organismos Auxiliares → TESOEM → Tipo: Control Escolar y Titulación → Concepto: Inscripción/Reinscripción (Licenciatura/Ingeniería) y Recursamiento por crédito ordinario.',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Realizar el pago',
                descripcion: 'Pagar en los medios autorizados y conservar el comprobante.',
                detalle: 'Presentar ticket o comprobante de pago en original y copia en ventanilla.',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Generar Constancia de Vigencia de Derechos IMSS',
                descripcion: 'Asegurarse de tener la constancia correcta y sin duplicidad de servicio médico.',
                detalle: 'Acceder a https://www.gob.mx/afiliatealimss → Paso 2 "Constancia de Vigencia de Derechos". Si aparece servicio médico de bachillerato, tramitar la baja antes de reinscribirse.',
                duracion: '10-20 minutos'
            },
            {
                titulo: 'Entrega de documentos',
                descripcion: 'Presentar documentación completa en Control Escolar dentro del periodo establecido.',
                detalle: 'Horario de atención: 9:00 a 16:00 hrs.',
                duracion: '1-2 horas'
            }
        ],
        documentos: [
            {
                nombre: 'Formato Universal de Pago (FUP)',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 1,
                observaciones: 'Debe incluir concepto de reinscripción y recursamiento.'
            },
            {
                nombre: 'Constancia de Vigencia de Derechos IMSS',
                tipo: 'Documento oficial',
                original: true,
                copias: 0,
                observaciones: 'Debe estar actualizada y sin registro activo en otra institución.'
            }
        ],
        costo: 'Consultar en https://sfpya.edomexico.gob.mx/recaudacion/',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 - 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 4,
        titulo: 'Reinscripción por Traslado, Convalidación o Equivalencia 2025-2',
        descripcion: 'Trámite para estudiantes que ingresan al TESOEM mediante traslado, convalidación o equivalencia de estudios.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Generar Formato Universal de Pago (FUP)',
                descripcion: 'Descargar el formato de pago según el tipo de trámite académico.',
                detalle: 'Ingresar a https://sfpya.edomexico.gob.mx/recaudacion → Organismos Auxiliares → TESOEM → Tipo: Control Escolar y Titulación → Concepto: Inscripción/Reinscripción (Licenciatura/Ingeniería) o recursamiento por crédito ordinario según corresponda.',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Preparar documentación académica',
                descripcion: 'Reunir y organizar todos los documentos solicitados para traslado o equivalencia.',
                detalle: 'Incluye dictamen, oficio de materias, acta de nacimiento, certificados y formatos institucionales.',
                duracion: '1-2 días'
            },
            {
                titulo: 'Entrega de documentos',
                descripcion: 'Presentar expediente completo en Control Escolar.',
                detalle: 'Horario de atención: 9:00 a 16:00 hrs. Los documentos deben entregarse en físico.',
                duracion: '1-2 horas'
            }
        ],
        documentos: [
            {
                nombre: 'Formato Universal de Pago (FUP)',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 1,
                observaciones: 'Debe incluir concepto de inscripción/reinscripción o recursamiento.'
            },
            {
                nombre: 'Dictamen académico',
                tipo: 'Documento académico',
                original: true,
                copias: 0,
                observaciones: 'Solo aplica para equivalencia o convalidación.'
            },
            {
                nombre: 'Oficio de materias a cursar',
                tipo: 'Documento académico',
                original: true,
                copias: 0,
                observaciones: 'Emitido por la Jefatura de División.'
            },
            {
                nombre: 'Formato FO-CE-02',
                tipo: 'Formato institucional',
                original: true,
                copias: 0,
                observaciones: 'Descargar y llenar desde https://tesoem.edomex.gob.mx/publicaciones.'
            },
            {
                nombre: 'Acta de nacimiento',
                tipo: 'Documento legal',
                original: true,
                copias: 0,
                observaciones: 'Original para cotejo.'
            },
            {
                nombre: 'CURP actualizado',
                tipo: 'Documento de identificación',
                original: true,
                copias: 1,
                observaciones: 'Descargar desde https://www.gob.mx/curp/.'
            },
            {
                nombre: 'Constancia de Vigencia de Derechos IMSS',
                tipo: 'Documento oficial',
                original: true,
                copias: 0,
                observaciones: 'Debe estar actualizada.'
            },
            {
                nombre: 'Copia del INE',
                tipo: 'Identificación oficial',
                original: false,
                copias: 1,
                observaciones: 'Por ambos lados, legible.'
            },
            {
                nombre: 'Certificado de Bachillerato',
                tipo: 'Documento académico',
                original: true,
                copias: 0,
                observaciones: 'Requerido para cotejo.'
            },
            {
                nombre: 'Certificado de Secundaria',
                tipo: 'Documento académico',
                original: true,
                copias: 1,
                observaciones: 'Original para cotejo, copia para entrega.'
            },
            {
                nombre: 'Oficio de No Inconveniencia (Anexo IV)',
                tipo: 'Documento institucional',
                original: true,
                copias: 0,
                observaciones: 'Debe entregarse en sobre sellado por la institución de origen.'
            }
        ],
        costo: 'Consultar en https://sfpya.edomexico.gob.mx/recaudacion/',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 - 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 5,
        titulo: 'Servicio Social',
        descripcion: 'Actividad obligatoria en la que el estudiante aplica los conocimientos adquiridos en su formación profesional, con una duración mínima de 6 meses y máxima de 2 años, cubriendo 480 horas.',
        icono: <Handshake />,
        pasos: [
            {
                titulo: 'Verificar elegibilidad',
                descripcion: 'Comprobar el porcentaje de créditos académicos.',
                detalle: 'Revisar en el sistema Escolaris contar con al menos el 50% de créditos y estar cursando sexto o séptimo semestre.',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Llenar formatos oficiales',
                descripcion: 'Completar los formatos requeridos para el registro.',
                detalle: 'Llenar en computadora los formatos "Solicitud de Servicio Social", "Carta Compromiso" y "Formato de Evaluación" (TecNM-VI-PO-002).',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Reunir documentación',
                descripcion: 'Preparar y organizar toda la documentación requerida.',
                detalle: 'Adjuntar copias de CURP, Vigencia de Derechos IMSS, Cédula de Reinscripción y demás formatos oficiales.',
                duracion: '1 día'
            },
            {
                titulo: 'Entrega de documentos',
                descripcion: 'Entregar la documentación en el Departamento correspondiente.',
                detalle: 'Acudir al Departamento de Servicio Social y Residencias Profesionales en los periodos febrero-marzo o agosto-septiembre.',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Obtener carta de aceptación',
                descripcion: 'Recibir autorización para iniciar el servicio social.',
                detalle: 'La institución receptora emitirá la carta dirigida al jefe(a) del Departamento de Servicio Social.',
                duracion: '3-5 días hábiles'
            },
            {
                titulo: 'Registro en plataforma',
                descripcion: 'Registrar el servicio en el sistema oficial.',
                detalle: 'Acceder al Sistema Integral de Servicio Social y capturar los datos requeridos.',
                duracion: '30-45 minutos'
            },
            {
                titulo: 'Curso de inducción y seguimiento',
                descripcion: 'Participar en el curso y entregar informes.',
                detalle: 'Asistir al curso de inducción y entregar el segundo informe junto con la carta de término al finalizar.',
                duracion: 'Durante el periodo del servicio social'
            }
        ],
        documentos: [
            {
                nombre: 'Constancia de créditos (50% mínimo)',
                tipo: 'Documento académico',
                original: false,
                copias: 1,
                observaciones: 'Verificar porcentaje en Escolaris'
            },
            {
                nombre: 'Formato Solicitud de Servicio Social (TecNM-VI-PO-002-A010)',
                tipo: 'Formato oficial',
                original: true,
                copias: 0,
                observaciones: 'Llenar los campos amarillos a computadora'
            },
            {
                nombre: 'Carta Compromiso de Servicio Social (TecNM-VI-PO-002-02)',
                tipo: 'Formato oficial',
                original: true,
                copias: 1,
                observaciones: 'Firmada y llenada correctamente'
            },
            {
                nombre: 'Formato de Evaluación',
                tipo: 'Formato oficial',
                original: true,
                copias: 0,
                observaciones: 'Se entrega junto al segundo informe'
            },
            {
                nombre: 'Constancia de Vigencia de Derechos IMSS',
                tipo: 'Documento médico',
                original: true,
                copias: 1,
                observaciones: 'Descargada desde https://www.gob.mx/afiliatealimss'
            },
            {
                nombre: 'CURP',
                tipo: 'Identificación',
                original: true,
                copias: 1,
                observaciones: 'Actualizada y legible'
            },
            {
                nombre: 'Cédula de Reinscripción',
                tipo: 'Documento escolar',
                original: true,
                copias: 0,
                observaciones: 'Debe corresponder al semestre vigente'
            },
            {
                nombre: 'Carta de Aceptación de la Institución',
                tipo: 'Documento de autorización',
                original: true,
                copias: 0,
                observaciones: 'Dirigida al Departamento de Servicio Social del TESOEM'
            },
            {
                nombre: 'Carta de Término',
                tipo: 'Documento de cierre',
                original: true,
                copias: 0,
                observaciones: 'Emitida al concluir el servicio social'
            }
        ],
        costo: 'Sin costo directo. Verificar posibles pagos administrativos en https://sfpya.edomexico.gob.mx/recaudacion/',
        departamento: 'Departamento de Servicio Social y Residencias Profesionales',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Jefatura del Departamento de Servicio Social y Residencias Profesionales',
        telefono: '0155 - 559863505 y 59863507, ext. 120',
        email: 'ss.rp@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 16:00 hrs'
    },
    {
        id: 6,
        titulo: 'Residencia Profesional',
        descripcion: 'Asignatura del noveno semestre donde el estudiante desarrolla un proyecto profesional aplicando los conocimientos adquiridos en su carrera. Duración: 500 horas en un periodo de 4 a 6 meses.',
        icono: <Briefcase />,
        pasos: [
            {
                titulo: 'Verificar elegibilidad',
                descripcion: 'Comprobar el porcentaje de créditos académicos.',
                detalle: 'Revisar en Escolaris contar con al menos el 80% de créditos y estar inscrito en noveno semestre.',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Llenar formatos oficiales',
                descripcion: 'Completar la documentación requerida.',
                detalle: 'Llenar los formatos "Solicitud de Carta de Presentación (FO-SS-04)" y "Autorización para Residencia Profesional (FO-SS-08)" en computadora, recabando sellos y firmas.',
                duracion: '2-3 horas'
            },
            {
                titulo: 'Reunir documentación',
                descripcion: 'Preparar todos los documentos solicitados.',
                detalle: 'Incluir copias de Vigencia de Derechos IMSS, Cédula de Reinscripción y formatos completos.',
                duracion: '1 día'
            },
            {
                titulo: 'Entrega en Departamento',
                descripcion: 'Entregar documentación completa en físico.',
                detalle: 'Presentar documentos en el Departamento de Servicio Social y Residencias Profesionales durante febrero-marzo o agosto-septiembre.',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Recepción de carta de presentación',
                descripcion: 'Recibir autorización para iniciar la residencia.',
                detalle: 'Esperar la emisión de la carta dirigida a la empresa o institución receptora.',
                duracion: '3-5 días hábiles'
            },
            {
                titulo: 'Entrega de carta de aceptación',
                descripcion: 'Entregar confirmación de la empresa receptora.',
                detalle: 'La institución o empresa debe emitir la carta de aceptación y entregarla al departamento.',
                duracion: '3-5 días hábiles'
            },
            {
                titulo: 'Finalización y entrega de informes',
                descripcion: 'Concluir el proyecto y formalizar el cierre.',
                detalle: 'Entregar la carta de término e informes finales en el departamento antes del plazo de 2 años.',
                duracion: 'Durante o al finalizar la residencia'
            }
        ],
        documentos: [
            {
                nombre: 'Constancia de créditos (80% mínimo)',
                tipo: 'Documento académico',
                original: false,
                copias: 1,
                observaciones: 'Verificar porcentaje en Escolaris'
            },
            {
                nombre: 'Solicitud de Carta de Presentación para Residencia Profesional (FO-SS-04)',
                tipo: 'Formato oficial',
                original: true,
                copias: 0,
                observaciones: 'Llenar a computadora con datos completos'
            },
            {
                nombre: 'Autorización para Residencia Profesional (FO-SS-08)',
                tipo: 'Formato oficial',
                original: true,
                copias: 1,
                observaciones: 'Debe contener sellos y firmas de los departamentos requeridos'
            },
            {
                nombre: 'Constancia de Vigencia de Derechos IMSS',
                tipo: 'Documento médico',
                original: true,
                copias: 1,
                observaciones: 'Descargada desde https://www.gob.mx/afiliatealimss'
            },
            {
                nombre: 'Cédula de Reinscripción',
                tipo: 'Documento escolar',
                original: true,
                copias: 0,
                observaciones: 'Debe corresponder al semestre vigente'
            },
            {
                nombre: 'Carta de Aceptación de Empresa',
                tipo: 'Documento de autorización',
                original: true,
                copias: 0,
                observaciones: 'Emitida por la empresa receptora del proyecto'
            },
            {
                nombre: 'Carta de Término de Residencia Profesional',
                tipo: 'Documento de cierre',
                original: true,
                copias: 0,
                observaciones: 'Emitida tras concluir el periodo de residencia'
            }
        ],
        costo: 'Sin costo directo. Verificar posibles pagos administrativos en https://sfpya.edomexico.gob.mx/recaudacion/',
        departamento: 'Departamento de Servicio Social y Residencias Profesionales',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Jefatura del Departamento de Servicio Social y Residencias Profesionales',
        telefono: '0155 - 559863505 y 59863507, ext. 120',
        email: 'ss.rp@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 16:00 hrs'
    },
    {
        id: 7,
        titulo: 'Seguro Estudiantil TESOEM',
        descripcion: 'El seguro estudiantil del TESOEM integra el Seguro Facultativo del IMSS y el Seguro contra Accidentes Escolares, garantizando atención médica y protección durante tu estancia académica.',
        icono: <ShieldCheck />,
        pasos: [
            {
                titulo: 'Afiliación al Seguro Facultativo del IMSS',
                descripcion: 'Todos los estudiantes de escuelas de control estatal deben contar con afiliación al IMSS.',
                detalle: 'Por disposición estatal, el 100% de los alumnos deben estar afiliados al seguro facultativo. Es requisito indispensable presentar el carnet con sello de vigencia del año corriente para reinscribirse a partir del segundo semestre.',
                duracion: '15-30 minutos'
            },
            {
                titulo: 'Consulta de Número de Seguridad Social (NSS)',
                descripcion: 'Obtén o consulta tu NSS en línea.',
                detalle: 'Accede al portal https://www.imss.gob.mx/afiliatealimss y selecciona la opción "Solicitud de Asignación o Localización del Número de Seguridad Social".',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Consulta de Vigencia de Derechos',
                descripcion: 'Verifica que tu afiliación al IMSS esté activa.',
                detalle: 'En el portal del IMSS selecciona "Constancia de Vigencia de Derechos". Requiere CURP, NSS y correo electrónico personal.',
                duracion: '10-20 minutos'
            },
            {
                titulo: 'Alta o Cambio de Clínica (UMF)',
                descripcion: 'Regístrate o actualiza tu Unidad de Medicina Familiar según tu domicilio.',
                detalle: 'En https://www.imss.gob.mx/derechohabientes selecciona "Alta" o "Cambio de Clínica". Necesitarás tu CURP, código postal y correo electrónico.',
                duracion: '15-20 minutos'
            },
            {
                titulo: 'Seguro contra Accidentes Escolares',
                descripcion: 'Cubre accidentes ocurridos dentro del plantel o durante traslados relacionados con actividades académicas.',
                detalle: 'El seguro aplica durante la estancia en el plantel, los traslados directos casa-escuela-casa y eventos institucionales organizados por el TESOEM.',
                duracion: 'Automático con reinscripción'
            }
        ],
        documentos: [
            {
                nombre: 'CURP',
                tipo: 'Documento de identidad',
                original: true,
                copias: 0,
                observaciones: 'Requerido para trámites en portales del IMSS.'
            },
            {
                nombre: 'Correo electrónico personal',
                tipo: 'Dato de contacto',
                original: false,
                copias: 0,
                observaciones: 'Debe estar activo para recibir confirmaciones.'
            },
            {
                nombre: 'Número de Seguridad Social (NSS)',
                tipo: 'Identificador del IMSS',
                original: true,
                copias: 0,
                observaciones: 'Obligatorio para constancias de vigencia o alta en clínica.'
            },
            {
                nombre: 'Carnet del IMSS con sello vigente',
                tipo: 'Comprobante de afiliación',
                original: true,
                copias: 0,
                observaciones: 'Requisito indispensable para reinscripción a partir del segundo semestre.'
            }
        ],
        costo: 'Sin costo adicional (incluido en la reinscripción)',
        departamento: 'Servicios Escolares / Control Escolar',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 - 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 8,
        titulo: 'Asignación o Consulta del Número de Seguridad Social (NSS)',
        descripcion: 'Trámite en línea para obtener o localizar tu Número de Seguridad Social (NSS), requerido para el Seguro Facultativo del IMSS.',
        icono: <IdCard />,
        pasos: [
            {
                titulo: 'Ingresar al portal del IMSS',
                descripcion: 'Accede a la plataforma oficial del IMSS.',
                detalle: 'https://www.imss.gob.mx/afiliatealimss → opción "Solicitud de Asignación o Localización del Número de Seguridad Social".',
                duracion: '10 minutos'
            },
            {
                titulo: 'Capturar datos personales',
                descripcion: 'Ingresa tu CURP y correo electrónico personal.',
                detalle: 'Asegúrate de que el correo sea válido, ya que el NSS será enviado a esa dirección.',
                duracion: '5-10 minutos'
            },
            {
                titulo: 'Descargar comprobante',
                descripcion: 'Guarda tu NSS y el documento PDF generado.',
                detalle: 'Este archivo será necesario para reinscripción y otros trámites.',
                duracion: '5 minutos'
            }
        ],
        documentos: [
            {
                nombre: 'CURP',
                tipo: 'Documento de identidad',
                original: true,
                copias: 0
            },
            {
                nombre: 'Correo electrónico personal',
                tipo: 'Dato de contacto',
                original: false,
                copias: 0
            }
        ],
        costo: 'Sin costo',
        departamento: 'IMSS / Servicios Escolares',
        ubicacion: 'En línea o ventanillas del IMSS más cercano',
        contacto: 'www.imss.gob.mx',
        horario: 'Disponible 24/7 en línea'
    },
    {
        id: 9,
        titulo: 'Constancia de Vigencia de Derechos IMSS',
        descripcion: 'Documento que acredita que un estudiante o derechohabiente cuenta con servicio médico activo en el IMSS.',
        icono: <ClipboardCheck />,
        pasos: [
            {
                titulo: 'Acceder al portal del IMSS',
                descripcion: 'Consulta tu constancia en línea.',
                detalle: 'Entra a https://www.imss.gob.mx/afiliatealimss y selecciona la opción "Constancia de Vigencia de Derechos".',
                duracion: '10-15 minutos'
            },
            {
                titulo: 'Ingresar tus datos personales',
                descripcion: 'Captura tu CURP, NSS y correo electrónico.',
                detalle: 'El sistema enviará la constancia en formato PDF a tu correo electrónico.',
                duracion: '5 minutos'
            },
            {
                titulo: 'Descargar e imprimir constancia',
                descripcion: 'Guarda la constancia para reinscripción o trámites escolares.',
                detalle: 'Debe tener vigencia del año en curso.',
                duracion: '5 minutos'
            }
        ],
        documentos: [
            {
                nombre: 'CURP',
                tipo: 'Documento de identidad',
                original: true,
                copias: 0
            },
            {
                nombre: 'Número de Seguridad Social (NSS)',
                tipo: 'Identificador del IMSS',
                original: true,
                copias: 0
            },
            {
                nombre: 'Correo electrónico personal',
                tipo: 'Dato de contacto',
                original: false,
                copias: 0
            }
        ],
        costo: 'Sin costo',
        departamento: 'IMSS / Control Escolar',
        ubicacion: 'Trámite en línea',
        contacto: 'www.imss.gob.mx',
        horario: 'Disponible 24/7 en línea'
    },
    {
        id: 10,
        titulo: 'Seguro contra Accidentes Escolares TECNM',
        descripcion: 'Cobertura médica gratuita para estudiantes del TESOEM durante actividades académicas y traslados directos relacionados.',
        icono: <Activity />,
        pasos: [
            {
                titulo: 'Vigencia y activación',
                descripcion: 'Se activa automáticamente con la reinscripción semestral.',
                detalle: 'No requiere trámite adicional; el seguro cubre durante todo el ciclo escolar vigente.',
                duracion: 'Automático'
            },
            {
                titulo: 'Cobertura',
                descripcion: 'Aplica dentro y fuera del plantel.',
                detalle: 'Incluye accidentes en clase, traslados directos hogar-escuela-hogar, prácticas, eventos deportivos o institucionales.',
                duracion: 'Durante periodo escolar'
            },
            {
                titulo: 'Atención médica en caso de accidente',
                descripcion: 'Reportar inmediatamente el incidente al área de Servicios Escolares o Seguridad.',
                detalle: 'El estudiante debe presentar identificación y comprobante de inscripción.',
                duracion: 'Atención inmediata'
            }
        ],
        documentos: [
            {
                nombre: 'Credencial escolar o comprobante de reinscripción',
                tipo: 'Identificación del estudiante',
                original: true,
                copias: 0
            }
        ],
        costo: 'Sin costo (incluido en reinscripción)',
        departamento: 'Servicios Escolares / Control Escolar',
        ubicacion: 'Edificio F, Planta Baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 - 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 11,
        titulo: 'Certificado de Estudios',
        descripcion: 'Documento oficial que avala cada una de las materias cursadas y los resultados obtenidos. Puede solicitarse como certificado total al finalizar la carrera o como certificado parcial si el alumno tramita su baja definitiva o cuenta con autorización institucional.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Verificación de costos',
                descripcion: 'Consultar el costo correspondiente al tipo de certificado (total o parcial).',
                detalle: 'Ingresar a https://sfpya.edomexico.gob.mx/recaudacion/, seleccionar Tipo: Control Escolar y Titulación, y Concepto: Certificado de Estudios parcial o total sin titulación.',
                duracion: '5-10 minutos'
            },
            {
                titulo: 'Realizar el pago',
                descripcion: 'Efectuar el pago correspondiente mediante línea de captura.',
                detalle: 'Generar la línea de captura, realizar el pago y conservar el ticket original como comprobante.',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Reunir fotografías',
                descripcion: 'Preparar las fotografías oficiales requeridas para el trámite.',
                detalle: 'Tres fotografías formales, tamaño credencial, blanco y negro, con las siguientes especificaciones: hombres con ropa clara, cabello corto, sin barba, bigote ni aretes; mujeres con ropa clara, cabello recogido, sin maquillaje ni aretes.',
                duracion: '1 día'
            },
            {
                titulo: 'Entrega de documentación',
                descripcion: 'Presentar la documentación completa en Control Escolar.',
                detalle: 'Acudir al Departamento de Control Escolar con el comprobante de pago y las tres fotografías en el Edificio F, planta baja.',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Recepción del certificado',
                descripcion: 'Esperar la validación y entrega del documento.',
                detalle: 'El certificado parcial se entrega en un lapso de cinco a siete días hábiles a partir de la entrega completa de requisitos.',
                duracion: '5-7 días hábiles'
            }
        ],
        documentos: [
            {
                nombre: 'Línea de captura pagada con ticket original',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe corresponder al concepto de Certificado de Estudios total o parcial sin titulación.'
            },
            {
                nombre: 'Tres fotografías formales óvalo tamaño credencial blanco y negro',
                tipo: 'Fotográfico',
                original: true,
                copias: 0,
                observaciones: 'Cumplir con las especificaciones indicadas por el Departamento de Control Escolar.'
            }
        ],
        costo: 'Verificar en https://sfpya.edomexico.gob.mx/recaudacion/, Tipo: Control Escolar y Titulación, Concepto: Certificado de estudios parcial o total sin titulación.',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, planta baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 / 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 12,
        titulo: 'Historial Académico',
        descripcion: 'Documento oficial que presenta de forma ordenada las calificaciones de las materias cursadas por el alumno hasta el momento de la solicitud. Incluye promedio general y datos escolares del estudiante.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Verificación de costos',
                descripcion: 'Consultar el costo correspondiente al trámite de historial académico.',
                detalle: 'Ingresar a https://sfpya.edomexico.gob.mx/recaudacion/, seleccionar Tipo: Control Escolar y Titulación, y Concepto: Historial académico.',
                duracion: '5-10 minutos'
            },
            {
                titulo: 'Realizar el pago',
                descripcion: 'Efectuar el pago del trámite mediante línea de captura.',
                detalle: 'Generar la línea de captura, realizar el pago en la institución bancaria indicada y conservar el ticket original.',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Entrega de comprobante',
                descripcion: 'Presentar la línea de captura pagada y el ticket original en Control Escolar.',
                detalle: 'Acudir al Departamento de Control Escolar del TESOEM, Edificio F, planta baja, para entregar los comprobantes y solicitar el historial académico.',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Recepción del historial académico',
                descripcion: 'Esperar la validación y entrega del documento.',
                detalle: 'El historial académico se entrega en un lapso de 1 a 3 días hábiles a partir del inicio del trámite.',
                duracion: '1-3 días hábiles'
            }
        ],
        documentos: [
            {
                nombre: 'Línea de captura pagada',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe corresponder al concepto de Historial académico.'
            },
            {
                nombre: 'Ticket de pago original',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe presentarse junto con la línea de captura en Control Escolar.'
            }
        ],
        costo: 'Verificar en https://sfpya.edomexico.gob.mx/recaudacion/, Tipo: Control Escolar y Titulación, Concepto: Historial académico.',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, planta baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 / 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 13,
        titulo: 'Constancia de Estudios',
        descripcion: 'Documento oficial que acredita la situación académica de un estudiante en un periodo determinado, confirmando si está inscrito o ha finalizado sus estudios en el TESOEM.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Verificación de costos',
                descripcion: 'Consultar el costo correspondiente al trámite de constancia de estudios.',
                detalle: 'Ingresar a https://sfpya.edomexico.gob.mx/recaudacion/, seleccionar Tipo: Control Escolar y Titulación, y Concepto: Constancia de Estudios, inscripción y créditos.',
                duracion: '5-10 minutos'
            },
            {
                titulo: 'Realizar el pago',
                descripcion: 'Efectuar el pago correspondiente mediante línea de captura.',
                detalle: 'Generar la línea de captura, realizar el pago en la institución bancaria indicada y conservar el ticket original.',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Entrega de comprobantes',
                descripcion: 'Presentar el comprobante de pago en Control Escolar.',
                detalle: 'Acudir al Departamento de Control Escolar del TESOEM, Edificio F, planta baja, con la línea de captura y el ticket original.',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Validación de requisitos',
                descripcion: 'Verificar la situación académica del alumno.',
                detalle: 'El solicitante debe estar inscrito al semestre vigente o haber concluido el 100% de su plan de estudios.',
                duracion: '1 día hábil'
            },
            {
                titulo: 'Recepción de la constancia',
                descripcion: 'Esperar la validación y entrega del documento.',
                detalle: 'La constancia de estudios se entrega en un lapso de 1 a 3 días hábiles a partir del inicio del trámite.',
                duracion: '1-3 días hábiles'
            }
        ],
        documentos: [
            {
                nombre: 'Línea de captura pagada',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe corresponder al concepto de Constancia de Estudios, inscripción y créditos.'
            },
            {
                nombre: 'Ticket de pago original',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe presentarse junto con la línea de captura.'
            }
        ],
        costo: 'Verificar en https://sfpya.edomexico.gob.mx/recaudacion/, Tipo: Control Escolar y Titulación, Concepto: Constancia de Estudios, inscripción y créditos.',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, planta baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 / 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    },
    {
        id: 14,
        titulo: 'Credencialización',
        descripcion: 'Trámite para la expedición o reposición de la credencial oficial que acredita la identidad de los integrantes de la comunidad del TESOEM: estudiantes, personal administrativo, docente y de estructura.',
        icono: <School />,
        pasos: [
            {
                titulo: 'Verificación de costos',
                descripcion: 'Confirmar si el trámite aplica costo o es gratuito según el caso.',
                detalle: 'Para nuevo ingreso, la primera expedición no tiene costo. En caso de extravío, ingresar a https://sfpya.edomexico.gob.mx/recaudacion/, seleccionar Tipo: Control Escolar y Titulación, y Concepto: Reposición de credencial para verificar el monto.',
                duracion: '5-10 minutos'
            },
            {
                titulo: 'Realizar el pago (si aplica)',
                descripcion: 'Efectuar el pago por concepto de reposición de credencial.',
                detalle: 'Generar la línea de captura, realizar el pago y conservar el ticket original. Este paso solo aplica si la credencial fue extraviada.',
                duracion: '30-60 minutos'
            },
            {
                titulo: 'Verificación de requisitos',
                descripcion: 'Asegurar que el solicitante cumple con los requisitos establecidos.',
                detalle: 'Debe ser estudiante inscrito o trabajador activo del TESOEM para poder solicitar la expedición o reposición.',
                duracion: '10 minutos'
            },
            {
                titulo: 'Entrega de comprobantes y toma de datos',
                descripcion: 'Acudir al Departamento de Control Escolar para entregar comprobantes y validar información.',
                detalle: 'Presentar la línea de captura pagada (en caso de reposición) y el ticket original en Control Escolar, Edificio F, planta baja.',
                duracion: '1-2 horas'
            },
            {
                titulo: 'Recepción de la credencial',
                descripcion: 'Esperar la validación y entrega del documento.',
                detalle: 'La credencial se entrega en un lapso de 1 a 3 días hábiles a partir del inicio del trámite.',
                duracion: '1-3 días hábiles'
            }
        ],
        documentos: [
            {
                nombre: 'Línea de captura pagada (solo reposición)',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe corresponder al concepto de Reposición de Credencial.'
            },
            {
                nombre: 'Ticket de pago original (solo reposición)',
                tipo: 'Comprobante financiero',
                original: true,
                copias: 0,
                observaciones: 'Debe presentarse junto con la línea de captura pagada.'
            }
        ],
        costo: 'Primera expedición sin costo. En caso de reposición, verificar en https://sfpya.edomexico.gob.mx/recaudacion/, Tipo: Control Escolar y Titulación, Concepto: Reposición de credencial.',
        departamento: 'Control Escolar',
        ubicacion: 'Edificio F, planta baja',
        contacto: 'Lic. Ivonne Adriana Carlillo Flores. Jefa del Departamento de Control Escolar',
        telefono: '5559863497 / 5559863498',
        email: 'control.escolar@tesoem.edu.mx',
        horario: 'Lunes a Viernes: 9:00 a 15:00 hrs y 16:00 a 18:00 hrs'
    }
];;

// Categorías para filtrar
const categorias = [
    { id: 'todos', label: 'Todos', icon: <ListIcon />, color: 'primary' },
    { id: 'admision', label: 'Admisión', icon: <School />, color: 'primary' },
    { id: 'academico', label: 'Académico', icon: <Assignment />, color: 'primary' },
    { id: 'financiero', label: 'Financiero', icon: <Payment />, color: 'primary' },
    { id: 'titulacion', label: 'Titulación', icon: <ExitToApp />, color: 'primary' }
];

function CategoryFilter({ categoriaActiva, onCategoriaChange }) {
    const theme = useTheme();

    return (
        <Box sx={{
            mb: 4,
            p: 2,
            background: '#f8f9fa',
            borderRadius: 2,
            border: `1px solid ${alpha('#dee2e6', 0.5)}`
        }}>
            <Tabs
                value={categoriaActiva}
                onChange={(e, newValue) => onCategoriaChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    '& .MuiTab-root': {
                        minHeight: 48,
                        borderRadius: 2,
                        margin: '0 4px',
                        transition: 'all 0.3s ease',
                        fontWeight: 600,
                        '&.Mui-selected': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                    }
                }}
            >
                {categorias.map((categoria) => (
                    <Tab
                        key={categoria.id}
                        value={categoria.id}
                        label={categoria.label}
                        icon={categoria.icon}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
        </Box>
    );
}

function ModernTramiteCard({ tramite, onVerDetalles }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: 'none',
                background: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }
            }}
        >
            <Box
                sx={{
                    p: 3,
                    pb: 2,
                    position: 'relative',
                    background: 'transparent'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 52,
                            height: 52,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        {React.cloneElement(tramite.icono, {
                            sx: { fontSize: 26 }
                        })}
                    </Box>
                </Box>

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                        fontSize: '1.1rem'
                    }}
                >
                    {tramite.titulo}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {tramite.descripcion}
                </Typography>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3, pt: 0 }}>
                <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" mb={1.5}>
                        <LocationOn sx={{ fontSize: 18, color: 'primary.main', mr: 1.5 }} />
                        <Box>
                            <Typography variant="body2" fontWeight="600">
                                {tramite.ubicacion}
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <AccessTime sx={{ fontSize: 18, color: 'primary.main', mr: 1.5 }} />
                        <Box>
                            <Typography variant="body2" fontWeight="600">
                                {tramite.horario.split('y')[0]}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap">
                    <Box
                        sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        }}
                    >
                        <Typography variant="caption" fontWeight="600" color="primary.main">
                            {tramite.departamento}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: alpha('#4caf50', 0.1),
                            border: `1px solid ${alpha('#4caf50', 0.2)}`
                        }}
                    >
                        <Typography variant="caption" fontWeight="600" color="#4caf50">
                            Presencial
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => onVerDetalles(tramite)}
                    sx={{
                        borderRadius: 2,
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }
                    }}
                >
                    Ver Detalles
                </Button>
            </CardActions>
        </Card>
    );
}

function ModernSearchBar() {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 4 }}>
            <Paper
                sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                    background: '#ffffff',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:focus-within': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                }}
            >
                <Search sx={{ mx: 2, color: 'text.secondary', fontSize: 24 }} />
                <input
                    placeholder="Buscar trámites por nombre, departamento..."
                    style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        padding: '12px 8px',
                        background: 'transparent',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        fontWeight: 600,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': {
                            border: `2px solid ${theme.palette.primary.main}`,
                            background: alpha(theme.palette.primary.main, 0.04)
                        }
                    }}
                >
                    Filtros
                </Button>
            </Paper>
        </Box>
    );
}

// Componente para mostrar los pasos del proceso - Sin importancia
function ModernProcessStep({ step, index, totalSteps }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                mb: 3,
                p: 3,
                borderRadius: 2,
                background: '#ffffff',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mr: 3
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        mb: 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    {index + 1}
                </Box>
                <Chip
                    label={step.duracion}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem'
                    }}
                />
            </Box>

            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="700" color="primary.main" gutterBottom>
                    {step.titulo}
                </Typography>

                <Typography variant="body1" fontWeight="600" gutterBottom>
                    {step.descripcion}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.detalle}
                </Typography>
            </Box>
        </Box>
    );
}

// Componente para mostrar documentos
function ModernDocumentItem({ document, index }) {
    const theme = useTheme();

    return (
        <Paper
            sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 2,
                background: '#ffffff',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                <Box display="flex" alignItems="flex-start" sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            mr: 2.5,
                            flexShrink: 0
                        }}
                    >
                        <Description sx={{ fontSize: 22 }} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {document.nombre}
                        </Typography>

                        <Box display="flex" gap={2} flexWrap="wrap" mb={1.5}>
                            <Chip
                                label={document.tipo}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />

                            {document.original && (
                                <Chip
                                    label="ORIGINAL"
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                                        color: theme.palette.success.main,
                                        fontWeight: 'bold'
                                    }}
                                />
                            )}

                            {document.copias > 0 && (
                                <Chip
                                    label={`${document.copias} COPIA(S)`}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.main,
                                        fontWeight: 'bold'
                                    }}
                                />
                            )}

                            {document.cantidad && (
                                <Chip
                                    label={`${document.cantidad} PIEZAS`}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                        color: theme.palette.warning.main,
                                        fontWeight: 'bold'
                                    }}
                                />
                            )}
                        </Box>

                        {document.observaciones && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontStyle: 'italic',
                                    lineHeight: 1.5
                                }}
                            >
                                📝 {document.observaciones}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box display="flex" gap={1} sx={{ ml: 2, flexShrink: 0 }}>
                    <IconButton
                        size="small"
                        sx={{
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 1
                        }}
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 1
                        }}
                    >
                        <Download fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
}

function ModernDetallesTramite({ tramite, onCerrar }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" alignItems="flex-start" sx={{ flex: 1, mr: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 70,
                                height: 70,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                color: 'white',
                                mr: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        >
                            {React.cloneElement(tramite.icono, { sx: { fontSize: 35 } })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                fontWeight="700"
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                {tramite.titulo}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ lineHeight: 1.6, maxWidth: 600 }}
                            >
                                {tramite.descripcion}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={onCerrar}
                        sx={{
                            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            background: 'white',
                            '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.1),
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </Paper>

            <Grid container spacing={4}>
                {/* Columna izquierda - Proceso del Trámite */}
                <Grid item xs={12} lg={6}>
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            background: '#ffffff',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            height: 'fit-content'
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            fontWeight="700"
                            sx={{
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    color: 'white',
                                    mr: 2
                                }}
                            >
                                <PlayArrow sx={{ fontSize: 28 }} />
                            </Box>
                            Proceso del Trámite
                        </Typography>

                        <Box sx={{ position: 'relative' }}>
                            {/* Línea vertical conectadora */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 25,
                                    top: 0,
                                    bottom: 0,
                                    width: 2,
                                    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                                    zIndex: 1
                                }}
                            />

                            {tramite.pasos.map((paso, index) => (
                                <ModernProcessStep
                                    key={index}
                                    step={paso}
                                    index={index}
                                    totalSteps={tramite.pasos.length}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Columna derecha - Documentación */}
                <Grid item xs={12} lg={6}>
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            mb: 4,
                            background: '#ffffff',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            fontWeight="700"
                            sx={{
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    color: 'white',
                                    mr: 2
                                }}
                            >
                                <Description sx={{ fontSize: 28 }} />
                            </Box>
                            Documentación Requerida
                        </Typography>

                        <Box sx={{ maxHeight: 600, overflow: 'auto', pr: 1 }}>
                            {tramite.documentos.map((documento, index) => (
                                <ModernDocumentItem
                                    key={index}
                                    document={documento}
                                    index={index}
                                />
                            ))}
                        </Box>

                        {/* Resumen de documentación */}
                        <Box
                            sx={{
                                mt: 3,
                                p: 3,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }}
                        >
                            <Typography variant="h6" fontWeight="600" gutterBottom color="primary.main">
                                📋 Resumen de Documentación
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="600">
                                        Total de documentos:
                                    </Typography>
                                    <Typography variant="body1" color="primary.main" fontWeight="700">
                                        {tramite.documentos.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="600">
                                        Documentos originales:
                                    </Typography>
                                    <Typography variant="body1" color="primary.main" fontWeight="700">
                                        {tramite.documentos.filter(doc => doc.original).length}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Información de Contacto */}
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            background: '#ffffff',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            fontWeight="700"
                            sx={{
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    color: 'white',
                                    mr: 2
                                }}
                            >
                                <LocationOn sx={{ fontSize: 28 }} />
                            </Box>
                            Información de Contacto
                        </Typography>

                        <Grid container spacing={3}>
                            {[
                                { icon: <LocationOn />, label: 'Ubicación', value: tramite.ubicacion, color: 'primary' },
                                { icon: <Phone />, label: 'Teléfono', value: tramite.telefono, color: 'primary' },
                                { icon: <Email />, label: 'Email', value: tramite.email, color: 'primary' },
                                { icon: <AccessTime />, label: 'Horario', value: tramite.horario, color: 'primary' }
                            ].map((item, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: alpha(theme.palette[item.color].main, 0.05),
                                            border: `1px solid ${alpha(theme.palette[item.color].main, 0.1)}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: alpha(theme.palette[item.color].main, 0.3),
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${theme.palette[item.color].main} 0%, ${theme.palette[item.color].dark} 100%)`,
                                                    color: 'white',
                                                    mr: 1.5
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <Typography variant="body2" fontWeight="600" color="text.primary">
                                                {item.label}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {tramite.contacto && (
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 3,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    color: 'white'
                                }}
                            >
                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    👤 Persona Responsable
                                </Typography>
                                <Typography variant="body1">
                                    {tramite.contacto}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Box
                sx={{
                    mt: 4,
                    p: 4,
                    borderRadius: 2,
                    background: '#ffffff',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={onCerrar}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                            border: `2px solid ${theme.palette.primary.main}`,
                            background: alpha(theme.palette.primary.main, 0.04)
                        }
                    }}
                >
                    Volver a la Lista
                </Button>
                <Button
                    variant="contained"
                    startIcon={<LocationOn />}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    Ir al Departamento
                </Button>
            </Box>
        </Box>
    );
}

// Footer moderno gris claro
function ModernFooter() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                p: 4,
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                borderRadius: 0
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight="700"
                            sx={{
                                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            TESOEM
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tecnológico de Estudios Superiores del Oriente del Estado de México
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Contacto
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            📞 5559863497 - 5559863498
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            📧 control.escolar@tesoem.edu.mx
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            🕒 Lunes a Viernes: 9:00 a 15:00 hrs
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Ubicación
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Edificio F, Planta Baja
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Departamento de Control Escolar
                        </Typography>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: 4,
                        pt: 3,
                        borderTop: '1px solid #dee2e6',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} TESOEM - Todos los derechos reservados
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

const ModernTramites = () => {
    const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
    const [categoriaActiva, setCategoriaActiva] = useState('todos');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleVerDetalles = (tramite) => {
        setTramiteSeleccionado(tramite);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCerrarDetalles = () => {
        setTramiteSeleccionado(null);
    };

    const tramitesFiltrados = categoriaActiva === 'todos'
        ? tramitesData
        : tramitesData;

    return (
        <ThemeProvider theme={greenTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
                    {tramiteSeleccionado ? (
                        <ModernDetallesTramite
                            tramite={tramiteSeleccionado}
                            onCerrar={handleCerrarDetalles}
                        />
                    ) : (
                        <>
                            {/* Header con gradiente verde en el título */}
                            <Box textAlign="center" mb={6}>
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: isMobile ? '2.5rem' : '3.5rem',
                                        background: `linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #1b5e20 100%)`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2
                                    }}
                                >
                                    Trámites TESOEM
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: 600,
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                        fontWeight: 400
                                    }}
                                >
                                    Gestiona todos tus trámites académicos de manera presencial con información completa y actualizada.
                                </Typography>
                            </Box>

                            <CategoryFilter
                                categoriaActiva={categoriaActiva}
                                onCategoriaChange={setCategoriaActiva}
                            />

                            <ModernSearchBar />

                            {/* Grid de trámites más cuadrados */}
                            <Grid container spacing={3}>
                                {tramitesFiltrados.map((tramite) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={tramite.id}>
                                        <ModernTramiteCard
                                            tramite={tramite}
                                            onVerDetalles={handleVerDetalles}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </Container>

                {/* Footer moderno gris claro */}
                <ModernFooter />
            </Box>
        </ThemeProvider>
    );
};

export default ModernTramites;