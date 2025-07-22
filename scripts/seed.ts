import clientPromise from "../lib/mongodb";
import { terrains } from "./data/terrains";
import { users } from "./data/users";
import { reservations } from "./data/reservations";
import { payments } from "./data/payments";
import { availabilitySlots } from "./data/availabilitySlots";
import { AvailabilitySlot } from "@/models/availabilitySlot";

async function seedDatabase() {
    const client = await clientPromise;
    const db = client.db("terrainBooking");

    try {
        console.log("Seeding database...");
        
        // 1. Insertion des utilisateurs
        console.log("Insertion des utilisateurs...");
        await db.collection("users").deleteMany({});
        const userInsertResult = await db.collection("users").insertMany(users);
        const userIds = Object.values(userInsertResult.insertedIds);
        
        // 2. Insertion des terrains et assignation des propriétaires (ownerId) et gérants (managerId)
        console.log("Insertion des terrains...");
        const ownerUsers = userIds.filter((_, index) => users[index].role === "proprio");
        const managerUsers = userIds.filter((_, index) => users[index].role === "gerant");
        
        console.log(`Trouvé ${ownerUsers.length} propriétaires et ${managerUsers.length} gérants`);
        
        const terrainsWithOwnersAndManagers = terrains.map((terrain, index) => ({
            ...terrain,
            ownerId: ownerUsers[index % ownerUsers.length],
            managerId: managerUsers[index % managerUsers.length], // Assignation cyclique des gérants
        }));
        
        await db.collection("terrains").deleteMany({});
        const terrainInsertResult = await db.collection("terrains").insertMany(terrainsWithOwnersAndManagers);
        const terrainIds = Object.values(terrainInsertResult.insertedIds);
        
        // 3. Insertion des créneaux de disponibilité pour chaque terrain
        console.log("Insertion des créneaux de disponibilité...");
        
        // Créer des disponibilités pour chaque terrain
        const allTerrainAvailabilities:AvailabilitySlot[] = [];
        
        // Pour chaque terrain, on ajoute les disponibilités pour chaque jour de la semaine
        terrainIds.forEach((terrainId) => {
            availabilitySlots.forEach((slot:AvailabilitySlot) => {
                // Légère variation des horaires pour certains terrains pour simuler des différences
                const openingTimeHour = parseInt(slot.openingTime.split(':')[0]);
                const closingTimeHour = parseInt(slot.closingTime.split(':')[0]);
                
                // Modifier légèrement les heures d'ouverture pour certains terrains (variation de +/- 1 heure)
                const randomVariation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                
                // Formatage des nouvelles heures avec padding (ex: "08:00")
                const newOpeningTime = `${String(Math.max(6, Math.min(10, openingTimeHour + randomVariation))).padStart(2, '0')}:00`;
                const newClosingTime = `${String(Math.max(20, Math.min(23, closingTimeHour + randomVariation))).padStart(2, '0')}:00`;
                
                // Créer une copie du créneau avec le terrainId spécifique et les variations d'horaires
                allTerrainAvailabilities.push({
                    ...slot,
                    fieldId: terrainId,
                    openingTime: newOpeningTime,
                    closingTime: newClosingTime,
                });
            });
        });
        
        await db.collection("availabilitySlots").deleteMany({});
        await db.collection("availabilitySlots").insertMany(allTerrainAvailabilities);
        
        // 4. Insertion des réservations liées aux terrains
        console.log("Insertion des réservations...");
        const reservationsWithTerrains = reservations.map((reservation, index) => ({
            ...reservation,
            fieldId: terrainIds[index % terrainIds.length]
        }));
        
        await db.collection("reservations").deleteMany({});
        const reservationInsertResult = await db.collection("reservations").insertMany(reservationsWithTerrains);
        const reservationIds = Object.values(reservationInsertResult.insertedIds);
        
        // 5. Insertion des paiements liés aux réservations
        console.log("Insertion des paiements...");
        const paymentsWithReservations = payments.map((payment, index) => ({
            ...payment,
            reservationId: reservationIds[index % reservationIds.length]
        }));
        
        await db.collection("payments").deleteMany({});
        const paymentInsertResult = await db.collection("payments").insertMany(paymentsWithReservations);
        const paymentIds = Object.values(paymentInsertResult.insertedIds);
        
        // 6. Mise à jour des réservations avec les ID de paiement correspondants
        console.log("Mise à jour des relations entre réservations et paiements...");
        for (let i = 0; i < Math.min(reservationIds.length, paymentIds.length); i++) {
            await db.collection("reservations").updateOne(
                { _id: reservationIds[i] },
                { $set: { paymentId: paymentIds[i] } }
            );
        }
        
        console.log("Données insérées avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'initialisation des données :", error);
    } finally {
        process.exit();
    }
}

seedDatabase();