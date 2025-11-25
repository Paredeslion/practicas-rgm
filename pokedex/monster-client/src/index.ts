import { MonstersService } from "./classes/monsters.service";

import type {Monster, MonsterInsert} from "./interfaces/monsters.interface";

// Servicio para hablar con el servidor
const monstersService = new MonstersService();

// Elementos del DOM 
const monsterList = document.getElementById("monster-list") as HTMLUListElement;
const template = document.getElementById("monster-card-template") as HTMLTemplateElement;
const form = document.getElementById("add-form") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const typeInput = document.getElementById("type") as HTMLSelectElement;
const photoInput = document.getElementById("photo") as HTMLInputElement;
const imgPreview = document.getElementById("preview") as HTMLImageElement;

// Función para controlar el límite de 6 monstruos por equipo
const checkMonsterLimit = () => {
	const currentMonsters = monsterList.children.length;

	if (currentMonsters >= 6) {
		form.classList.add("hidden");
	} else {
		form.classList.remove("hidden");
	}
};

const createMonsterCard = (monster: Monster) : HTMLElement => {
	const clone = template.content.cloneNode(true) as DocumentFragment;
	const item = clone.firstElementChild as HTMLElement;

	const monsterImage = item.querySelector("img") as HTMLImageElement;
	monsterImage.src = monster.photo;

	const monsterName = item.querySelector(".monster-name") as HTMLElement;
	monsterName.textContent = monster.name;

	const monsterType = item.querySelector(".type-badge") as HTMLSpanElement;
	monsterType.textContent = monster.type;
	const deleteButton = item.querySelector(".delete-btn") as HTMLButtonElement;

	deleteButton.addEventListener("click", async () => {
		try {
			// Calling the server to delete from the screen
			await monstersService.deleteMonster(monster.id)

			// If the server says that is ok, delete it
			item.remove();

			// Ckeck the number of gifts
			checkMonsterLimit();
		} catch (error) {
			alert("Error deleting monster");
		}
	});
	// Returning the item card
	return item;
}

// Función para cargar los monstruos
const loadMonsters = async () => {
	try {
		const monsters = await monstersService.getMonsters();
		monsters.forEach((p) => {
			monsterList.appendChild(createMonsterCard(p));
		});
	} catch (error) {
		console.log("Error cargando monstruos");
	}
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (file) {
    const reader = new FileReader();
    // Cuando el lector termine de leer el archivo...
    reader.onload = (e) => {
      // ...ponemos el resultado (Base64) en la imagen fantasma
      imgPreview.src = e.target?.result as string;
      imgPreview.classList.remove("hidden"); // La hacemos visible
    };
    reader.readAsDataURL(file); // ¡Empieza a leer!
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
	// Si no existe la lista de archivos O si NO hay un primer archivo en esa lista (es decir que NO han elegido una foto)
	if (!photoInput.files || !photoInput.files[0]) return;

	const newMonster: MonsterInsert = {
		name: nameInput.value,
		type: typeInput.value,
		photo: imgPreview.src
	};

	try {
    // 4. Enviar al servidor (POST) y esperar confirmación
    // 'createdPresent' es el regalo que vuelve con su ID nuevo
    const createdMonster = await monstersService.addMonster(newMonster);
    
    // 5. Pintarlo en la pantalla (Sin recargar)
    monsterList.appendChild(createMonsterCard(createdMonster));
    
    // 6. Limpieza
    form.reset();
    imgPreview.classList.add("hidden");
    
    // 7. ¡Portero! ¿Hemos llegado a 6?
    checkMonsterLimit();

  } catch (error) {
    alert("Error adding monster");
  }
});

loadMonsters();