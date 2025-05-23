/********************************************************************************
 * Copyright (c) 2022 Contributors to the Eclipse Foundation
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
import { ProtocolHelpers } from "@node-wot/core";
import fetch, { RequestInit, Request } from "node-fetch";
import { Readable } from "stream";
import { HttpForm, HTTPMethodName } from "./http";
import HttpClient from "./http-client-impl";

export default class BrowserHttpClient extends HttpClient {
    protected async generateFetchRequest(
        form: HttpForm,
        defaultMethod: HTTPMethodName,
        additionalOptions?: RequestInit
    ): Promise<Request> {
        // See https://github.com/eclipse-thingweb/node-wot/issues/790
        if (additionalOptions?.body instanceof Readable) {
            const buffer = await ProtocolHelpers.readStreamFully(additionalOptions.body);
            additionalOptions.body = buffer;
        }
        return super.generateFetchRequest(form, defaultMethod, additionalOptions);
    }

    protected async _fetch(request: Request) {
        return fetch(request);
    }
}
