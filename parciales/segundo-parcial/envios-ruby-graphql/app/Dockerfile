FROM ruby:3.3-alpine

RUN apk add build-base mysql-client mysql-dev tzdata

WORKDIR /usr/src/app

COPY Gemfile ./
RUN bundle install

COPY src ./src
COPY config.ru ./config.ru
COPY puma.rb ./puma.rb

EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "puma.rb"]