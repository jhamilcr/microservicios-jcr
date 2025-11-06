require "sequel"

def connect_with_retry(max_tries: 30, wait: 2)
  tries = 0
  begin
    db = Sequel.connect(
      adapter: "mysql2",
      host: ENV.fetch("MYSQL_HOST"),
      port: ENV.fetch("MYSQL_PORT"),
      database: ENV.fetch("MYSQL_DATABASE"),
      user: ENV.fetch("MYSQL_USER"),
      password: ENV.fetch("MYSQL_PASSWORD"),
      # timeouts del cliente
      read_timeout: 10,
      write_timeout: 10,
      timeout: 10,
      # ✅ Hook por conexión (para cada checkout del pool)
      after_connect: proc { |conn|
        # Amplía los límites por sesión
        conn.query("SET SESSION wait_timeout=28800, SESSION interactive_timeout=28800")
      }
    )
    db.test_connection
    db
  rescue => e
    tries += 1
    raise e if tries >= max_tries
    sleep wait
    retry
  end
end

DB = connect_with_retry

# ✅ Validador de conexiones: reabre si MySQL cerró por inactividad
Sequel.extension :connection_validator
DB.extension :connection_validator
DB.pool.connection_validation_timeout = 30   # valida cada 30s
# Si quieres validar SIEMPRE cada checkout:
# DB.pool.connection_validation_timeout = -1

# (Opcional) Log en dev
DB.loggers << Logger.new($stdout) if ENV["RACK_ENV"] == "development"
