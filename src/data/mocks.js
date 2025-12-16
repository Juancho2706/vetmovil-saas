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

export const VET_AVAILABILITY = {
    workDays: [1, 2, 3, 4, 5], // Mon-Fri
    startHour: 9,
    endHour: 18,
    slotDuration: 60, // minutes
    bufferTime: 30 // minutes travel
};

export const CLINICAL_TEMPLATES = [
    {
        id: 'tmpl_01',
        name: 'Control Sano',
        reason: 'Control Preventivo',
        subjective: 'Paciente acude a control preventivo anual. Propietario reporta estado de ánimo normal, apetito conservado y deposiciones normales.',
        objective: 'Mucosas rosadas, tiempo de llenado capilar < 2s. Ganglios no palpables. Auscultación cardíaca y pulmonar sin particularidades. Peso estable.',
        assessment: 'Paciente clínicamente sano.',
        plan: 'Se administra vacunación anual según calendario. Próximo control en 1 año.'
    },
    {
        id: 'tmpl_02',
        name: 'Problema Piel',
        reason: 'Consulta Dermatológica',
        subjective: 'Propietario reporta prurito intenso en zona dorsolumbar hace 3 días. Se lame constantemente.',
        objective: 'Alopecia focal en zona dorsal, eritema moderado y presencia de pústulas. Presencia de heces de pulga.',
        assessment: 'Dermatitis Alérgica por Picadura de Pulga (DAPP).',
        plan: '1. Desparasitación externa (Simparica/Nexgard).\n2. Corticoides orales por 5 días.\n3. Baño sanitario.\nControl en 7 días.'
    },
    {
        id: 'tmpl_03',
        name: 'Gastroentérico',
        reason: 'Vómitos/Diarrea',
        subjective: 'Presenta vómitos de contenido alimenticio (2 en 24h) y diarrea pastosa. Ánimo decaído.',
        objective: 'Dolor abdominal leve a la palpación. Deshidratación 5%. T° 38.9°C.',
        assessment: 'Gastroenteritis aguda inespecífica.',
        plan: '1. Ayuno de sólidos 12h.\n2. Omeprazol 1mg/kg cada 24h.\n3. Probióticos 1 sobre al día.\n4. Dieta blanda posterior al ayuno.'
    }
];
