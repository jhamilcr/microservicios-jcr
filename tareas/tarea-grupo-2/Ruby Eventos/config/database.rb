require "mongo"

Mongo::Logger.logger.level = ::Logger::WARN

DB_CLIENT = Mongo::Client.new(["#{ENV.fetch("DB_HOST", "localhost")}:27017"], database: ENV.fetch("DB_NAME", "eventos_db"))

puts "Conectado a MongoDB correctamente"