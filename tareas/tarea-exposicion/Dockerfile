FROM ruby:3.2

RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*
ENV PATH="/usr/local/bundle/bin:${PATH}"

WORKDIR /app

# Herramientas Ruby
RUN gem install bundler -N && gem install rails -v "~>7.1" -N

# Entrypoint
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
