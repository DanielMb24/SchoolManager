
// frontend/src/types/index.ts
export interface User {
    id: string | number; // Sera généré par le backend
    nom: string;
    prenom: string;
    email: string;
    role: 'administrateur' | 'enseignant' | 'etudiant';
    // Ajoutez d'autres champs si nécessaire (ex: classe pour étudiant, matière pour enseignant)
    matricule?: string; // Pour étudiant
    specialite?: string; // Pour enseignant
    dateInscription?: string;
}

export interface UserDataLocalStorage {
    nom: string;
    role: 'administrateur' | 'enseignant' | 'etudiant' | string; // Gardez la flexibilité initiale si besoin
}

