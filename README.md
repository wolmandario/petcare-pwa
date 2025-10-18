# 🐾 PetCare Marketplace - PWA Completa

Una aplicación web progresiva (PWA) completa para conectar dueños de mascotas con cuidadores profesionales en Uruguay.

## ✨ Nuevas Características

### 🔐 Sistema de Autenticación Completo
- **Login/Registro** con validación de formularios
- **Roles de usuario**: Dueño de mascota y Cuidador profesional
- **Perfiles personalizados** según el tipo de usuario
- **Gestión de sesiones** persistente

### 💬 Chat Dinámico en Tiempo Real
- **Conversaciones múltiples** con diferentes cuidadores
- **Mensajes en tiempo real** con simulación de respuestas
- **Historial de conversaciones** organizado
- **Notificaciones** de mensajes no leídos

### 📊 Datos de Prueba Realistas
- **6 servicios diferentes**: Veterinarias, hospedaje, guardería, peluquería, paseos, entrenamiento
- **Usuarios de prueba** con perfiles completos
- **Reservas activas** con diferentes estados
- **Conversaciones de chat** con historial real

### 📱 Funcionalidades PWA Avanzadas
- **Instalación nativa** en dispositivos móviles
- **Funcionamiento offline** con Service Worker
- **Notificaciones push** (preparado)
- **Interfaz responsive** optimizada para móviles

## 🚀 Deployment en GitHub Pages

### Archivos Listos para Subir

Todos los archivos están en la carpeta `pwa-files/` y están configurados para GitHub Pages:

```
pwa-files/
├── index.html          # Aplicación principal completa
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
└── README.md          # Esta documentación
```

### Pasos para Deployment

1. **Copia los archivos** de `pwa-files/` a tu repositorio de GitHub
2. **Asegúrate** de que el repositorio se llame `petcare-pwa`
3. **Activa GitHub Pages** en la configuración del repositorio
4. **Accede** a `https://tu-usuario.github.io/petcare-pwa/`

### URLs de Prueba

- **Producción**: `https://tu-usuario.github.io/petcare-pwa/`
- **Manifest**: `https://tu-usuario.github.io/petcare-pwa/manifest.json`
- **Service Worker**: `https://tu-usuario.github.io/petcare-pwa/sw.js`

## 👥 Usuarios de Prueba

### Dueño de Mascota
- **Email**: `maria@petcare.com`
- **Contraseña**: `cualquiera`
- **Mascotas**: Max (Golden Retriever), Luna (Siamés)

### Cuidadores
- **Email**: `carlos@petcare.com` (Veterinario)
- **Email**: `ana@petcare.com` (Hospedaje)
- **Contraseña**: `cualquiera`

## 🎯 Funcionalidades Principales

### Para Dueños de Mascotas
- ✅ Buscar servicios por categoría y ubicación
- ✅ Filtrar por precio, calificación y características
- ✅ Reservar servicios para sus mascotas
- ✅ Chat directo con cuidadores
- ✅ Gestionar reservas activas
- ✅ Ver historial de servicios

### Para Cuidadores
- ✅ Perfil profesional completo
- ✅ Gestión de servicios ofrecidos
- ✅ Chat con clientes
- ✅ Calificaciones y reseñas
- ✅ Panel de reservas recibidas

### Características Técnicas
- ✅ **Responsive Design**: Optimizado para móviles y desktop
- ✅ **PWA Completa**: Instalable como app nativa
- ✅ **Offline Support**: Funciona sin conexión
- ✅ **Fast Loading**: Caché inteligente con Service Worker
- ✅ **Modern UI**: Interfaz moderna con animaciones suaves

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PWA**: Service Worker, Web App Manifest
- **UI/UX**: CSS Grid, Flexbox, Animaciones CSS
- **Maps**: Leaflet.js para mapas interactivos
- **Icons**: Emojis nativos para mejor compatibilidad
- **Storage**: LocalStorage para persistencia de datos

## 📱 Instalación como App

1. **Abre** la aplicación en tu navegador móvil
2. **Busca** el botón "📱 Instalar App" en el header
3. **Confirma** la instalación cuando aparezca el prompt
4. **Usa** la app desde tu pantalla de inicio

## 🔧 Configuración Avanzada

### Personalizar para tu Dominio

Si quieres usar un dominio personalizado, actualiza estas rutas en:

**manifest.json**:
```json
{
  "start_url": "/tu-ruta/",
  "scope": "/tu-ruta/"
}
```

**sw.js**:
```javascript
const urlsToCache = [
  '/tu-ruta/',
  '/tu-ruta/index.html',
  // ...
];
```

### Habilitar Notificaciones Push

La app está preparada para notificaciones push. Solo necesitas:

1. Configurar un servidor de push notifications
2. Actualizar las claves VAPID en el Service Worker
3. Implementar la lógica de suscripción

## 🎨 Personalización

### Colores del Tema
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

### Agregar Nuevos Servicios
```javascript
const newService = {
  id: 7,
  title: 'Nuevo Servicio',
  category: 'nueva-categoria',
  icon: '🆕',
  price: 500,
  // ... más propiedades
};
```

## 📈 Próximas Mejoras

- [ ] Integración con APIs reales
- [ ] Sistema de pagos con Stripe/PayPal
- [ ] Geolocalización real con GPS
- [ ] Notificaciones push en tiempo real
- [ ] Sistema de calificaciones interactivo
- [ ] Upload de fotos de mascotas
- [ ] Calendario de disponibilidad
- [ ] Sistema de favoritos

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Tu aplicación PetCare está lista para producción! 🚀**

Simplemente sube los archivos a GitHub y tendrás una PWA completa funcionando en minutos.