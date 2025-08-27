# PARA CREAR EL CONTENEDOR:
```bash
docker run -d \                            
  --name tarea3-microservicios \
  --add-host=host.docker.internal:host-gateway \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://root:secret@host.docker.internal:27017/?authSource=admin" \
  -e PORT=3000 \
  tarea3-microservicios:latest
```