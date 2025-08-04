import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from '../../firebase/Config';
import { Evento } from "../../src/types";


export function useEventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {
        const eventosRef = ref(db, "eventos");

        const unsubscribe = onValue(eventosRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setEventos(Object.values(data) as Evento[]);
            } else {
                setEventos([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return eventos;
}
