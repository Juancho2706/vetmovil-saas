export const SERVICES_CATALOG = [
    { id: 'srv_01', name: 'Consulta Domicilio Base', price: 35000 },
    { id: 'srv_02', name: 'Vacuna Óctuple', price: 18000 },
    { id: 'srv_03', name: 'Vacuna Antirrábica', price: 15000 },
    { id: 'srv_04', name: 'Desparasitación Interna', price: 8000 },
    { id: 'srv_05', name: 'Corte de Uñas', price: 5000 },
    { id: 'srv_06', name: 'Limpieza Oídos', price: 12000 },
    { id: 'srv_07', name: 'Inyección (Aplicación)', price: 5000 },
];

export const INITIAL_PETS = [
    {
        id: 1,
        ownerId: 'client-001',
        ownerName: 'Sofía Rodríguez',
        address: 'Av. Las Condes 1234, Santiago',
        name: 'Max',
        type: 'Perro',
        breed: 'Golden Retriever',
        age: 4,
        weight: 32.5,
        chipId: '981000123456',
        sterilized: true,
        allergies: ['Pollo', 'Picaduras de pulga'],
        alerts: ['Ansioso con tormentas'],
        lastCheckup: '2023-10-15',
        image: '🐕',
        vaccines: [
            { id: 'vac_1', name: 'Antirrábica', date: '2023-10-15', nextDue: '2024-10-15' },
            { id: 'vac_2', name: 'Óctuple', date: '2023-05-20', nextDue: '2024-05-20' }
        ],
        history: [
            {
                id: 'hist_01',
                date: '2023-10-15',
                reason: 'Control Anual',
                diagnosis: 'Paciente sano, peso ideal.',
                treatment: 'Vacunación y desparasitación.',
                cost: 50000,
                vetName: 'Dr. Alejandro'
            },
            {
                id: 'hist_02',
                date: '2023-02-10',
                reason: 'Dermatitis',
                diagnosis: 'Alergia alimentaria leve.',
                treatment: 'Cambio de dieta a hipoalergénica + Corticoides 5 días.',
                cost: 42000,
                vetName: 'Dr. Alejandro'
            }
        ]
    },
    {
        id: 2,
        ownerId: 'client-001',
        ownerName: 'Sofía Rodríguez',
        address: 'Av. Las Condes 1234, Santiago',
        name: 'Luna',
        type: 'Gato',
        breed: 'Siamés',
        age: 2,
        weight: 4.1,
        chipId: '981000789012',
        sterilized: true,
        allergies: [],
        alerts: ['Difícil manejo', 'Usa guantes'],
        lastCheckup: '2024-01-20',
        image: '🐈',
        vaccines: [
            { id: 'vac_3', name: 'Triple Felina', date: '2024-01-20', nextDue: '2025-01-20' }
        ],
        history: []
    }
];

export const INITIAL_APPOINTMENTS = [
    {
        id: 'appt_101',
        ownerId: 'client-002',
        ownerName: 'Carlos Pérez',
        ownerRut: '15.444.333-2',
        petName: 'Rocky',
        description: 'Tiene mucha tos y no quiere comer desde ayer.',
        address: 'Calle Falsa 123, Santiago',
        date: '2024-05-25',
        status: 'pending_admission',
        paid: true
    }
];

export const MOCK_USERS = {
    vet: { id: 'vet-001', name: 'Dr. Alejandro Martínez', role: 'vet', slug: 'dr-alejandro' },
    client: { id: 'client-001', name: 'Sofía Rodríguez', role: 'client', address: 'Av. Las Condes 1234' }
};
