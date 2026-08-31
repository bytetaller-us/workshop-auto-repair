# Guía de Despliegue en DigitalOcean - ERP Taller Automotriz NJ

Esta guía detalla los pasos para alojar la aplicación en **DigitalOcean** utilizando un **Droplet con Docker** o **DigitalOcean App Platform**.

---

## Opción 1: Despliegue en Droplet de DigitalOcean (Recomendado / Más Económico - $6/mes)

### 1. Crear el Droplet
1. Inicia sesión en [DigitalOcean Cloud](https://cloud.digitalocean.com/).
2. Haz clic en **Create** > **Droplets**.
3. Selecciona:
   - **Distribution:** Ubuntu 22.04 LTS x64 o la imagen del Marketplace **Docker on Ubuntu**.
   - **Plan:** Basic (`$6/mes` o `$12/mes` para mayor rendimiento).
   - **Datacenter Region:** NYC1 / NYC3 (New York / New Jersey Hub para mínima latencia).
   - **Authentication:** SSH Key (recomendado) o Password.
4. Haz clic en **Create Droplet**.

### 2. Conectarse al Servidor por SSH
```bash
ssh root@<TU_IP_DE_DIGITALOCEAN>
```

### 3. Instalar Docker y Docker Compose (si usaste Ubuntu estándar)
```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose git
systemctl enable --now docker
```

### 4. Clonar o Subir el Código al Droplet
```bash
mkdir -p /var/www/auto-repair-erp
cd /var/www/auto-repair-erp
# Copiar los archivos o clonar desde tu repositorio GitHub privado
git clone <URL_DE_TU_REPOSITORIO> .
```

### 5. Iniciar la Aplicación con Docker Compose
```bash
docker-compose up -d --build
```

La aplicación estará corriendo inmediatamente en el puerto `3000` de tu servidor.

---

### 6. Configurar Dominio y SSL Gratuito (Nginx + Let's Encrypt Certbot)

Para que tu taller tenga acceso seguro por HTTPS (ej. `taller.tunegocio.com`):

1. **Instalar Nginx y Certbot:**
```bash
apt install -y nginx certbot python3-certbot-nginx
```

2. **Crear archivo de configuración en Nginx:**
```bash
nano /etc/nginx/sites-available/autorepair
```

Pega la siguiente configuración:
```nginx
server {
    server_name taller.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Habilitar sitio y generar certificado SSL:**
```bash
ln -s /etc/nginx/sites-available/autorepair /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Obtener certificado SSL gratis Let's Encrypt
certbot --nginx -d taller.tudominio.com
```

---

## Opción 2: Despliegue en DigitalOcean App Platform (Serverless PaaS)

1. Conecta tu cuenta de GitHub en DigitalOcean.
2. Selecciona el repositorio `auto-repair-erp`.
3. DigitalOcean detectará automáticamente **Next.js**.
4. Agrega las variables de entorno:
   - `DATABASE_URL=file:./prod.db` (o conecta una Base de Datos Administrada PostgreSQL de DigitalOcean).
   - `NEXT_PUBLIC_NJ_TAX_RATE=0.06625`
5. Haz clic en **Deploy**.

---

## Copias de Seguridad de la Base de Datos (Backup Diario)
Puedes programar un cron job en el Droplet para respaldar la base de datos a diario:
```bash
crontab -e
# Agregar respaldo diario a las 2:00 AM:
0 2 * * * cp /var/lib/docker/volumes/auto-repair-erp_erp-data/_data/prod.db /root/backups/backup-$(date +%F).db
```
