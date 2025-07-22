export const availabilitySlots = [
    {
        fieldId: null, // Sera rempli dynamiquement lors du seeding
        dayOfWeek: 1, // Lundi
        openingTime: "00:00",
        closingTime: "12:00",
        priceMultiplier: [
            { startTime: "00:00", endTime: "06:00", multiplier: 1.0 },
            { startTime: "06:00", endTime: "12:00", multiplier: 1.2 },
        ],
    },
    {
        fieldId: null,
        dayOfWeek: 2, // Mardi
        openingTime: "08:00",
        closingTime: "23:00",
        priceMultiplier: [
            { startTime: "08:00", endTime: "18:00", multiplier: 1.0 },
            { startTime: "18:00", endTime: "23:00", multiplier: 1.5 },
        ],
    },
    {
        fieldId: null,
        dayOfWeek: 3, // Mercredi
        openingTime: "08:00",
        closingTime: "23:00",
        priceMultiplier: [
            { startTime: "08:00", endTime: "18:00", multiplier: 1.0 },
            { startTime: "18:00", endTime: "23:00", multiplier: 1.5 },
        ],
    },
    {
        fieldId: null,
        dayOfWeek: 4, // Jeudi
        openingTime: "08:00",
        closingTime: "23:00",
        priceMultiplier: [
            { startTime: "08:00", endTime: "18:00", multiplier: 1.0 },
            { startTime: "18:00", endTime: "23:00", multiplier: 1.5 },
        ],
    },
    {
        fieldId: null,
        dayOfWeek: 5, // Vendredi
        openingTime: "08:00",
        closingTime: "23:00",
        priceMultiplier: [
            { startTime: "08:00", endTime: "18:00", multiplier: 1.2 },
            { startTime: "18:00", endTime: "23:00", multiplier: 2.0 },
        ],
    },
    {
        fieldId: null,
        dayOfWeek: 6, // Samedi
        openingTime: "08:00",
        closingTime: "23:00",
        priceMultiplier: [
            { startTime: "08:00", endTime: "18:00", multiplier: 1.5 },
            { startTime: "18:00", endTime: "23:00", multiplier: 2.0 },
        ],
    },
    {
        fieldId: null,
        dayOfWeek: 0, // Dimanche
        openingTime: "08:00",
        closingTime: "23:00",
        priceMultiplier: [
            { startTime: "08:00", endTime: "18:00", multiplier: 1.5 },
            { startTime: "18:00", endTime: "23:00", multiplier: 2.0 },
        ],
    },
];