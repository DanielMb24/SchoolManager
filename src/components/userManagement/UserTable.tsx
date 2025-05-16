// frontend/src/components/userManagement/UserTable.tsx
import React, {JSX} from 'react';
import { User } from '../../types';

interface Column {
    Header: string;
    accessor?: keyof User | string; // Peut être une clé de User ou une chaîne pour les cellules personnalisées
    Cell?: (props: { row: { original: User } }) => JSX.Element; // Pour le rendu personnalisé des cellules (ex: boutons d'action)
}

interface UserTableProps {
    columns: Column[];
    data: User[];
}

const UserTable: React.FC<UserTableProps> = ({ columns, data }) => {
    if (!data.length) {
        return <p className="text-center text-gray-500 py-4">Aucune donnée à afficher.</p>;
    }

    return (
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            {column.Header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((user, rowIndex) => (
                    <tr key={user.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                        {columns.map((column, colIndex) => (
                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {column.Cell
                                    ? column.Cell({ row: { original: user } })
                                    : column.accessor && user[column.accessor as keyof User] !== undefined
                                        ? String(user[column.accessor as keyof User])
                                        : 'N/A'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;