"use client";

import { useEffect } from "react";

export default function UnregisterRootSW() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (let registration of registrations) {
                    // Check if the service worker is registered at the root scope
                    if (registration.scope.endsWith("/") && !registration.scope.includes("/calculator")) {
                        registration.unregister().then(() => {
                            console.log("Unregistered legacy root Service Worker:", registration.scope);
                        });
                    }
                }
            });
        }
    }, []);

    return null;
}
