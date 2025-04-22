import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

export const swaggerSetup = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument),
  spec: (req: any, res: any) => res.json(swaggerDocument)
};