import  { Http } from "./http.class";
import { SERVER } from "../constants";

import type {
	MonsterInsert,
	Monster
} from "../interfaces/monsters.interface";

export class MonstersService {
	#http: Http;

	constructor() {
		this.#http = new Http();
	}

	async getMonsters(): Promise<Monster[]> {
		const response = await this.#http.get<Monster[]>(`${SERVER}/monsters`)
		return response;
	}

	async addMonster(monster: MonsterInsert): Promise<Monster> {
		// El primer parámetro de post es lo que RECIBES y el segundo lo que ENVIAS
		// En este caso lo que recibo tiene id por eso uso Monster, pero lo que envío NO tiene id por eso uso MonsterInsert 
		const response = await this.#http.post<Monster, MonsterInsert>(`${SERVER}/monsters`, monster);
		return response;
	}

	async deleteMonster(id: number): Promise<void> {
    await this.#http.delete<void>(`${SERVER}/monsters/${id}`);
  }
}