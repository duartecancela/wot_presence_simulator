/********************************************************************************
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
 *
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/

let count;
let lastChange;
let presenceCount = 0;

WoT.produce({
    title: "Counter",
    uriVariables: {
        step: {
            type: "integer",
            minimum: 1,
            maximum: 250,
        },
    },
    properties: {
        count: {
            title: "Count",
            type: "integer",
            description: "Current counter value",
            observable: true,
            readOnly: true,
        },
        lastChange: {
            title: "Last change",
            type: "string",
            description: "Last change of counter value",
            observable: true,
            readOnly: true,
        },
        presenceCount: {
            title: "Presence Count",
            type: "integer",
            description: "Number of simulated people",
            observable: true,
            readOnly: true,
        },
    },
    actions: {
        increment: {
            title: "Increment",
            uriVariables: {
                step: {
                    type: "integer",
                    minimum: 1,
                    maximum: 250,
                },
            },
        },
        decrement: {
            title: "Decrement",
            uriVariables: {
                step: {
                    type: "integer",
                    minimum: 1,
                    maximum: 250,
                },
            },
        },
        reset: {
            title: "Reset",
        },
        startPresenceSimulation: {
            title: "Simulate One Presence Detection",
        },
    },
    events: {
        change: {
            title: "Changed",
        },
    },
})
    .then((thing) => {
        console.log("Produced " + thing.getThingDescription().title);
        count = 0;
        lastChange = new Date().toISOString();

        thing.setPropertyReadHandler("count", async () => count);
        thing.setPropertyReadHandler("lastChange", async () => lastChange);
        thing.setPropertyReadHandler("presenceCount", async () => presenceCount);

        thing.setActionHandler("increment", async (params, options) => {
            let step = 1;
            if (options?.uriVariables?.step) {
                step = options.uriVariables.step;
            }
            count += step;
            lastChange = new Date().toISOString();
            console.log(`Incrementing count to ${count}`);
            thing.emitEvent("change", count);
            thing.emitPropertyChange("count");
        });

        thing.setActionHandler("decrement", async (params, options) => {
            let step = 1;
            if (options?.uriVariables?.step) {
                step = options.uriVariables.step;
            }
            count -= step;
            lastChange = new Date().toISOString();
            console.log(`Decrementing count to ${count}`);
            thing.emitEvent("change", count);
            thing.emitPropertyChange("count");
        });

        thing.setActionHandler("reset", async () => {
            count = 0;
            lastChange = new Date().toISOString();
            console.log("Resetting count");
            thing.emitEvent("change", count);
            thing.emitPropertyChange("count");
        });

        // === ADDED: Only simulate once when client requests ===
        thing.setActionHandler("startPresenceSimulation", async () => {
            const added = Math.floor(Math.random() * 3) + 1;
            presenceCount += added;
            console.log(`[Presence Simulator] Detected ${added} new people. Total: ${presenceCount}`);
            thing.emitPropertyChange("presenceCount");
        });

        thing.expose().then(() => {
            console.info(thing.getThingDescription().title + " ready");
        });
    })
    .catch((err) => {
        console.error("Error producing Thing", err);
    });
