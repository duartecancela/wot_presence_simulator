/********************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 * Document License (2015-05-13) which is available at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
 *
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/

function getFormIndexForDecrementWithCoAP(thing) {
    const forms = thing.getThingDescription().actions?.decrement.forms;
    if (forms !== undefined) {
        for (let i = 0; i < forms.length; i++) {
            if (/^coaps?:\/\/.*/.test(forms[i].href)) {
                return i;
            }
        }
    }
    // return formIndex: 0 if no CoAP target IRI found
    return 0;
}

WoT.requestThingDescription("coap://localhost:5683/counter")
    .then(async (td) => {
        try {
            const thing = await WoT.consume(td);
            console.info("=== TD ===");
            console.info(td);
            console.info("==========");

            // read property #1
            const read1 = await thing.readProperty("count");
            console.log("count value is", await read1.value());

            // increment property #1 (without step)
            await thing.invokeAction("increment");
            const inc1 = await thing.readProperty("count");
            console.info("count value after increment #1 is", await inc1.value());

            // increment property #2 (with step)
            await thing.invokeAction("increment", undefined, { uriVariables: { step: 3 } });
            const inc2 = await thing.readProperty("count");
            console.info("count value after increment #2 (with step 3) is", await inc2.value());

            // look for the first form for decrement with CoAP binding
            await thing.invokeAction("decrement", undefined, {
                formIndex: getFormIndexForDecrementWithCoAP(thing),
            });
            const dec1 = await thing.readProperty("count");
            console.info("count value after decrement is", await dec1.value());

            // === ADDED: trigger presence simulation ===
            await thing.invokeAction("startPresenceSimulation");
            console.info("Requested start of presence simulation.");

            // === ADDED: observe presenceCount once then exit ===
            thing.observeProperty("presenceCount", async (data) => {
                console.log(`[Property] Simulated presence count updated: ${await data.value()}`);
                process.exit(0); // terminate like original
            });

            // fallback timeout to avoid hanging forever
            setTimeout(() => {
                console.warn("No update received from presenceCount. Exiting...");
                process.exit(0);
            }, 5000);
        } catch (err) {
            console.error("Script error:", err);
        }
    })
    .catch((err) => {
        console.error("Fetch error:", err);
    });
