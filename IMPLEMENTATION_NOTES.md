<!--
Describe implementation below.

Feel free to add any relevant info on what packages you may have added, the directory structure you chose, the tests you added etc. Is there anything you would have done differently with more time and or resources?
-->
## DTOs 
Controller endpoints have request, and response DTOs

## CustomRepository Decorator
The Repository decorator coming from typeOrm is deprecated, and the new approach is to create a custom decorator. 
This also required a custom module, which was imported into the appModule. 

## TypeOrmEXModule
Register CustomRepositories while integrating seamlessly with TypeORM.  

## Migrations & SEED Data. 
Setup ormconfig.js file that defines the database connection for migrations.

## Custom Data Sources
We have custom data sources for the application, and for testing, respectively.

## Tests
We have E2E & Unit tests for the games.controller.ts, and unit tests for the games.service.ts
