import { User } from '../types';

const API_BASE = 'http://localhost:5000/api/enseignants';

export async function fetchEnseignants(): Promise<User[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Erreur de chargement');
    return res.json();
}

export async function addEnseignant(data: Omit<User, 'id' | 'role'>): Promise<User> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur d'ajout");
    return res.json();
}

export async function updateEnseignant(id: string | number, data: Omit<User, 'id' | 'role'>): Promise<User> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur de mise à jour");
    return res.json();
}

export async function deleteEnseignant(id: string | number): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Erreur de suppression");
}
