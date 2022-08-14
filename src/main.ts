import { NestFactory, repl } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { isProduction, logoShow } from './common/utils';
import config from './config';

async function bootstrap() {
  // CORS is enabled
  const app = await NestFactory.create(AppModule, { cors: true });
  await repl(AppModule);

  const logger = app.get(Logger);
  app.useLogger(logger);
  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(requestIp.mw());

  // Helmet Middleware against known security vulnerabilities
  app.use(helmet());

  // // Swagger API Documentation
  const options = new DocumentBuilder()
    .setTitle('NestJS Hackathon Starter by @ahmetuysal')
    .setDescription('NestJS Hackathon Starter API description')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  if (!isProduction()) {
    {
      // const options = {
      //   ...config.swagger,
      // } as unknown as OpenAPIObject;
      // const document = SwaggerModule.createDocument(app, options);
      const options = new DocumentBuilder()
        .setTitle(config.swagger.info.title)
        .setDescription(config.swagger.info.description)
        .setVersion(config.swagger.info.version)
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup(process.env.APP_DOC_PATH || 'docs', app, document);
    }
  }

  await app.listen(~~(process.env.APP_PORT || 3000), '0.0.0.0');
  const url = await app.getUrl();
  logger.log(`Now env of app : ${process.env.NODE_ENV}`);
  logger.log(`Application is running on: ${url}`);

  if (!isProduction()) {
    logger.log(
      `Please visit swagger document at ${url}/${process.env.APP_DOC_PATH}`,
    );
    logger.log(
      `Download swagger-json at ${url}/${process.env.APP_DOC_PATH}-json`,
    );
  }
}

bootstrap().then(() => {
  logoShow();
});
