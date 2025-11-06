# Segundo Parcial
## Nombre: Jhamil Crespo Rejas

* Servicio de autenticacion completo
* Servicio de vehiculos protegido
* Servicio de envios con Graphql y Ruby esta a medias porque esta funcionando pero no alcance a hacer la comunicacion con gRPC con el servicio de vehiculos.
* No alcance a hacer el proxy inverso con Nginx

No estoy subiendo la carpeta de `node_modules` de los primeros dos servicios porque es muy pesada y para que los contenedores de esos servicios funcionen, en el Dockerfile de cada uno hay que descomentar el comando de instalacion de dependencias `RUN npm install`.

