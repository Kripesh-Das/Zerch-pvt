import { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_LOGS, generateRandomLog } from '../data/mockData';

export function useLogs() {
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [paused, setPaused] = useState(false);
    const [connected, setConnected] = useState(true);
    const pausedRef = useRef(paused);
    pausedRef.current = paused;

    useEffect(() => {
        // Disabled automatic mock log generation
        return () => { };
    }, [connected]);

    const simulateEvent = useCallback(() => {
        // Disabled simulation burst since it uses mock data
        console.log("Simulation disabled as per user request to remove mock data.");
    }, []);

    const togglePause = useCallback(() => setPaused(p => !p), []);
    const toggleConnect = useCallback(() => setConnected(c => !c), []);

    return { logs, setLogs, paused, connected, togglePause, toggleConnect, simulateEvent };
}
