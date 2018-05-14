# Contentstack Data Builder
  
  Generates stack, content type, entry, asset, etc. related to contentstack.

## Description

  - Generates various entities of contentstack based on the config.
  - Adds all the uids of the created entities in `.details.yml` file.
  - In case of `NODE_ENV` set to `localdev` environment, the data will be created locally in `logs` directory.
  - Sample configuration file given in [docs/sample_config.md](docs/sample_config.md).
  - Asset files used for the file fields and assets, present in the `assets` directory.
  - For clearing all the entities created in the previous process run, use `npm destroy` command. 

## Commands
  
  - Before starting the application, set the necessary NODE_ENV environment
  - Starting the application for entity creation
    ```
      npm start
    ```
  - Starting the application for destroying the entities created in the previous process listed in `.details.yml` file.
    ```
      npm run destroy
    ```