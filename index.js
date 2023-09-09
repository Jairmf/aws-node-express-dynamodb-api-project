const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");


const app = express();

const PEOPLE_TABLE = process.env.PEOPLE_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const { v4 } = require("uuid");

app.use(express.json());

app.get("/users/:peopleId", async function (req, res) {
  const params = {
    TableName: PEOPLE_TABLE,
    Key: {
      peopleId: req.params.peopleId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { peopleId,
        anio_nacimiento,
        color_ojos,
        peliculas,
        genero,
        color_cabello,
        talla,
        planeta_origen,
        peso,
        nombre,
        creado,
        editado,
        color_piel,
        especies,
        naves,
        url,
        vehiculos } = Item;
      res.json({ peopleId,
        anio_nacimiento,
        color_ojos,
        peliculas,
        genero,
        color_cabello,
        talla,
        planeta_origen,
        peso,
        nombre,
        creado,
        editado,
        color_piel,
        especies,
        naves,
        url,
        vehiculos });
    } else {
      res
        .status(404)
        .json({ error: 'No se puede encontrar persona con el valor proporcionado de "peopleId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "No se pudo obtener persona" });
  }
});

app.post("/users", async function (req, res) {
  const { 
    anio_nacimiento,
    color_ojos,
    peliculas,
    genero,
    color_cabello,
    talla,
    planeta_origen,
    peso,
    nombre,
    color_piel,
    especies,
    naves,
    url,
    vehiculos } = req.body;

  const peopleId = v4();
  const creado = (new Date()).toISOString();
  const editado = (new Date()).toISOString();

  if (typeof peopleId !== "string") {
    res.status(400).json({ error: '"peopleId" debe ser un string' });
  } else if (typeof nombre !== "string") {
    res.status(400).json({ error: '"nombre" debe ser un string' });
  }

  const params = {
    TableName: PEOPLE_TABLE,
    Item: {
      peopleId: peopleId,
      anio_nacimiento: anio_nacimiento,
      color_ojos: color_ojos,
      peliculas: peliculas,
      genero: genero,
      color_cabello: color_cabello,
      talla: talla,
      planeta_origen: planeta_origen,
      peso: peso,
      nombre: nombre,
      color_piel: color_piel,
      creado: creado,
      editado: editado,
      especies: especies,
      naves: naves,
      url: url,
      vehiculos: vehiculos
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ peopleId,
      anio_nacimiento,
      color_ojos,
      peliculas,
      genero,
      color_cabello,
      talla,
      planeta_origen,
      peso,
      nombre,
      creado,
      editado,
      color_piel,
      especies,
      naves,
      url,
      vehiculos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "No se pudo crear a persona" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
