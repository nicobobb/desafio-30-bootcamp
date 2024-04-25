import fs, { constants } from "node:fs";
import { Buffer } from "node:buffer";
import prompt from "prompt-sync";

import cls from "colors";

const promptFunc = prompt();

const opciones = [
    { letra: "R", descripcion: "Leer archivo" },
    { letra: "E", descripcion: "Editar archivo" },
    { letra: "C", descripcion: "Crear archivo" },
    { letra: "D", descripcion: "Eliminar archivo" },
    { letra: "Q", descripcion: "Salir" },
];
const mostrarMenu = () => {
    console.table(opciones);
    const letra = promptFunc(
        cls.blue("Ingrese la opción deseada: ")
    ).toUpperCase();
    return letra;
};

const validarAccion = (letra) => {
    return opciones.some((opcion) => opcion.letra === letra);
};

const obtenerNombreArchivo = () => {
    return promptFunc(cls.blue("Ingrese el nombre del archivo: "));
};

const leerArchivo = (fileName) => {
    try {
        const dirName = `./files/${fileName}`;
        fs.accessSync(dirName, constants.R_OK);
        const file = fs.readFileSync(dirName);
        const data = file.toString();
        console.log(cls.green(data));
    } catch (error) {
        console.log(cls.red("Este archivo no se puede leer"));
    }
};

const crearArchivo = (fileName, data) => {
    try {
        const dirName = `./files/${fileName}`;
        const buffer = new Uint8Array(Buffer.from(data));
        fs.writeFileSync(dirName, buffer);
        console.log(cls.green("El archivo se ha creado correctamente"));
    } catch (error) {
        console.log(cls.red("Lo sentimos, no hemos podido crear el archivo"));
    }
};

const editarArchivo = (fileName) => {
    try {
        const dirName = `./files/${fileName}`;
        fs.accessSync(dirName, constants.R_OK | constants.W_OK);
        const newData = promptFunc(
            cls.blue("Ingrese el contenido del archivo: ")
        );
        const buffer = new Uint8Array(Buffer.from(newData));
        fs.writeFileSync(dirName, buffer);
        console.log(cls.green("El archivo se ha modificado correctamente"));
    } catch (error) {
        console.log(
            cls.red("Lo sentimos, no hemos podido modificar el archivo")
        );
    }
};

const eliminarArchivo = (fileName) => {
    try {
        const dirName = `./files/${fileName}`;
        fs.rmSync(dirName);
        console.log(cls.green("El archivo se ha eliminado correctamente"));
    } catch (error) {
        console.log(
            cls.red("Lo sentimos, no hemos podido eliminar el archivo")
        );
    }
};

const fileController = () => {
    let letra;
    do {
        letra = mostrarMenu();
    } while (!validarAccion(letra));

    if (letra === "Q") {
        return;
    }

    const fileName = obtenerNombreArchivo();

    switch (letra) {
        case "R":
            leerArchivo(fileName);
            break;
        case "C":
            const data = promptFunc(
                cls.blue("Ingrese el contenido del archivo: ")
            );
            crearArchivo(fileName, data);
            break;
        case "E":
            editarArchivo(fileName);
            break;
        case "D":
            eliminarArchivo(fileName);
            break;
        default:
            console.log(cls.red("Opción no válida."));
    }
};

fileController();
