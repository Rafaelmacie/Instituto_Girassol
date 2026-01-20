// src/models/curso/material.ts
import { TipoMaterial } from "../../../../shared/constants/tipoMaterial";

export class Material {
    constructor(
        public idMaterial: number,
        public titulo: string,
        public url: string,
        public descricao: string,
        public tipo: TipoMaterial,
        public idAula: number
    ) {}
}