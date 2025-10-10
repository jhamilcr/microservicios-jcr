require "sinatra"
require "sinatra/json"
require "sinatra/cross_origin"
require "json"
require "jwt"
require_relative "./config/database"

enable :cross_origin
set :bind, "0.0.0.0"
set :port, 4567

helpers do
  def authorize_admin!
    auth_header = request.env["HTTP_AUTHORIZATION"]
    halt 401, json(error: "Token requerido") unless auth_header&.start_with?("Bearer ")
    token = auth_header.split(" ").last
    begin
      payload, = JWT.decode(token, "grupo-7-este-es-un-secreto-muy-largo-y-seguro-1234567890", true, algorithm: "HS256")
      halt 403, json(error: "No autorizado") unless payload["role"] == "admin"
    rescue JWT::DecodeError
      halt 401, json(error: "Token inválido")
    end
  end
end

EVENTOS = DB_CLIENT[:eventos]

get "/events" do
  content_type :json
  eventos = EVENTOS.find.map { |e| e }.to_a
  json eventos
end

get "/events/:id" do
  content_type :json
  require "bson"
  evento = EVENTOS.find(_id: BSON::ObjectId(params[:id])).first
  halt 404, json(error: "Evento no encontrado") unless evento
  json evento
end

post "/events" do
  authorize_admin!
  content_type :json
  data = JSON.parse(request.body.read)
  nuevo = {
    nombre: data["nombre"],
    fecha: data["fecha"],
    lugar: data["lugar"],
    capacidad: data["capacidad"],
    precio: data["precio"]
  }
  result = EVENTOS.insert_one(nuevo)
  status 201
  json({ id: result.inserted_id, **nuevo })
end

put "/events/:id" do
  authorize_admin!
  content_type :json
  data = JSON.parse(request.body.read)
  result = EVENTOS.update_one(
    { _id: BSON::ObjectId(params[:id]) },
    { "$set" => data }
  )
  halt 404, json(error: "Evento no encontrado") if result.modified_count == 0
  json({ mensaje: "Evento actualizado" })
end

delete "/events/:id" do
  authorize_admin!
  content_type :json
  result = EVENTOS.delete_one(_id: BSON::ObjectId(params[:id]))
  halt 404, json(error: "Evento no encontrado") if result.deleted_count == 0
  json({ mensaje: "Evento eliminado" })
end
