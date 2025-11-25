export interface MonsterInsert {
	name: string;
	type: string;
	photo: string;
}

export interface Monster extends MonsterInsert {
	id: number;
}