# Deployment

## Инфраструктура

| Сервис | Назначение | Детали |
|--------|-----------|--------|
| Timeweb Cloud VPS | Хостинг приложения | Ubuntu 24.04, 2 CPU / 2 GB RAM |
| reg.ru | Домен | veretennikov.info |
| GitHub | Репозиторий + CI/CD | zaratustrik/veretennikov-studio |
| Timeweb PostgreSQL | База данных | Планируется |
| Timeweb S3 | Файловое хранилище | Планируется |

**IP сервера:** `5.42.120.165`

---

## Стек на сервере

```
veretennikov.info
       ↓
  Nginx (SSL, reverse proxy, порт 80/443)
       ↓
  Next.js via PM2 (порт 3000)
       ↓              ↓
  PostgreSQL      S3 Storage
```

---

## Первоначальная настройка сервера

Выполнялась вручную (cloud-init скрипт не был применён при создании).

```bash
# Swap 1 GB (нужен при сборке Next.js на 2 GB RAM)
fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Системные пакеты
apt-get update -y && apt-get upgrade -y
apt-get install -y git curl nginx certbot python3-certbot-nginx

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# PM2
npm install -g pm2

# Репозиторий
git clone https://github.com/zaratustrik/veretennikov-studio.git /var/www/studio
cd /var/www/studio && npm ci && npm run build

# Запуск
pm2 start npm --name "studio" -- start
pm2 save
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
systemctl enable pm2-root
```

---

## Nginx

Конфиг: `/etc/nginx/sites-available/studio`

```nginx
server {
    listen 80;
    server_name veretennikov.info www.veretennikov.info;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активация:
```bash
ln -sf /etc/nginx/sites-available/studio /etc/nginx/sites-enabled/studio
nginx -t && systemctl reload nginx
```

---

## DNS (reg.ru)

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `@` | `5.42.120.165` |
| A | `www` | `5.42.120.165` |

---

## SSL — TODO

Выполнить после того как DNS обновится (`ping veretennikov.info` → `5.42.120.165`):

```bash
certbot --nginx -d veretennikov.info -d www.veretennikov.info
```

Certbot настроит автообновление сертификата.

---

## Автодеплой (GitHub Actions)

Файл: `.github/workflows/deploy.yml`

**Как работает:** при каждом `git push origin main` GitHub Actions заходит на сервер по SSH и пересобирает приложение.

### Настройка

1. Сгенерировать ключ на сервере:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/deploy_key   # скопировать
```

2. Добавить секреты в GitHub → Settings → Secrets → Actions:

| Secret | Значение |
|--------|----------|
| `DEPLOY_HOST` | `5.42.120.165` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_KEY` | приватный ключ из шага 1 |

### Статус: TODO (ключ создан, секреты ещё не добавлены)

---

## Полезные команды

```bash
# Статус приложения
pm2 status

# Логи
pm2 logs studio

# Перезапуск после ручных изменений
cd /var/www/studio && git pull && npm ci && npm run build && pm2 restart studio

# Логи Nginx
tail -f /var/log/nginx/error.log

# Проверка что сайт отвечает
curl -s -o /dev/null -w "%{http_code}" localhost:3000
```
