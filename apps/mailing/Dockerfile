FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./ 
COPY pnpm-lock.yaml ./

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm  install

COPY apps/mailing/package.json /usr/src/app/apps/mailing/
RUN pnpm install --prefix /usr/src/app/apps/mailing

COPY apps/mailing apps/mailing
COPY libs libs
RUN pnpm run build mailing

FROM node:alpine AS production


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app

COPY package*.json ./ 
COPY pnpm-lock.yaml ./ 

RUN npm install -g pnpm

RUN pnpm install --prod 

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/mailing/main"]
